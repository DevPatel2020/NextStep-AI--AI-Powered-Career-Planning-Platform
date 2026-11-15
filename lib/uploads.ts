import path from "path";

export class UploadError extends Error {
  constructor(message: string, public readonly status: number = 400) {
    super(message);
    this.name = "UploadError";
  }
}

export const MAX_RESUME_BYTES = 5 * 1024 * 1024; // 5 MB
export const MAX_LECTURE_BYTES = 200 * 1024 * 1024; // 200 MB

const DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export type ResumeKind = "pdf" | "docx" | "txt";

export function detectResumeKind(file: { name: string; type: string }): ResumeKind | null {
  const name = file.name.toLowerCase();
  if (file.type === "application/pdf" || name.endsWith(".pdf")) return "pdf";
  if (file.type === DOCX_MIME || name.endsWith(".docx")) return "docx";
  if (file.type === "text/plain" || name.endsWith(".txt")) return "txt";
  return null;
}

/** Narrow a FormData entry to an uploaded File (FormData may also hold strings). */
export function getUploadedFile(entry: FormDataEntryValue | null): File | null {
  if (!entry || typeof entry === "string") return null;
  return entry;
}

function ensureDomMatrixPolyfill() {
  // pdf-parse references DOMMatrix, which the Node/Vercel runtime lacks.
  const g = globalThis as unknown as { DOMMatrix?: unknown };
  if (!g.DOMMatrix) {
    g.DOMMatrix = class DOMMatrix {
      a = 1; b = 0; c = 0; d = 1; e = 0; f = 0;
    };
  }
}

/**
 * Validates a resume upload and extracts its plain text.
 * Throws UploadError for anything the client did wrong.
 */
export async function extractResumeText(file: File | null): Promise<string> {
  if (!file) throw new UploadError("No file uploaded");
  if (file.size === 0) throw new UploadError("The uploaded file is empty");
  if (file.size > MAX_RESUME_BYTES) {
    throw new UploadError(`File is too large. Maximum size is ${MAX_RESUME_BYTES / (1024 * 1024)} MB.`, 413);
  }

  const kind = detectResumeKind(file);
  if (!kind) {
    throw new UploadError("Unsupported file type. Please upload a .txt, .pdf, or .docx file.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    if (kind === "pdf") {
      ensureDomMatrixPolyfill();
      // Import the inner module directly: pdf-parse's index.js runs a debug
      // self-test that reads a missing fixture file and crashes on Vercel.
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pdfParse = require("pdf-parse/lib/pdf-parse.js");
      const data = await pdfParse(buffer);
      return String(data.text ?? "");
    }
    if (kind === "docx") {
      const mammoth = (await import("mammoth")).default;
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    }
    return buffer.toString("utf-8");
  } catch (err) {
    console.error("Resume text extraction failed:", err);
    throw new UploadError("Could not read the file. Make sure it is a valid, non-corrupted document.", 422);
  }
}

// ── Lecture uploads ─────────────────────────────────────────────────────────

const LECTURE_EXTENSIONS: Record<string, readonly string[]> = {
  VIDEO: [".mp4", ".webm", ".mov", ".m4v"],
  PDF: [".pdf"],
};

export const LECTURE_TYPES = ["VIDEO", "PDF", "QUIZ", "TEXT"] as const;
export type LectureType = (typeof LECTURE_TYPES)[number];

export function isLectureType(value: unknown): value is LectureType {
  return typeof value === "string" && (LECTURE_TYPES as readonly string[]).includes(value);
}

/**
 * Produces a filesystem-safe basename: strips any directory components and
 * replaces everything except [A-Za-z0-9._-]. Prevents path traversal such as
 * "../../app/page.tsx" escaping the upload directory.
 */
export function sanitizeFilename(name: string): string {
  const base = path.basename(name.replace(/\\/g, "/"));
  const cleaned = base.replace(/[^A-Za-z0-9._-]+/g, "_").replace(/^\.+/, "");
  return cleaned.slice(-100) || "file";
}

/** Returns an error message, or null if the file is acceptable for the lecture type. */
export function validateLectureFile(type: LectureType, file: { name: string; size: number }): string | null {
  const allowed = LECTURE_EXTENSIONS[type];
  if (!allowed) return `Files cannot be attached to ${type} lectures`;
  const ext = path.extname(file.name).toLowerCase();
  if (!allowed.includes(ext)) return `Allowed file types for ${type}: ${allowed.join(", ")}`;
  if (file.size > MAX_LECTURE_BYTES) return `File exceeds ${MAX_LECTURE_BYTES / (1024 * 1024)} MB limit`;
  if (file.size === 0) return "The uploaded file is empty";
  return null;
}
