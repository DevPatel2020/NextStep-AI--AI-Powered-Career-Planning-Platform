import { NextRequest, NextResponse } from "next/server";
import { UploadError, extractResumeText, getUploadedFile } from "@/lib/uploads";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = getUploadedFile(formData.get("file"));

        const text = await extractResumeText(file);

        return NextResponse.json({ text });
    } catch (error) {
        if (error instanceof UploadError) {
            return NextResponse.json({ error: error.message }, { status: error.status });
        }
        console.error("Resume parsing error:", error);
        return NextResponse.json({ error: "Failed to parse resume" }, { status: 500 });
    }
}
