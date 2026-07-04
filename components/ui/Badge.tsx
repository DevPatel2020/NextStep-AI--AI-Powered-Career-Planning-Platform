import { ReactNode } from "react";

type BadgeVariant =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "outline";

const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
  default: {
    background: "transparent",
    color: "var(--color-muted)",
    border: "1px solid var(--color-hairline)",
  },
  primary: {
    background: "transparent",
    color: "var(--color-ink)",
    border: "1px solid var(--color-hairline-strong)",
  },
  secondary: {
    background: "transparent",
    color: "var(--color-muted)",
    border: "1px solid var(--color-hairline)",
  },
  success: {
    background: "transparent",
    color: "var(--color-success)",
    border: "1px solid var(--color-success)",
  },
  warning: {
    background: "transparent",
    color: "var(--color-warning)",
    border: "1px solid var(--color-warning)",
  },
  error: {
    background: "transparent",
    color: "var(--color-error)",
    border: "1px solid var(--color-error)",
  },
  outline: {
    background: "transparent",
    color: "var(--color-muted)",
    border: "1px solid var(--color-hairline)",
  },
};

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: "sm" | "md";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  size = "md",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`type-caption ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: "0px",
        padding: size === "sm" ? "2px 8px" : "4px 10px",
        ...variantStyles[variant],
      }}
    >
      {children}
    </span>
  );
}
