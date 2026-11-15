import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PUT /api/progress/[lectureId] — Mark lecture complete/incomplete
export async function PUT(req: NextRequest, props: { params: Promise<{ lectureId: string }> }) {
    const params = await props.params;
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const studentId = session.user.id;
    if (!studentId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const isComplete = body?.isComplete;

    // Only students enrolled in the (published) course, or its author, may
    // track progress. Also turns an unknown lectureId into a 404 instead of
    // a foreign-key 500.
    const lecture = await prisma.lecture.findFirst({
        where: {
            id: params.lectureId,
            section: {
                course: {
                    OR: [
                        { authorId: studentId },
                        { status: "PUBLISHED", enrollments: { some: { studentId } } },
                    ],
                },
            },
        },
        select: { id: true },
    });
    if (!lecture) return NextResponse.json({ error: "Lecture not found or not enrolled" }, { status: 404 });

    const progress = await prisma.progress.upsert({
        where: { studentId_lectureId: { studentId, lectureId: params.lectureId } },
        create: { studentId, lectureId: params.lectureId, isComplete: !!isComplete },
        update: { isComplete: !!isComplete },
    });
    return NextResponse.json({ progress });
}
