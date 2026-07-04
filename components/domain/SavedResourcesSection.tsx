"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import type { Resource } from "@/lib/hooks/useResources";

export function SavedResourcesSection({ initialResources }: { initialResources: Resource[] }) {
    const [resources, setResources] = useState<Resource[]>(initialResources);
    const [listOpen, setListOpen] = useState(false);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    const handleUnsave = async () => {
        if (!confirmDeleteId) return;
        const resourceId = confirmDeleteId;
        setDeleting(resourceId);

        try {
            const res = await fetch(`/api/learning/saved?resourceId=${encodeURIComponent(resourceId)}`, {
                method: "DELETE",
            });
            if (res.ok) {
                setResources((prev) => prev.filter((r) => r.id !== resourceId));
                if (expanded === resourceId) setExpanded(null);
                setConfirmDeleteId(null);
            }
        } catch (err) {
            console.error("Failed to unsave resource", err);
        } finally {
            setDeleting(null);
        }
    };

    return (
        <>
            {/* ── Top-level parent row ── */}
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
                    {/* Icon */}
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>

                    {/* Title + meta */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <p className="type-title-md" style={{ color: "var(--color-ink)", margin: 0 }}>SAVED RESOURCES</p>
                        <p className="type-body-sm" style={{ color: "var(--color-muted)", marginTop: "4px", margin: 0 }}>
                            {resources.length} {resources.length === 1 ? "resource" : "resources"} saved
                        </p>
                    </div>

                    {/* Chevron */}
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

                {/* ── Expanded inner list ── */}
                {listOpen && (
                    <div style={{ borderTop: "1px solid var(--color-hairline)", padding: "16px", background: "var(--color-canvas)", display: "flex", flexDirection: "column", gap: "12px" }}>
                        {resources.length === 0 ? (
                            <p className="type-body-sm" style={{ padding: "24px 0", textAlign: "center", color: "var(--color-muted)", margin: 0 }}>
                                No saved resources yet.{" "}
                                <Link href="/learning-resources" className="type-caption" style={{ color: "var(--color-link)", textDecoration: "none" }}>
                                    FIND SOME →
                                </Link>
                            </p>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                {resources.map((resource) => {
                                    const isOpen = expanded === resource.id;
                                    const isDeleting = deleting === resource.id;

                                    return (
                                        <div
                                            key={resource.id}
                                            style={{
                                                background: "var(--color-surface-card)",
                                                border: "1px solid var(--color-hairline)",
                                                borderRadius: "0px",
                                                overflow: "hidden",
                                            }}
                                        >
                                            {/* Item header */}
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
                                                    onClick={() => setExpanded(isOpen ? null : resource.id)}
                                                    aria-expanded={isOpen}
                                                >
                                                    {/* Type icon */}
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
                                                            {resource.type === "video" ? (
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                                                                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            ) : (
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                                                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                            )}
                                                        </svg>
                                                    </div>
                                                    {/* Title */}
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <p className="type-title-sm" style={{ color: "var(--color-ink)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                            {resource.title.toUpperCase()}
                                                        </p>
                                                        <div style={{ marginTop: "4px", display: "flex", gap: "8px", alignItems: "center" }}>
                                                            <Badge variant="default" size="sm">{resource.type.toUpperCase()}</Badge>
                                                            <Badge variant="secondary" size="sm">{resource.source.toUpperCase()}</Badge>
                                                        </div>
                                                    </div>
                                                    {/* Chevron */}
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

                                                {/* Unsave button */}
                                                <button
                                                    onClick={() => setConfirmDeleteId(resource.id)}
                                                    disabled={isDeleting}
                                                    title="Unsave"
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

                                            {/* Item expand detail */}
                                            {isOpen && (
                                                <div style={{ borderTop: "1px solid var(--color-hairline)", padding: "16px", background: "var(--color-surface-soft)", display: "flex", flexDirection: "column", gap: "16px" }}>
                                                    <p className="type-body-sm" style={{ color: "var(--color-muted)", margin: 0, lineHeight: 1.6 }}>
                                                        {resource.description || "No description available."}
                                                    </p>
                                                    <a
                                                        href={resource.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn-bugatti"
                                                        style={{ height: "36px", padding: "0 20px", fontSize: "11px", textDecoration: "none", display: "inline-flex", width: "fit-content" }}
                                                    >
                                                        OPEN RESOURCE →
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Footer link */}
                        <div style={{ paddingTop: "8px", textAlign: "right" }}>
                            <Link href="/learning-resources" className="type-caption" style={{ color: "var(--color-link)", textDecoration: "none" }}>
                                BROWSE ALL RESOURCES →
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            <ConfirmModal
                open={!!confirmDeleteId}
                onClose={() => setConfirmDeleteId(null)}
                onConfirm={handleUnsave}
                title="Unsave Resource"
                description="Are you sure you want to unsave this learning resource?"
                confirmText="Unsave"
                loading={!!deleting}
            />
        </>
    );
}
