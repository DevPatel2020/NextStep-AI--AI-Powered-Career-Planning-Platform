import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { courseVisibilityFilter } from "@/lib/course-access";
import { getUploadedFile, isLectureType, sanitizeFilename, validateLectureFile } from "@/lib/uploads";

// POST /api/sections/[id]/lectures — Add lecture with optional file upload
export async function POST(req: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Verify the section belongs to a course owned by this user
    const section = await prisma.section.findFirst({
        where: { id: params.id },
        include: { course: true },
    });
    if (!section || section.course.authorId !== session.user.id)
        return NextResponse.json({ error: "Not found" }, { status: 404 });

    const formData = await req.formData();
    const rawTitle = formData.get("title");
    const type = formData.get("type"); // VIDEO, PDF, QUIZ, TEXT
    const rawText = formData.get("textContent");
    const file = getUploadedFile(formData.get("file"));

    const title = typeof rawTitle === "string" ? rawTitle.trim().slice(0, 200) : "";
    const textContent = typeof rawText === "string" ? rawText : "";
    if (!title || !type) return NextResponse.json({ error: "title and type are required" }, { status: 400 });
    if (!isLectureType(type)) return NextResponse.json({ error: "Invalid lecture type" }, { status: 400 });

    let contentUrl: string | null = null;
    // Files only apply to VIDEO/PDF lectures; ignore a stale file left in the
    // form after the instructor switched the lecture type.
    if (file && file.size > 0 && (type === "VIDEO" || type === "PDF")) {
        const fileError = validateLectureFile(type, file);
        if (fileError) return NextResponse.json({ error: fileError }, { status: 400 });

        // Never trust the client filename: it could contain "../" segments
        // (path traversal) or an HTML/script extension served from /public.
        const fileName = `${Date.now()}-${randomUUID().slice(0, 8)}-${sanitizeFilename(file.name)}`;
        const uploadDir = path.join(process.cwd(), "public", "uploads", "lectures");
        await fs.mkdir(uploadDir, { recursive: true });
        await fs.writeFile(path.join(uploadDir, fileName), Buffer.from(await file.arrayBuffer()));
        contentUrl = `/uploads/lectures/${fileName}`;
    }

    const count = await prisma.lecture.count({ where: { sectionId: params.id } });
    const lecture = await prisma.lecture.create({
        data: {
            title,
            type,
            contentUrl,
            textContent: textContent || null,
            duration: null,
            order: count + 1,
            sectionId: params.id,
        },
    });
    return NextResponse.json({ lecture });
}

// GET /api/sections/[id]/lectures
export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const session = await getServerSession(authOptions);
    const lectures = await prisma.lecture.findMany({
        where: {
            sectionId: params.id,
            section: { course: courseVisibilityFilter(session?.user?.id || undefined) },
        },
        orderBy: { order: "asc" },
    });
    return NextResponse.json({ lectures });
}
