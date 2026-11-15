/**
 * User "role" in this app is a self-described career stage (student, career
 * switcher, …). It is NOT an authorization role. Admin access is granted only
 * through the `isAdmin` flag, which users can never set themselves.
 */
export const USER_ROLES = ["student", "recent_graduate", "career_switcher", "other"] as const;

export type UserRole = (typeof USER_ROLES)[number];

export function isUserRole(value: unknown): value is UserRole {
  return typeof value === "string" && (USER_ROLES as readonly string[]).includes(value);
}

/**
 * Normalizes a client-supplied career-stage role.
 * - `undefined` → `undefined` (field not provided)
 * - `""` / `null` → `null` (clear the field)
 * - a known role → that role
 * - anything else → throws, so callers can return 400
 */
export function normalizeUserRole(value: unknown): UserRole | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  if (isUserRole(value)) return value;
  throw new InvalidRoleError();
}

export class InvalidRoleError extends Error {
  constructor() {
    super(`Role must be one of: ${USER_ROLES.join(", ")}`);
    this.name = "InvalidRoleError";
  }
}

/** Only the server-controlled `isAdmin` flag grants admin access. */
export function isAdminUser(user: { isAdmin?: boolean | null } | null | undefined): boolean {
  return user?.isAdmin === true;
}
