"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CardHeader } from "@/components/ui/Card";
import { AnimatedScoreCircle, AnimatedProgressBar } from "@/components/ui/ScoreVisuals";

interface ResumeAnalysisPayload {
    overallScore: number;
    subScores: {
        impact: number;
        skills: number;
        formatting: number;
    };
    markdownReport: string;
}

export function ResumeAnalysisOverviewSection({
    initialAnalysis
}: {
    initialAnalysis?: {
        data: ResumeAnalysisPayload;
        fileName: string;
    } | null
}) {
    const router = useRouter();
    const [resumeData, setResumeData] = useState<ResumeAnalysisPayload | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    useEffect(() => {
        if (initialAnalysis) {
            setResumeData(initialAnalysis.data);
            setFileName(initialAnalysis.fileName);
        }
    }, [initialAnalysis]);

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await fetch("/api/analyze-resume", { method: "DELETE" });
            setResumeData(null);
            setFileName(null);
            setConfirmDelete(false);
            setIsOpen(false);
            router.refresh();
        } catch {
            // silently ignore
        } finally {
            setDeleting(false);
        }
    };

    if (!resumeData) {
        return null;
    }

    return (
        <section style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <CardHeader
                title="LAST RESUME ANALYSIS"
                description={fileName ? `Report for ${fileName}` : "Review your most recent ATS compatibility score."}
                action={
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <Link
                            href="/analyze"
                            className="btn-bugatti"
                            style={{ height: "36px", padding: "0 20px", fontSize: "11px", textDecoration: "none" }}
                        >
                            VIEW FULL REPORT
                        </Link>
                        {confirmDelete ? (
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                <span className="type-caption" style={{ color: "var(--color-muted-soft)", fontSize: "10px" }}>DELETE REPORT?</span>
                                <button
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    className="btn-bugatti"
                                    style={{
                                        height: "36px",
                                        padding: "0 16px",
                                        fontSize: "11px",
                                        borderColor: "var(--color-error)",
                                        color: "var(--color-error)",
                                    }}
                                >
                                    {deleting ? "DELETING…" : "YES"}
                                </button>
                                <button
                                    onClick={() => setConfirmDelete(false)}
                                    className="btn-bugatti"
                                    style={{
                                        height: "36px",
                                        padding: "0 16px",
                                        fontSize: "11px",
                                    }}
                                >
                                    NO
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setConfirmDelete(true)}
                                title="Delete resume analysis"
                                className="btn-bugatti"
                                style={{
                                    height: "36px",
                                    width: "36px",
                                    padding: 0,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderColor: "var(--color-error)",
                                    color: "var(--color-error)",
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="3 6 5 6 21 6" />
                                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                    <path d="M10 11v6" /><path d="M14 11v6" />
                                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                                </svg>
                            </button>
                        )}
                    </div>
                }
            />

            {/* Parent accordion row */}
            <div
                style={{
                    background: "var(--color-surface-card)",
                    border: "1px solid var(--color-hairline)",
                    borderRadius: "0px",
                    overflow: "hidden",
                }}
            >
                <button
                    style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "20px",
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                    }}
                    onClick={() => setIsOpen((o) => !o)}
                    aria-expanded={isOpen}
                >
                    {/* Score badge icon */}
                    <div
                        style={{
                          display: "flex",
                          height: "36px",
                          width: "36px",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "1px solid var(--color-hairline-strong)",
                          color: "var(--color-ink)",
                          flexShrink: 0,
                        }}
                    >
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <p className="type-title-sm" style={{ color: "var(--color-ink)", margin: 0 }}>
                            {(fileName ?? "Resume Analysis").toUpperCase()}
                        </p>
                        <p className="type-body-sm" style={{ color: "var(--color-muted)", marginTop: "4px", margin: 0 }}>
                            OVERALL ATS SCORE: <span className="type-caption" style={{ color: "var(--color-link)", fontSize: "12px" }}>{resumeData.overallScore}%</span>
                        </p>
                    </div>
                    <svg
                      style={{
                        width: "12px",
                        height: "8px",
                        color: "var(--color-muted)",
                        flexShrink: 0,
                        transition: "transform 0.25s",
                        transform: isOpen ? "rotate(180deg)" : "none",
                      }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 10 6"
                    >
                      <path d="M1 1l4 4 4-4" strokeWidth="1.5" />
                    </svg>
                </button>

                {/* Expanded score card */}
                {isOpen && (
                    <div style={{ borderTop: "1px solid var(--color-hairline)", padding: "24px 20px", background: "var(--color-canvas)" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "24px", alignItems: "center" }}>
                            <div style={{ display: "flex", justifyContent: "center" }}>
                                <AnimatedScoreCircle score={resumeData.overallScore} label="Overall Match" />
                            </div>
                            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "16px" }}>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
                                    <AnimatedProgressBar label="Impact & Results" score={resumeData.subScores.impact} />
                                    <AnimatedProgressBar label="Skills Match" score={resumeData.subScores.skills} />
                                    <AnimatedProgressBar label="Formatting" score={resumeData.subScores.formatting} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
