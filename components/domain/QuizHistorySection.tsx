"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

interface CareerResult {
    id: string;
    title: string;
    summary: string;
    salaryMin: number;
    salaryMax: number;
    education: string;
    skills: string[];
    matchScore: number;
}

interface QuizEntry {
    id: string;
    phase1Answers: string;
    results: string | null;
    createdAt: string;
}

function formatSalary(min: number, max: number): string {
    const fmt = (n: number) => n >= 1000 ? `$${Math.round(n / 1000)}k` : `$${n}`;
    return `${fmt(min)} – ${fmt(max)}`;
}

export function QuizHistorySection({ quizzes: initialQuizzes }: { quizzes: QuizEntry[] }) {
    const [quizzes, setQuizzes] = useState<QuizEntry[]>(initialQuizzes);
    const [listOpen, setListOpen] = useState(false);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    async function handleDelete() {
        if (!confirmDeleteId) return;
        const id = confirmDeleteId;
        setDeleting(id);
        try {
            const res = await fetch(`/api/career-quiz/${id}`, { method: "DELETE" });
            if (res.ok) {
                setQuizzes((prev) => prev.filter((q) => q.id !== id));
                if (expanded === id) setExpanded(null);
                setConfirmDeleteId(null);
            }
        } finally {
            setDeleting(null);
        }
    }

    return (
        <>
            <div
                style={{
                    background: "var(--color-surface-card)",
                    border: "1px solid var(--color-hairline)",
                    borderRadius: "0px",
                    overflow: "hidden",
                }}
            >
                {/* Parent header */}
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
                    onClick={() => setListOpen((o) => !o)}
                    aria-expanded={listOpen}
                >
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <p className="type-title-md" style={{ color: "var(--color-ink)", margin: 0 }}>CAREER QUIZ</p>
                        <p className="type-body-sm" style={{ color: "var(--color-muted)", marginTop: "4px", margin: 0 }}>
                            {quizzes.length} {quizzes.length === 1 ? "attempt" : "attempts"} taken
                        </p>
                    </div>
                    <svg
                      style={{
                        width: "12px",
                        height: "8px",
                        color: "var(--color-muted)",
                        flexShrink: 0,
                        transition: "transform 0.25s",
                        transform: listOpen ? "rotate(180deg)" : "none",
                      }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 10 6"
                    >
                      <path d="M1 1l4 4 4-4" strokeWidth="1.5" />
                    </svg>
                </button>

                {/* Inner list */}
                {listOpen && (
                    <div style={{ borderTop: "1px solid var(--color-hairline)", padding: "16px", background: "var(--color-canvas)", display: "flex", flexDirection: "column", gap: "12px" }}>
                        {quizzes.length === 0 ? (
                            <p className="type-body-sm" style={{ padding: "24px 0", textAlign: "center", color: "var(--color-muted)", margin: 0 }}>
                                No quiz attempts yet.{" "}
                                <Link href="/career-quiz" className="type-caption" style={{ color: "var(--color-link)", textDecoration: "none" }}>
                                    TAKE THE CAREER QUIZ →
                                </Link>
                            </p>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                {quizzes.map((quiz) => {
                                    let results: CareerResult[] = [];
                                    try { if (quiz.results) results = JSON.parse(quiz.results) as CareerResult[]; } catch { results = []; }
                                    let phase1: { question: string; answer: string }[] = [];
                                    try { phase1 = JSON.parse(quiz.phase1Answers) as { question: string; answer: string }[]; } catch { phase1 = []; }

                                    const isOpen = expanded === quiz.id;
                                    const topMatch = results[0];
                                    const hasResults = results.length > 0;
                                    const isDeleting = deleting === quiz.id;

                                    return (
                                        <div
                                            key={quiz.id}
                                            style={{
                                                background: "var(--color-surface-card)",
                                                border: "1px solid var(--color-hairline)",
                                                borderRadius: "0px",
                                                overflow: "hidden",
                                            }}
                                        >
                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingRight: "12px" }}>
                                                <button
                                                    style={{
                                                        flex: 1,
                                                        textAlign: "left",
                                                        padding: "16px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "16px",
                                                        background: "transparent",
                                                        border: "none",
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={() => setExpanded(isOpen ? null : quiz.id)}
                                                    aria-expanded={isOpen}
                                                >
                                                    <div
                                                        style={{
                                                          display: "flex",
                                                          height: "28px",
                                                          width: "28px",
                                                          alignItems: "center",
                                                          justifyContent: "center",
                                                          border: "1px solid var(--color-hairline-strong)",
                                                          color: "var(--color-ink)",
                                                          flexShrink: 0,
                                                        }}
                                                    >
                                                        <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </div>
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <p className="type-title-sm" style={{ color: "var(--color-ink)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                            {topMatch ? `TOP MATCH: ${topMatch.title.toUpperCase()}` : "QUIZ IN PROGRESS"}
                                                        </p>
                                                        <p className="type-body-sm" style={{ color: "var(--color-muted)", marginTop: "4px", margin: 0 }}>
                                                            {hasResults ? `${results.length} CAREER MATCHES` : "NO RESULTS YET"} · {new Date(quiz.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase()}
                                                        </p>
                                                    </div>
                                                    {topMatch && (
                                                        <div style={{ flexShrink: 0 }}>
                                                          <Badge variant="success" size="sm">
                                                              {topMatch.matchScore}%
                                                          </Badge>
                                                        </div>
                                                    )}
                                                    <svg
                                                      style={{
                                                        width: "10px",
                                                        height: "6px",
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
                                                <button
                                                    onClick={() => setConfirmDeleteId(quiz.id)}
                                                    disabled={isDeleting}
                                                    title="Delete"
                                                    style={{
                                                        display: "flex",
                                                        height: "32px",
                                                        width: "32px",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        background: "transparent",
                                                        border: "none",
                                                        color: "var(--color-muted)",
                                                        cursor: "pointer",
                                                    }}
                                                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-error)")}
                                                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-muted)")}
                                                >
                                                    {isDeleting ? (
                                                        <svg style={{ animation: "spin 1s linear infinite", width: "14px", height: "14px" }} fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                                        </svg>
                                                    ) : (
                                                        <span style={{ fontSize: "20px", lineHeight: "1" }}>&times;</span>
                                                    )}
                                                </button>
                                            </div>

                                            {/* Expanded details */}
                                            {isOpen && (
                                                <div style={{ borderTop: "1px solid var(--color-hairline)", padding: "16px", background: "var(--color-surface-soft)", display: "flex", flexDirection: "column", gap: "20px" }}>
                                                    {phase1.length > 0 && (
                                                        <div>
                                                            <p className="type-caption" style={{ color: "var(--color-muted-soft)", fontSize: "10px", marginBottom: "8px", textTransform: "uppercase" }}>YOUR PROFILE</p>
                                                            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                                                                {phase1.map((a, i) => (
                                                                    <Badge key={i} variant="secondary" size="sm">
                                                                        {a.answer.toUpperCase()}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                    
                                                    {hasResults && (
                                                        <div>
                                                            <p className="type-caption" style={{ color: "var(--color-muted-soft)", fontSize: "10px", marginBottom: "12px", textTransform: "uppercase" }}>CAREER MATCHES</p>
                                                            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                                                {results.map((career, i) => (
                                                                    <div
                                                                        key={career.id || i}
                                                                        style={{ display: "flex", gap: "16px" }}
                                                                    >
                                                                        <div
                                                                            style={{
                                                                                display: "flex",
                                                                                height: "24px",
                                                                                width: "24px",
                                                                                alignItems: "center",
                                                                                justifyContent: "center",
                                                                                border: "1px solid var(--color-hairline-strong)",
                                                                                color: "var(--color-muted)",
                                                                                fontFamily: "var(--font-mono)",
                                                                                fontSize: "11px",
                                                                                flexShrink: 0,
                                                                            }}
                                                                        >
                                                                            {String(i + 1).padStart(2, "0")}
                                                                        </div>
                                                                        <div style={{ flex: 1, minWidth: 0 }}>
                                                                            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px" }}>
                                                                                <p className="type-title-sm" style={{ color: "var(--color-ink)", margin: 0 }}>{career.title.toUpperCase()}</p>
                                                                                <Badge variant="success" size="sm">{career.matchScore}%</Badge>
                                                                            </div>
                                                                            <p className="type-body-sm" style={{ color: "var(--color-muted)", marginTop: "4px", margin: 0, lineHeight: 1.5 }}>{career.summary}</p>
                                                                            <div style={{ marginTop: "8px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
                                                                                <Badge variant="default" size="sm">{formatSalary(career.salaryMin, career.salaryMax)}</Badge>
                                                                                <Badge variant="secondary" size="sm">{career.education.toUpperCase()}</Badge>
                                                                                {career.skills.slice(0, 3).map((s) => (
                                                                                    <Badge key={s} variant="default" size="sm">{s.toUpperCase()}</Badge>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                    
                                                    <div style={{ paddingTop: "12px", borderTop: "1px solid var(--color-hairline)" }}>
                                                        <Link href="/career-quiz" className="type-caption" style={{ color: "var(--color-link)", textDecoration: "none" }}>
                                                            RETAKE CAREER QUIZ →
                                                        </Link>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        <div style={{ paddingTop: "8px", textAlign: "right" }}>
                            <Link href="/career-quiz" className="type-caption" style={{ color: "var(--color-link)", textDecoration: "none" }}>
                                TAKE A NEW QUIZ →
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            <ConfirmModal
                open={!!confirmDeleteId}
                onClose={() => setConfirmDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete Quiz Attempt"
                description="Are you sure you want to delete this quiz attempt? This action cannot be undone."
                confirmText="Delete"
                loading={!!deleting}
            />
        </>
    );
}
