import { SelectHTMLAttributes, forwardRef, useId } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, placeholder, id, className = "", style: externalStyle, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || `select-${generatedId.replace(/:/g, "")}`;

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
            {label.toUpperCase()}
          </label>
        )}
        <div style={{ position: "relative" }}>
          <select
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            className={className}
            style={{
              display: "block",
              appearance: "none",
              width: "100%",
              background: "transparent",
              color: "var(--color-ink)",
              border: "none",
              borderBottom: `1px solid ${error ? "var(--color-error)" : "var(--color-hairline-strong)"}`,
              borderRadius: "0",
              padding: "12px 32px 12px 0",
              height: "44px",
              fontFamily: "var(--font-body)",
              fontSize: "16px",
              outline: "none",
              cursor: "pointer",
              colorScheme: "dark",
              ...externalStyle,
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderBottomColor = "var(--color-ink)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderBottomColor = error
                ? "var(--color-error)"
                : "var(--color-hairline-strong)";
            }}
            {...props}
          >
            {placeholder && (
              <option value="" disabled style={{ background: "var(--color-surface-card)", color: "var(--color-muted)" }}>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                style={{ background: "var(--color-surface-card)", color: "var(--color-ink)" }}
              >
                {opt.label}
              </option>
            ))}
          </select>
          {/* Arrow */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: "4px",
              bottom: 0,
              display: "flex",
              alignItems: "center",
              pointerEvents: "none",
              color: "var(--color-muted)",
            }}
          >
            <svg width="10" height="6" fill="none" viewBox="0 0 10 6">
              <path stroke="currentColor" strokeWidth="1" d="M1 1l4 4 4-4" />
            </svg>
          </div>
        </div>
        {error && (
          <p
            className="type-caption"
            role="alert"
            style={{ marginTop: "8px", color: "var(--color-error)" }}
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p
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

Select.displayName = "Select";
