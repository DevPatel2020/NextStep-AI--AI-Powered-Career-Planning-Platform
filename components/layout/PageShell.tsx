"use client";

import { ReactNode } from "react";

interface PageShellProps {
  children: ReactNode;
  title: string;
  description?: string;
  sidebar?: ReactNode;
  action?: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
}

export function PageShell({
  children,
  title,
  description,
  sidebar,
  action,
  maxWidth = "xl",
}: PageShellProps) {
  const maxWidthVal =
    maxWidth === "sm"
      ? "960px"
      : maxWidth === "md"
      ? "1140px"
      : maxWidth === "lg"
      ? "1280px"
      : maxWidth === "xl"
      ? "1440px"
      : "100%";

  return (
    <div
      style={{
        width: "100%",
        padding: "64px 40px",
        background: "var(--color-canvas)",
        color: "var(--color-body)",
      }}
    >
      <div
        style={{
          maxWidth: maxWidthVal,
          margin: "0 auto",
          width: "100%",
          display: sidebar ? "flex" : "block",
          gap: sidebar ? "48px" : undefined,
        }}
      >
        {sidebar && (
          <aside
            style={{
              flexShrink: 0,
              width: "260px",
            }}
            aria-label="Page sidebar"
          >
            {sidebar}
          </aside>
        )}
        <div
          style={{
            flex: 1,
            minWidth: 0,
          }}
        >
          <header
            style={{
              marginBottom: "48px",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "24px",
              borderBottom: "1px solid var(--color-hairline)",
              paddingBottom: "32px",
            }}
          >
            <div>
              <h1
                className="type-display-md"
                style={{
                  color: "var(--color-ink)",
                  margin: 0,
                }}
              >
                {title}
              </h1>
              {description && (
                <p
                  className="type-body-md"
                  style={{
                    marginTop: "12px",
                    color: "var(--color-muted)",
                    maxWidth: "720px",
                    lineHeight: 1.6,
                  }}
                >
                  {description}
                </p>
              )}
            </div>
            {action && <div style={{ flexShrink: 0 }}>{action}</div>}
          </header>
          {children}
        </div>
      </div>
    </div>
  );
}

