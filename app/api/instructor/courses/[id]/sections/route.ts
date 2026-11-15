import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canViewCourse } from "@/lib/course-access";

// POST /api/instructor/courses/[id]/sections — Add section
export async function POST(req: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const course = await prisma.course.findFirst({
        where: { id: params.id, authorId: session.user.id },
    });
    if (!course) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const { title } = await req.json().catch(() => ({}));
    if (typeof title !== "string" || !title.trim()) return NextResponse.json({ error: "Section title is required" }, { status: 400 });

    const count = await prisma.section.count({ where: { courseId: params.id } });
    const section = await prisma.section.create({
        data: { title: title.trim().slice(0, 200), order: count + 1, courseId: params.id },
    });
    return NextResponse.json({ section });
}

// GET /api/instructor/courses/[id]/sections — List sections
export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const session = await getServerSession(authOptions);
    if (!(await canViewCourse(params.id, session?.user?.id || undefined))) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const sections = await prisma.section.findMany({
        where: { courseId: params.id },
        orderBy: { order: "asc" },
        include: { lectures: { orderBy: { order: "asc" } } },
    });
    return NextResponse.json({ sections });
}
