"use client";

import { useState } from "react";
import Link from "next/link";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Badge } from "@/components/ui/Badge";

interface CareerMilestone {
    title: string;
    timeframe: string;
    skills: string[];
    actions: string[];
}

interface CareerBranch {
    id: string;
    title: string;
    color: string;
    description: string;
    milestones: CareerMilestone[];
}

interface CareerTreeData {
    root: { title: string; description: string; skills: string[] };
    branches: CareerBranch[];
}

interface CareerTreeFormInput {
    skills: string;
    passions: string;
    targetRoles?: string;
    currentStage?: string;
    shortTermGoal: string;
    longTermGoal: string;
}

interface CareerTreeEntry {
    id: string;
    rootTitle: string;
    formInput: string;
    treeData: string;
    createdAt: string;
}

export function CareerTreeHistorySection({ trees: initialTrees }: { trees: CareerTreeEntry[] }) {
    const [trees, setTrees] = useState<CareerTreeEntry[]>(initialTrees);
    const [listOpen, setListOpen] = useState(false);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [expandedBranch, setExpandedBranch] = useState<string | null>(null);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    async function handleDelete() {
        if (!confirmDeleteId) return;
        const id = confirmDeleteId;
        setDeleting(id);
        try {
            const res = await fetch(`/api/career-tree/${id}`, { method: "DELETE" });
            if (res.ok) {
                setTrees((prev) => prev.filter((t) => t.id !== id));
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <p className="type-title-md" style={{ color: "var(--color-ink)", margin: 0 }}>CAREER TREES</p>
                        <p className="type-body-sm" style={{ color: "var(--color-muted)", marginTop: "4px", margin: 0 }}>
                            {trees.length} {trees.length === 1 ? "tree" : "trees"} generated
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
                        {trees.length === 0 ? (
                            <p className="type-body-sm" style={{ padding: "24px 0", textAlign: "center", color: "var(--color-muted)", margin: 0 }}>
                                No career trees yet.{" "}
                                <Link href="/career-tree" className="type-caption" style={{ color: "var(--color-link)", textDecoration: "none" }}>
                                    GENERATE YOUR FIRST ONE →
                                </Link>
                            </p>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                {trees.map((entry) => {
                                    let treeData: CareerTreeData | null = null;
                                    let formInput: CareerTreeFormInput | null = null;
                                    try {
                                        treeData = JSON.parse(entry.treeData) as CareerTreeData;
                                        formInput = JSON.parse(entry.formInput) as CareerTreeFormInput;
                                    } catch {
                                        treeData = null;
                                    }

                                    const isOpen = expanded === entry.id;
                                    const branchCount = treeData?.branches.length ?? 0;
                                    const totalMilestones = treeData?.branches.reduce((acc, b) => acc + b.milestones.length, 0) ?? 0;
                                    const isDeleting = deleting === entry.id;

                                    return (
                                        <div
                                            key={entry.id}
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
                                                    onClick={() => setExpanded(isOpen ? null : entry.id)}
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
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                        </svg>
                                                    </div>
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <p className="type-title-sm" style={{ color: "var(--color-ink)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                            {entry.rootTitle.toUpperCase()}
                                                        </p>
                                                        <p className="type-body-sm" style={{ color: "var(--color-muted)", marginTop: "4px", margin: 0 }}>
                                                            {branchCount} PATHS · {totalMilestones} MILESTONES · {new Date(entry.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase()}
                                                        </p>
                                                        {treeData && (
                                                            <div style={{ marginTop: "8px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
                                                                {treeData.branches.map((b) => (
                                                                    <Badge key={b.id} variant="default" size="sm">
                                                                        {b.title.toUpperCase()}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        )}
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
                                                    onClick={() => setConfirmDeleteId(entry.id)}
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

                                            {/* Expanded detail */}
                                            {isOpen && treeData && (
                                                <div style={{ borderTop: "1px solid var(--color-hairline)", padding: "16px", background: "var(--color-surface-soft)", display: "flex", flexDirection: "column", gap: "16px" }}>
                                                    {formInput && (
                                                        <div style={{ border: "1px solid var(--color-hairline)", padding: "12px", background: "var(--color-canvas)", display: "flex", flexDirection: "column", gap: "6px" }}>
                                                            <p className="type-body-sm" style={{ color: "var(--color-muted)", margin: 0 }}><span className="type-caption" style={{ color: "var(--color-muted-soft)", fontSize: "10px" }}>SKILLS:</span> {formInput.skills}</p>
                                                            {formInput.currentStage && <p className="type-body-sm" style={{ color: "var(--color-muted)", margin: 0 }}><span className="type-caption" style={{ color: "var(--color-muted-soft)", fontSize: "10px" }}>STAGE:</span> {formInput.currentStage}</p>}
                                                            <p className="type-body-sm" style={{ color: "var(--color-muted)", margin: 0 }}><span className="type-caption" style={{ color: "var(--color-muted-soft)", fontSize: "10px" }}>SHORT-TERM GOAL:</span> {formInput.shortTermGoal}</p>
                                                            <p className="type-body-sm" style={{ color: "var(--color-muted)", margin: 0 }}><span className="type-caption" style={{ color: "var(--color-muted-soft)", fontSize: "10px" }}>LONG-TERM GOAL:</span> {formInput.longTermGoal}</p>
                                                        </div>
                                                    )}

                                                    <p className="type-body-sm" style={{ color: "var(--color-muted)", margin: 0, lineHeight: 1.5 }}>{treeData.root.description}</p>

                                                    {/* Branches */}
                                                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                                        {treeData.branches.map((branch) => {
                                                            const branchKey = `${entry.id}-${branch.id}`;
                                                            const isBranchOpen = expandedBranch === branchKey;

                                                            return (
                                                                <div key={branch.id} style={{ border: "1px solid var(--color-hairline)", background: "var(--color-surface-card)" }}>
                                                                    <button
                                                                        style={{
                                                                            width: "100%",
                                                                            textAlign: "left",
                                                                            padding: "12px 16px",
                                                                            display: "flex",
                                                                            alignItems: "center",
                                                                            gap: "12px",
                                                                            background: "transparent",
                                                                            border: "none",
                                                                            cursor: "pointer",
                                                                        }}
                                                                        onClick={() => setExpandedBranch(isBranchOpen ? null : branchKey)}
                                                                    >
                                                                        <span style={{ display: "block", height: "8px", width: "8px", background: branch.color || "var(--color-ink)", flexShrink: 0 }} />
                                                                        <span className="type-title-sm" style={{ flex: 1, color: "var(--color-ink)", margin: 0 }}>{branch.title.toUpperCase()}</span>
                                                                        <span className="type-caption" style={{ color: "var(--color-muted-soft)", fontSize: "10px" }}>{branch.milestones.length} MILESTONES</span>
                                                                        <svg
                                                                          style={{
                                                                            width: "10px",
                                                                            height: "6px",
                                                                            color: "var(--color-muted)",
                                                                            flexShrink: 0,
                                                                            transition: "transform 0.25s",
                                                                            transform: isBranchOpen ? "rotate(180deg)" : "none",
                                                                          }}
                                                                          fill="none"
                                                                          stroke="currentColor"
                                                                          viewBox="0 0 10 6"
                                                                        >
                                                                          <path d="M1 1l4 4 4-4" strokeWidth="1.5" />
                                                                        </svg>
                                                                    </button>

                                                                    {isBranchOpen && (
                                                                        <div style={{ borderTop: "1px solid var(--color-hairline)", padding: "16px", background: "var(--color-canvas)", display: "flex", flexDirection: "column", gap: "16px" }}>
                                                                            <p className="type-body-sm" style={{ color: "var(--color-muted)", margin: 0, lineHeight: 1.5 }}>{branch.description}</p>
                                                                            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                                                                {branch.milestones.map((ms, i) => (
                                                                                    <div
                                                                                        key={i}
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
                                                                                                <p className="type-title-sm" style={{ color: "var(--color-ink)", margin: 0 }}>{ms.title.toUpperCase()}</p>
                                                                                                <Badge variant="default" size="sm">
                                                                                                    {ms.timeframe.toUpperCase()}
                                                                                                </Badge>
                                                                                            </div>
                                                                                            {ms.skills.length > 0 && (
                                                                                                <div style={{ marginTop: "8px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
                                                                                                    {ms.skills.map((skill, j) => (
                                                                                                        <Badge key={j} variant="secondary" size="sm">
                                                                                                            {skill.toUpperCase()}
                                                                                                        </Badge>
                                                                                                    ))}
                                                                                                </div>
                                                                                            )}
                                                                                            {ms.actions.length > 0 && (
                                                                                                <ul style={{ paddingLeft: "16px", margin: "8px 0 0", display: "flex", flexDirection: "column", gap: "4px" }} className="list-disc">
                                                                                                    {ms.actions.map((action, j) => (
                                                                                                        <li key={j} className="type-body-sm" style={{ color: "var(--color-muted-soft)" }}>
                                                                                                            {action}
                                                                                                        </li>
                                                                                                    ))}
                                                                                                </ul>
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>

                                                    <div style={{ paddingTop: "12px", borderTop: "1px solid var(--color-hairline)" }}>
                                                        <Link href="/career-tree" className="type-caption" style={{ color: "var(--color-link)", textDecoration: "none" }}>
                                                            GENERATE A NEW TREE →
                                                        </Link>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Footer */}
                        <div style={{ paddingTop: "8px", textAlign: "right" }}>
                            <Link href="/career-tree" className="type-caption" style={{ color: "var(--color-link)", textDecoration: "none" }}>
                                GENERATE NEW TREE →
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            <ConfirmModal
                open={!!confirmDeleteId}
                onClose={() => setConfirmDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete Career Tree"
                description="Are you sure you want to delete this career tree? This action cannot be undone."
                confirmText="Delete"
                loading={!!deleting}
            />
        </>
    );
}
