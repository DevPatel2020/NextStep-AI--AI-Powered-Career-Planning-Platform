import { InputHTMLAttributes, forwardRef, useId, ReactNode } from "react";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: ReactNode;
  error?: string;
  helperText?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, helperText, id, className = "", ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || `checkbox-${generatedId.replace(/:/g, "")}`;

    return (
      <div style={{ width: "100%" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
          <input
            ref={ref}
            type="checkbox"
            id={inputId}
            aria-invalid={!!error}
            className={className}
            style={{
              marginTop: "2px",
              width: "14px",
              height: "14px",
              flexShrink: 0,
              accentColor: "var(--color-ink)",
              cursor: "pointer",
              borderRadius: "0",
              border: "1px solid var(--color-hairline-strong)",
              background: "transparent",
              colorScheme: "dark",
            }}
            {...props}
          />
          <div style={{ flex: 1 }}>
            <label
              htmlFor={inputId}
              className="type-body-sm"
              style={{
                cursor: "pointer",
                color: "var(--color-body)",
              }}
            >
              {label}
            </label>
            {helperText && !error && (
              <p
                className="type-body-sm"
                style={{ marginTop: "4px", color: "var(--color-muted)" }}
              >
                {helperText}
              </p>
            )}
            {error && (
              <p
                className="type-caption"
                role="alert"
                style={{ marginTop: "4px", color: "var(--color-error)" }}
              >
                {error}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";
