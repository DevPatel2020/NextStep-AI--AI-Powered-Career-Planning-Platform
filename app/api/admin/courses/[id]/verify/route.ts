import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

// POST /api/admin/courses/[id]/verify — Approve or reject course
export async function POST(req: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const { error } = await requireAdmin();
    if (error) return error;

    const { status } = await req.json().catch(() => ({})); // "PUBLISHED" or "REJECTED"
    if (!["PUBLISHED", "REJECTED"].includes(status))
        return NextResponse.json({ error: "Status must be PUBLISHED or REJECTED" }, { status: 400 });

    // Only courses submitted for review can be approved/rejected; this
    // prevents publishing a DRAFT the instructor never submitted.
    const result = await prisma.course.updateMany({
        where: { id: params.id, status: "PENDING" },
        data: { status },
    });
    if (result.count === 0) {
        return NextResponse.json({ error: "Course not found or not pending review" }, { status: 404 });
    }
    const updated = await prisma.course.findUnique({ where: { id: params.id } });
    return NextResponse.json({ course: updated });
}
