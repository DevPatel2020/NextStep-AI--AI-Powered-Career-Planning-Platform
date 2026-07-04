"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import type { RoadmapStage, StageStatus } from "@/lib/hooks/useRoadmap";

interface RoadmapStepCardProps {
  stage: RoadmapStage;
  stepIndex?: number;
  onStatusChange?: (status: StageStatus) => void;
}

const statusVariant: Record<StageStatus, "default" | "primary" | "success"> = {
  not_started: "default",
  in_progress: "primary",
  completed: "success",
};

const stepIcons = [
  <svg key="0" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  <svg key="1" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
  <svg key="2" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
  <svg key="3" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
  <svg key="4" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
];

export function RoadmapStepCard({
  stage,
  stepIndex = 0,
  onStatusChange,
}: RoadmapStepCardProps) {
  const [expanded, setExpanded] = useState(stage.status === "in_progress");
  const [resources, setResources] = useState<any[]>([]);
  const [resLoading, setResLoading] = useState(false);
  const [resFetched, setResFetched] = useState(false);
  const Icon = stepIcons[stepIndex % stepIcons.length];

  const toggleExpand = () => {
    const next = !expanded;
    setExpanded(next);
    if (next && !resFetched) {
      setResLoading(true);
      setResFetched(true);
      fetch("/api/courses/search?q=" + encodeURIComponent(stage.title))
        .then((r) => r.json())
        .then((d) => setResources((d.courses || []).slice(0, 2)))
        .catch(() => {})
        .finally(() => setResLoading(false));
    }
  };

  return (
    <div
      style={{
        background: "var(--color-surface-card)",
        border: `1px solid ${
          stage.status === "in_progress"
            ? "var(--color-hairline-strong)"
            : "var(--color-hairline)"
        }`,
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
        <div style={{ display: "flex", gap: "16px" }}>
          <div
            style={{
              display: "flex",
              height: "40px",
              width: "40px",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid var(--color-hairline-strong)",
              color: "var(--color-ink)",
              flexShrink: 0,
            }}
          >
            {Icon}
          </div>
          <div>
            <h3 className="type-title-md" style={{ color: "var(--color-ink)", margin: 0 }}>
              {stage.title.toUpperCase()}
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px", alignItems: "center" }}>
              <Badge variant="default" size="sm">
                {stage.timeRange.toUpperCase()}
              </Badge>
              <Badge variant={statusVariant[stage.status]} size="sm">
                {stage.status.replace("_", " ").toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <p className="type-body-md" style={{ color: "var(--color-muted)", margin: 0, lineHeight: 1.6 }}>
        {stage.description}
      </p>

      <button
        type="button"
        onClick={toggleExpand}
        className="type-caption"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          background: "transparent",
          border: "none",
          color: "var(--color-link)",
          cursor: "pointer",
          textAlign: "left",
          width: "fit-content",
        }}
      >
        {expanded ? "HIDE" : "SHOW"} ACTION ITEMS
        <svg
          style={{
            width: "10px",
            height: "6px",
            transition: "transform 0.2s",
            transform: expanded ? "rotate(180deg)" : "none",
          }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 10 6"
        >
          <path d="M1 1l4 4 4-4" strokeWidth="1.5" />
        </svg>
      </button>

      {expanded && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "8px" }}>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
            {stage.actions.map((action, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "16px",
                  padding: "16px",
                  background: "var(--color-surface-soft)",
                  border: "1px solid var(--color-hairline)",
                }}
              >
                <span
                  className="type-caption"
                  style={{
                    display: "inline-flex",
                    height: "20px",
                    width: "20px",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid var(--color-hairline-strong)",
                    color: "var(--color-muted)",
                    flexShrink: 0,
                    fontSize: "10px",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="type-body-sm" style={{ color: "var(--color-body-strong)", lineHeight: 1.5 }}>
                  {action}
                </span>
              </li>
            ))}
          </ul>

          {/* Resources */}
          <div style={{ borderTop: "1px solid var(--color-hairline)", paddingTop: "16px" }}>
            <p className="type-caption" style={{ color: "var(--color-muted)", marginBottom: "12px" }}>
              SUGGESTED RESOURCES
            </p>
            {resLoading ? (
              <p className="type-body-sm" style={{ color: "var(--color-muted)", margin: 0 }}>
                Finding resources...
              </p>
            ) : resources.length === 0 ? null : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px" }}>
                  {resources.map((r) => (
                    <a
                      key={r.id}
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "16px",
                        background: "var(--color-canvas)",
                        border: "1px solid var(--color-hairline)",
                        textDecoration: "none",
                      }}
                    >
                      <div style={{ minWidth: 0, flex: 1, marginRight: "16px" }}>
                        <p
                          className="type-body-sm"
                          style={{
                            fontWeight: 500,
                            color: "var(--color-ink)",
                            margin: 0,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {r.title}
                        </p>
                        <p className="type-caption" style={{ color: "var(--color-muted-soft)", marginTop: "4px", margin: 0, fontSize: "10px" }}>
                          {r.source.toUpperCase()} · {r.type.toUpperCase()}
                        </p>
                      </div>
                      <svg width="12" height="12" fill="none" stroke="var(--color-muted)" viewBox="0 0 12 12" style={{ flexShrink: 0 }}>
                        <path d="M2 10l8-8m0 0H4m6 0v6" strokeWidth="1.5" />
                      </svg>
                    </a>
                  ))}
                </div>
                <Link
                  href={"/learning-resources?q=" + encodeURIComponent(stage.title)}
                  className="type-caption"
                  style={{ color: "var(--color-link)", textDecoration: "none", marginTop: "8px" }}
                >
                  SHOW MORE →
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {onStatusChange && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", borderTop: "1px solid var(--color-hairline)", paddingTop: "16px" }}>
          {(["not_started", "in_progress", "completed"] as StageStatus[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onStatusChange(s)}
              className="type-caption"
              style={{
                padding: "8px 16px",
                background: "transparent",
                border: stage.status === s ? "1px solid var(--color-ink)" : "1px solid var(--color-hairline)",
                color: stage.status === s ? "var(--color-ink)" : "var(--color-muted)",
                cursor: "pointer",
              }}
            >
              {s.replace("_", " ").toUpperCase()}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
