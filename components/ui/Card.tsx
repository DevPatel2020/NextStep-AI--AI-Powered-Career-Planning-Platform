"use client";

import { ReactNode } from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: "none" | "sm" | "md" | "lg";
  hoverable?: boolean;
  className?: string;
}

const paddingMap = {
  none: "0px",
  sm: "16px",
  md: "24px",
  lg: "32px",
};

export function Card({
  children,
  padding = "md",
  className = "",
  hoverable = false,
  style,
  ...props
}: CardProps) {
  return (
    <div
      className={className}
      style={{
        background: "var(--color-surface-card)",
        border: "1px solid var(--color-hairline)",
        borderRadius: "0px",
        padding: paddingMap[padding],
        transition: hoverable ? "border-color 0.2s ease, transform 0.25s ease" : undefined,
        ...style,
      }}
      onMouseEnter={
        hoverable
          ? (e) => {
              (e.currentTarget as HTMLElement).style.borderColor =
                "var(--color-hairline-strong)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
            }
          : undefined
      }
      onMouseLeave={
        hoverable
          ? (e) => {
              (e.currentTarget as HTMLElement).style.borderColor =
                "var(--color-hairline)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }
          : undefined
      }
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div
      style={{
        marginBottom: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h2
            className="type-title-md"
            style={{ color: "var(--color-ink)" }}
          >
            {title}
          </h2>
          {description && (
            <p
              className="type-body-sm"
              style={{ marginTop: "6px", color: "var(--color-muted)" }}
            >
              {description}
            </p>
          )}
        </div>
        {action && <div style={{ flexShrink: 0 }}>{action}</div>}
      </div>
    </div>
  );
}
