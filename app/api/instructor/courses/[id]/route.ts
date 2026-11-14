import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function verifyCourseOwner(courseId: string, userId: string) {
    const course = await prisma.course.findFirst({ where: { id: courseId, authorId: userId } });
    return course;
}

// GET /api/instructor/courses/[id] — Get full course with sections + lectures
export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const course = await prisma.course.findFirst({
        where: {
            id: params.id,
            OR: [
                { authorId: session.user.id },
                { status: "PUBLISHED" },
            ],
        },
        include: {
            sections: {
                orderBy: { order: "asc" },
                include: { lectures: { orderBy: { order: "asc" } } },
            },
            author: { select: { name: true, organizationName: true } },
        },
    });

    if (!course) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ course });
}

// PUT /api/instructor/courses/[id] — Update metadata
export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const course = await verifyCourseOwner(params.id, session.user.id);
    if (!course) return NextResponse.json({ error: "Not found or no permission" }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const data: { title?: string; description?: string; price?: number; coverImage?: string | null } = {};
    if (body.title !== undefined) {
        if (typeof body.title !== "string" || !body.title.trim())
            return NextResponse.json({ error: "Title cannot be empty" }, { status: 400 });
        data.title = body.title.trim().slice(0, 200);
    }
    if (body.description !== undefined) data.description = String(body.description ?? "");
    if (body.price !== undefined) {
        const price = Number(body.price);
        if (!Number.isFinite(price) || price < 0)
            return NextResponse.json({ error: "Price must be a non-negative number" }, { status: 400 });
        data.price = price;
    }
    if (body.coverImage !== undefined) data.coverImage = body.coverImage ? String(body.coverImage) : null;

    // Editing a live course sends it back through admin review so unreviewed
    // content can't be swapped into a PUBLISHED course.
    const status = course.status === "PUBLISHED" ? "PENDING" : undefined;

    const updated = await prisma.course.update({
        where: { id: params.id },
        data: { ...data, ...(status && { status }) },
    });
    return NextResponse.json({ course: updated });
}

// DELETE /api/instructor/courses/[id] — Delete Draft course
export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const course = await verifyCourseOwner(params.id, session.user.id);
    if (!course) return NextResponse.json({ error: "Not found or no permission" }, { status: 403 });
    if (course.status !== "DRAFT") return NextResponse.json({ error: "Only DRAFT courses can be deleted" }, { status: 400 });

    await prisma.course.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
}
