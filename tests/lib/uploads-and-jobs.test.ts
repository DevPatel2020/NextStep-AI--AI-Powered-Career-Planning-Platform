import { describe, expect, it } from "vitest";
import path from "path";
import {
  MAX_RESUME_BYTES,
  UploadError,
  detectResumeKind,
  extractResumeText,
  isLectureType,
  sanitizeFilename,
  validateLectureFile,
} from "@/lib/uploads";
import { extractExperienceFromText } from "@/lib/job-experience";

describe("sanitizeFilename", () => {
  it.each([
    "../../../app/page.tsx",
    "..\\..\\windows\\system32\\x.dll",
    "/etc/passwd",
    "....//....//secret",
  ])("cannot escape the upload directory: %s", (name) => {
    const safe = sanitizeFilename(name);
    expect(safe).not.toContain("/");
    expect(safe).not.toContain("\\");
    expect(safe.startsWith(".")).toBe(false);
    const dir = path.resolve("/uploads/lectures");
    expect(path.resolve(dir, safe).startsWith(dir + path.sep)).toBe(true);
  });

  it("keeps ordinary names readable", () => {
    expect(sanitizeFilename("My Lecture 1.mp4")).toBe("My_Lecture_1.mp4");
    expect(sanitizeFilename("")).toBe("file");
  });
});

describe("validateLectureFile", () => {
  it("allows matching extensions", () => {
    expect(validateLectureFile("VIDEO", { name: "a.MP4", size: 10 })).toBeNull();
    expect(validateLectureFile("PDF", { name: "notes.pdf", size: 10 })).toBeNull();
  });
  it("rejects HTML/script uploads that would be served from /public", () => {
    expect(validateLectureFile("VIDEO", { name: "x.html", size: 10 })).toMatch(/Allowed/);
    expect(validateLectureFile("PDF", { name: "x.svg", size: 10 })).toMatch(/Allowed/);
  });
  it("rejects files for types without attachments, and empty/huge files", () => {
    expect(validateLectureFile("QUIZ", { name: "a.pdf", size: 10 })).not.toBeNull();
    expect(validateLectureFile("PDF", { name: "a.pdf", size: 0 })).toMatch(/empty/);
    expect(validateLectureFile("PDF", { name: "a.pdf", size: 10 ** 10 })).toMatch(/limit/);
  });
  it("isLectureType", () => {
    expect(isLectureType("VIDEO")).toBe(true);
    expect(isLectureType("EXE")).toBe(false);
  });
});

describe("extractResumeText", () => {
  it("rejects a missing file", async () => {
    await expect(extractResumeText(null)).rejects.toBeInstanceOf(UploadError);
  });

  it("reads plain text", async () => {
    const f = new File(["Experience: 5 years\nEducation: BSc"], "cv.txt", { type: "text/plain" });
    await expect(extractResumeText(f)).resolves.toContain("Education");
  });

  it("rejects oversize uploads with 413", async () => {
    const f = new File([new Uint8Array(MAX_RESUME_BYTES + 1)], "big.txt", { type: "text/plain" });
    await expect(extractResumeText(f)).rejects.toMatchObject({ status: 413 });
  });

  it("rejects unsupported types with 400", async () => {
    const f = new File(["MZ"], "virus.exe", { type: "application/octet-stream" });
    await expect(extractResumeText(f)).rejects.toMatchObject({ status: 400 });
  });

  it("detectResumeKind falls back to extension", () => {
    expect(detectResumeKind({ name: "CV.PDF", type: "" })).toBe("pdf");
    expect(detectResumeKind({ name: "cv.docx", type: "" })).toBe("docx");
    expect(detectResumeKind({ name: "cv.png", type: "image/png" })).toBeNull();
  });
});

describe("extractExperienceFromText", () => {
  it.each([
    ["Requires 3-5 years of experience in React.", "3-5 years"],
    ["We need 2 to 4 years experience.", "2-4 years"],
    ["Minimum 3 years of relevant experience.", "3+ years"],
    ["5+ years building APIs.", "5+ years"],
    ["1 year of experience with SQL.", "1 year"],
    ["This is an entry-level role.", "Fresher"],
  ])("%s → %s", (text, expected) => {
    expect(extractExperienceFromText(text)).toBe(expected);
  });

  it("prefers required over preferred experience", () => {
    const text = "10+ years preferred. Must have 3+ years of professional experience.";
    expect(extractExperienceFromText(text)).toBe("3+ years");
  });

  it("returns null when nothing is mentioned", () => {
    expect(extractExperienceFromText("")).toBeNull();
    expect(extractExperienceFromText("Great team, free snacks.")).toBeNull();
  });
});
