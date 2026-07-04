import { InputHTMLAttributes, forwardRef, useId, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftAddon?: ReactNode;
  rightAddon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, helperText, leftAddon, rightAddon, id, className = "", style: externalStyle, ...props },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || `input-${generatedId.replace(/:/g, "")}`;

    return (
      <div style={{ width: "100%" }}>
        {label && (
          <label
            htmlFor={inputId}
            className="type-caption"
            style={{
              display: "block",
              marginBottom: "10px",
              color: error ? "var(--color-error)" : "var(--color-muted)",
            }}
          >
            {label}
          </label>
        )}
        <div style={{ position: "relative" }}>
          {leftAddon && (
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                display: "flex",
                alignItems: "center",
                paddingLeft: "0",
                pointerEvents: "none",
                color: "var(--color-muted)",
              }}
            >
              {leftAddon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            className={className}
            style={{
              display: "block",
              width: "100%",
              background: "transparent",
              color: "var(--color-ink)",
              border: "none",
              borderBottom: `1px solid ${error ? "var(--color-error)" : "var(--color-hairline-strong)"}`,
              borderRadius: "0",
              padding: "12px 0",
              height: "44px",
              fontFamily: "var(--font-body)",
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: 1.5,
              outline: "none",
              caretColor: "var(--color-ink)",
              paddingLeft: leftAddon ? "24px" : undefined,
              paddingRight: rightAddon ? "24px" : undefined,
              colorScheme: "dark",
              ...externalStyle,
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderBottomColor = error
                ? "var(--color-error)"
                : "var(--color-ink)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderBottomColor = error
                ? "var(--color-error)"
                : "var(--color-hairline-strong)";
            }}
            {...props}
          />
          {rightAddon && (
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                right: 0,
                display: "flex",
                alignItems: "center",
                color: "var(--color-muted)",
              }}
            >
              {rightAddon}
            </div>
          )}
        </div>
        {error && (
          <p
            id={`${inputId}-error`}
            className="type-caption"
            role="alert"
            style={{ marginTop: "8px", color: "var(--color-error)" }}
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p
            id={`${inputId}-helper`}
            className="type-body-sm"
            style={{ marginTop: "8px", color: "var(--color-muted)" }}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
