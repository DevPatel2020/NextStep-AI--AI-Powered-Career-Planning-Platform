import { describe, expect, it } from "vitest";
import { InvalidRoleError, isAdminUser, isUserRole, normalizeUserRole } from "@/lib/roles";
import { getEnvAdmin, matchesEnvAdmin } from "@/lib/admin-credentials";

describe("normalizeUserRole", () => {
  it("accepts allowlisted career stages", () => {
    for (const r of ["student", "recent_graduate", "career_switcher", "other"]) {
      expect(normalizeUserRole(r)).toBe(r);
      expect(isUserRole(r)).toBe(true);
    }
  });

  it("distinguishes 'not provided' from 'clear'", () => {
    expect(normalizeUserRole(undefined)).toBeUndefined();
    expect(normalizeUserRole("")).toBeNull();
    expect(normalizeUserRole(null)).toBeNull();
  });

  it.each(["admin", "ADMIN", "Admin", "superuser", 1, {}, ["admin"]])(
    "rejects privileged or malformed value %j",
    (value) => {
      expect(() => normalizeUserRole(value)).toThrow(InvalidRoleError);
    },
  );
});

describe("isAdminUser", () => {
  it("grants admin only via the isAdmin flag", () => {
    expect(isAdminUser({ isAdmin: true })).toBe(true);
    expect(isAdminUser({ isAdmin: false })).toBe(false);
    expect(isAdminUser(null)).toBe(false);
    // A user-controlled role string must never grant admin.
    expect(isAdminUser({ isAdmin: false, role: "admin" } as { isAdmin: boolean })).toBe(false);
  });
});

describe("env bootstrap admin", () => {
  it("is disabled when env vars are missing (no hardcoded defaults)", () => {
    expect(getEnvAdmin({} as unknown as NodeJS.ProcessEnv)).toBeNull();
    expect(matchesEnvAdmin("jay@admin.com", "admin@123", {} as unknown as NodeJS.ProcessEnv)).toBe(false);
    expect(matchesEnvAdmin("a@b.co", "pw", { ADMIN_EMAIL: "a@b.co" } as unknown as NodeJS.ProcessEnv)).toBe(false);
  });

  it("matches configured credentials case-insensitively on email only", () => {
    const env = { ADMIN_EMAIL: "Root@Example.com", ADMIN_PASSWORD: "S3cret!pass" } as unknown as NodeJS.ProcessEnv;
    expect(matchesEnvAdmin(" root@example.com ", "S3cret!pass", env)).toBe(true);
    expect(matchesEnvAdmin("root@example.com", "s3cret!pass", env)).toBe(false);
    expect(matchesEnvAdmin("other@example.com", "S3cret!pass", env)).toBe(false);
  });
});
