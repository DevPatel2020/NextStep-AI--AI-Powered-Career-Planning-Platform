"use client";

import { ReactNode } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  children?: ReactNode;
}

const sizeStyles: Record<string, React.CSSProperties> = {
  sm: { height: "36px", padding: "0 20px", fontSize: "11px", letterSpacing: "2px" },
  md: { height: "44px", padding: "14px 32px", fontSize: "14px", letterSpacing: "2.5px" },
  lg: { height: "52px", padding: "16px 40px", fontSize: "14px", letterSpacing: "2.5px" },
};

const variantStyles: Record<string, React.CSSProperties> = {
  primary: {
    background: "transparent",
    color: "var(--color-ink)",
    border: "1px solid var(--color-ink)",
    borderRadius: "9999px",
  },
  secondary: {
    background: "var(--color-ink)",
    color: "var(--color-canvas)",
    border: "1px solid var(--color-ink)",
    borderRadius: "9999px",
  },
  outline: {
    background: "transparent",
    color: "var(--color-ink)",
    border: "1px solid var(--color-ink)",
    borderRadius: "9999px",
  },
  ghost: {
    background: "transparent",
    color: "var(--color-body)",
    border: "1px solid transparent",
    borderRadius: "9999px",
  },
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth,
  className = "",
  disabled,
  children,
  style,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type="button"
      disabled={isDisabled}
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        fontFamily: "var(--font-mono)",
        fontWeight: 400,
        lineHeight: 1,
        textTransform: "uppercase",
        cursor: isDisabled ? "not-allowed" : "pointer",
        opacity: isDisabled ? 0.4 : 1,
        transition: "background 0.2s ease, color 0.2s ease, opacity 0.2s ease",
        whiteSpace: "nowrap",
        textDecoration: "none",
        width: fullWidth ? "100%" : undefined,
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...style,
      }}
      {...props}
    >
      {loading ? (
        <svg
          style={{ height: "14px", width: "14px", animation: "spin 1s linear infinite" }}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <circle
            style={{ opacity: 0.25 }}
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            style={{ opacity: 0.75 }}
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        leftIcon
      )}
      {children}
      {!loading && rightIcon}
    </button>
  );
}
