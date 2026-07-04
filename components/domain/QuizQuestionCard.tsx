"use client";

import { Card } from "@/components/ui/Card";

export interface QuizOption {
  value: string;
  label: string;
}

interface QuizQuestionCardProps {
  question: string;
  options: QuizOption[];
  value?: string;
  onChange: (value: string) => void;
  type?: "single" | "multiple" | "likert";
  likertLabels?: [string, string];
}

export function QuizQuestionCard({
  question,
  options,
  value,
  onChange,
  type = "single",
  likertLabels = ["Strongly disagree", "Strongly agree"],
}: QuizQuestionCardProps) {
  if (type === "likert") {
    return (
      <Card padding="lg">
        <h3 className="type-title-md" style={{ color: "var(--color-ink)", marginBottom: "20px" }}>
          {question.toUpperCase()}
        </h3>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
          <span className="type-body-sm" style={{ color: "var(--color-muted)" }}>
            {likertLabels[0].toUpperCase()}
          </span>
          <div style={{ display: "flex", flex: 1, flexWrap: "wrap", justifyContent: "center", gap: "8px" }}>
            {options.map((opt) => {
              const isChecked = value === opt.value;
              return (
                <label
                  key={opt.value}
                  style={{
                    cursor: "pointer",
                    border: isChecked ? "1px solid var(--color-ink)" : "1px solid var(--color-hairline)",
                    background: isChecked ? "var(--color-surface-soft)" : "transparent",
                    borderRadius: "0px",
                    padding: "8px 16px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease-in-out",
                  }}
                  className="type-body-sm"
                >
                  <input
                    type="radio"
                    name={question.slice(0, 20)}
                    value={opt.value}
                    checked={isChecked}
                    onChange={() => onChange(opt.value)}
                    style={{ display: "none" }}
                  />
                  <span style={{ color: isChecked ? "var(--color-ink)" : "var(--color-body)" }}>
                    {opt.label.toUpperCase()}
                  </span>
                </label>
              );
            })}
          </div>
          <span className="type-body-sm" style={{ color: "var(--color-muted)" }}>
            {likertLabels[1].toUpperCase()}
          </span>
        </div>
      </Card>
    );
  }

  return (
    <Card padding="lg">
      <h3 className="type-title-md" style={{ color: "var(--color-ink)", marginBottom: "20px" }}>
        {question.toUpperCase()}
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {options.map((opt) => {
          const isChecked = type === "multiple" ? value?.includes(opt.value) : value === opt.value;
          return (
            <label
              key={opt.value}
              style={{
                display: "flex",
                cursor: "pointer",
                alignItems: "center",
                gap: "12px",
                border: isChecked ? "1px solid var(--color-ink)" : "1px solid var(--color-hairline)",
                background: isChecked ? "var(--color-surface-soft)" : "transparent",
                borderRadius: "0px",
                padding: "12px 16px",
                transition: "all 0.2s ease-in-out",
              }}
            >
              <input
                type={type === "multiple" ? "checkbox" : "radio"}
                name={question.slice(0, 20)}
                value={opt.value}
                checked={isChecked}
                onChange={() =>
                  onChange(
                    type === "multiple"
                      ? value?.includes(opt.value)
                        ? (value ?? "").replace(opt.value, "").replace(/\s*,\s*/, "")
                        : [value, opt.value].filter(Boolean).join(",")
                      : opt.value
                  )
                }
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "0px",
                  border: "1px solid var(--color-hairline-strong)",
                  accentColor: "var(--color-ink)",
                  margin: 0,
                  cursor: "pointer",
                }}
              />
              <span className="type-body-sm" style={{ color: isChecked ? "var(--color-ink)" : "var(--color-body)" }}>
                {opt.label}
              </span>
            </label>
          );
        })}
      </div>
    </Card>
  );
}
