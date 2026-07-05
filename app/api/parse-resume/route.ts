import { NextRequest, NextResponse } from "next/server";
import path from "path";
// pdf-parse is imported dynamically in the POST handler to avoid server crashes
import mammoth from "mammoth";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        let text = "";

        if (file.type === "application/pdf") {
            try {
                if (typeof global !== "undefined" && !(global as any).DOMMatrix) {
                    (global as any).DOMMatrix = class DOMMatrix {
                        a=1;b=0;c=0;d=1;e=0;f=0;
                    };
                }
                const pdfParse = require("pdf-parse/lib/pdf-parse.js");
                const data = await pdfParse(buffer);
                text = data.text;
            } catch (pdfError: any) {
                console.error("Internal PDF parsing error:", pdfError);
                throw new Error("PDF parsing failed: " + pdfError.message);
            }
        } else if (
            file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
            file.name.endsWith(".docx")
        ) {
            const result = await mammoth.extractRawText({ buffer });
            text = result.value;
        } else if (file.type === "text/plain" || file.name.endsWith(".txt")) {
            text = buffer.toString("utf-8");
        } else {
            return NextResponse.json(
                { error: "Unsupported file type. Please upload a .txt, .pdf, or .docx file." },
                { status: 400 }
            );
        }

        return NextResponse.json({ text });
    } catch (error: any) {
        console.error("Resume parsing error:", error);
        return NextResponse.json(
            { error: "Failed to parse resume: " + error.message },
            { status: 500 }
        );
    }
}
