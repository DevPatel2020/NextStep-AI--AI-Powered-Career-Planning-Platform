"use client";

import { useState } from "react";
import Link from "next/link";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Badge } from "@/components/ui/Badge";

interface RoadmapEntry {
    id: string;
    careerGoal: string;
    stages: string;
    createdAt: string;
}

interface Stage {
    title: string;
    description: string;
    timeRange: string;
    actions: string[];
    resources?: string[];
}

export function RoadmapHistorySection({ roadmaps: initialRoadmaps }: { roadmaps: RoadmapEntry[] }) {
    const [roadmaps, setRoadmaps] = useState<RoadmapEntry[]>(initialRoadmaps);
    const [listOpen, setListOpen] = useState(false);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    async function handleDelete() {
        if (!confirmDeleteId) return;
        const id = confirmDeleteId;
        setDeleting(id);
        try {
            const res = await fetch(`/api/roadmap/${id}`, { method: "DELETE" });
            if (res.ok) {
                setRoadmaps((prev) => prev.filter((r) => r.id !== id));
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 0 002 2h2a2 0 002-2M9 5a2 0 012-2h2a2 0 012 2" />
                        </svg>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <p className="type-title-md" style={{ color: "var(--color-ink)", margin: 0 }}>ROADMAPS</p>
                        <p className="type-body-sm" style={{ color: "var(--color-muted)", marginTop: "4px", margin: 0 }}>
                            {roadmaps.length} {roadmaps.length === 1 ? "roadmap" : "roadmaps"} generated
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
                        {roadmaps.length === 0 ? (
                            <p className="type-body-sm" style={{ padding: "24px 0", textAlign: "center", color: "var(--color-muted)", margin: 0 }}>
                                No roadmaps yet.{" "}
                                <Link href="/ai-roadmap" className="type-caption" style={{ color: "var(--color-link)", textDecoration: "none" }}>
                                    GENERATE YOUR FIRST ONE →
                                </Link>
                            </p>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                {roadmaps.map((rm) => {
                                    let stages: Stage[] = [];
                                    try { stages = JSON.parse(rm.stages) as Stage[]; } catch { stages = []; }
                                    const isOpen = expanded === rm.id;
                                    const isDeleting = deleting === rm.id;

                                    return (
                                        <div
                                            key={rm.id}
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
                                                    onClick={() => setExpanded(isOpen ? null : rm.id)}
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
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 0 002 2h2a2 0 002-2M9 5a2 0 012-2h2a2 0 012 2" />
                                                        </svg>
                                                    </div>
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <p className="type-title-sm" style={{ color: "var(--color-ink)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                            {rm.careerGoal.toUpperCase()}
                                                        </p>
                                                        <p className="type-body-sm" style={{ color: "var(--color-muted)", marginTop: "4px", margin: 0 }}>
                                                            {stages.length} STAGES · {new Date(rm.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase()}
                                                        </p>
                                                    </div>
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
                                                    onClick={() => setConfirmDeleteId(rm.id)}
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

                                            {/* Expanded stages */}
                                            {isOpen && (
                                                <div style={{ borderTop: "1px solid var(--color-hairline)", padding: "16px", background: "var(--color-surface-soft)", display: "flex", flexDirection: "column", gap: "16px" }}>
                                                    {stages.map((stage, i) => (
                                                        <div
                                                            key={i}
                                                            style={{
                                                                display: "flex",
                                                                gap: "16px",
                                                            }}
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
                                                                    <p className="type-title-sm" style={{ color: "var(--color-ink)", margin: 0 }}>{stage.title.toUpperCase()}</p>
                                                                    {stage.timeRange && (
                                                                        <Badge variant="default" size="sm">
                                                                            {stage.timeRange.toUpperCase()}
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                                <p className="type-body-sm" style={{ color: "var(--color-muted)", marginTop: "4px", margin: 0, lineHeight: 1.5 }}>{stage.description}</p>
                                                                {stage.actions && stage.actions.length > 0 && (
                                                                    <ul style={{ paddingLeft: "16px", margin: "8px 0 0", display: "flex", flexDirection: "column", gap: "4px" }} className="list-disc">
                                                                        {stage.actions.map((action, j) => (
                                                                            <li key={j} className="type-body-sm" style={{ color: "var(--color-muted-soft)" }}>
                                                                                {action}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <div style={{ paddingTop: "12px", borderTop: "1px solid var(--color-hairline)" }}>
                                                        <Link href="/ai-roadmap" className="type-caption" style={{ color: "var(--color-link)", textDecoration: "none" }}>
                                                            OPEN FULL ROADMAP →
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
                            <Link href="/ai-roadmap" className="type-caption" style={{ color: "var(--color-link)", textDecoration: "none" }}>
                                GENERATE NEW ROADMAP →
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            <ConfirmModal
                open={!!confirmDeleteId}
                onClose={() => setConfirmDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete Roadmap"
                description="Are you sure you want to delete this roadmap? This action cannot be undone."
                confirmText="Delete"
                loading={!!deleting}
            />
        </>
    );
}
