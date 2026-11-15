const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: unknown): value is string {
  return typeof value === "string" && value.length <= 254 && EMAIL_RE.test(value.trim());
}

export const MIN_PASSWORD_LENGTH = 8;
// bcrypt silently truncates input beyond 72 bytes.
export const MAX_PASSWORD_LENGTH = 72;

export function validatePassword(value: unknown): string | null {
  if (typeof value !== "string" || value.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  }
  if (Buffer.byteLength(value, "utf8") > MAX_PASSWORD_LENGTH) {
    return `Password must be at most ${MAX_PASSWORD_LENGTH} bytes`;
  }
  return null;
}

/**
 * Parses an integer query parameter, falling back to `fallback` for missing or
 * non-numeric input and clamping into [min, max]. Never returns NaN.
 */
export function parseIntParam(
  value: string | null | undefined,
  fallback: number,
  { min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER }: { min?: number; max?: number } = {},
): number {
  const parsed = Number.parseInt(value ?? "", 10);
  const n = Number.isFinite(parsed) ? parsed : fallback;
  return Math.min(max, Math.max(min, n));
}

/** Keeps only non-empty strings, trimmed and length-capped. */
export function sanitizeStringArray(value: unknown, { maxItems = 50, maxLength = 100 } = {}): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v): v is string => typeof v === "string")
    .map((v) => v.trim().slice(0, maxLength))
    .filter(Boolean)
    .slice(0, maxItems);
}
