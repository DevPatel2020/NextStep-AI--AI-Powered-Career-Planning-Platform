import { NextRequest, NextResponse } from "next/server";
import { UploadError, extractResumeText, getUploadedFile } from "@/lib/uploads";
import { parseResumeWithNER } from "@/lib/resume-ner";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = getUploadedFile(formData.get("file"));

    const text = await extractResumeText(file);

    // Parse with NER
    const structured = await parseResumeWithNER(text);

    return NextResponse.json({ text, structured });
  } catch (error) {
    if (error instanceof UploadError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Resume parsing error:", error);
    return NextResponse.json({ error: "Failed to parse resume" }, { status: 500 });
  }
}
