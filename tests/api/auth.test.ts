import { beforeEach, describe, expect, it, vi } from "vitest";
import bcrypt from "bcryptjs";
import { createPrismaMock, jsonRequest } from "../helpers";

const prisma = vi.hoisted(() => ({}) as ReturnType<typeof createPrismaMock>);
vi.mock("@/lib/prisma", () => ({ prisma }));

import { POST as signup } from "@/app/api/auth/signup/route";
import { authOptions } from "@/lib/auth";

type Authorize = (c: Record<string, string>) => Promise<{ id: string; role: string } | null>;
// CredentialsProvider stores the user-supplied authorize() under options.
const authorize = (authOptions.providers[0] as unknown as { options: { authorize: Authorize } }).options.authorize;

beforeEach(() => {
  Object.assign(prisma, createPrismaMock());
  delete process.env.ADMIN_EMAIL;
  delete process.env.ADMIN_PASSWORD;
});

describe("POST /api/auth/signup", () => {
  const valid = { email: "New@Example.com", password: "longenough", name: "  Ann ", role: "student" };

  it("creates a user with a normalized email and allowlisted role", async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockImplementation(async ({ data }) => ({ id: "u1", ...data }));

    const res = await signup(jsonRequest("http://x/api/auth/signup", valid));
    expect(res.status).toBe(200);
    const data = prisma.user.create.mock.calls[0][0].data;
    expect(data).toMatchObject({ email: "new@example.com", name: "Ann", role: "student" });
    expect(data.password).not.toBe("longenough");
    // isAdmin is never taken from the request body
    expect(data).not.toHaveProperty("isAdmin");
  });

  it.each(["admin", "ADMIN", "superuser"])("rejects self-assigned privileged role %s", async (role) => {
    const res = await signup(jsonRequest("http://x/api/auth/signup", { ...valid, role }));
    expect(res.status).toBe(400);
    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it("ignores an isAdmin flag in the body", async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockImplementation(async ({ data }) => ({ id: "u1", ...data }));
    await signup(jsonRequest("http://x/api/auth/signup", { ...valid, isAdmin: true }));
    expect(prisma.user.create.mock.calls[0][0].data).not.toHaveProperty("isAdmin");
  });

  it("validates email, password and body shape", async () => {
    expect((await signup(jsonRequest("http://x", { ...valid, email: "bad" }))).status).toBe(400);
    expect((await signup(jsonRequest("http://x", { ...valid, password: "short" }))).status).toBe(400);
    expect((await signup(jsonRequest("http://x", "{not json"))).status).toBe(400);
  });

  it("returns 409 for an existing email", async () => {
    prisma.user.findUnique.mockResolvedValue({ id: "existing" });
    expect((await signup(jsonRequest("http://x", valid))).status).toBe(409);
  });
});

describe("credentials authorize()", () => {
  const hash = bcrypt.hashSync("password123", 4);

  it("does not grant admin to a user whose role string is 'admin'", async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: "u1", email: "a@b.co", password: hash, role: "admin", isAdmin: false, disabled: false,
    });
    const user = await authorize({ email: "a@b.co", password: "password123" });
    expect(user?.role).toBe("user");
  });

  it("grants admin from the isAdmin flag", async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: "u1", email: "a@b.co", password: hash, role: null, isAdmin: true, disabled: false,
    });
    expect((await authorize({ email: "a@b.co", password: "password123" }))?.role).toBe("admin");
  });

  it("rejects disabled users and wrong passwords", async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: "u1", email: "a@b.co", password: hash, isAdmin: false, disabled: true,
    });
    expect(await authorize({ email: "a@b.co", password: "password123" })).toBeNull();
    prisma.user.findUnique.mockResolvedValue({
      id: "u1", email: "a@b.co", password: hash, isAdmin: false, disabled: false,
    });
    expect(await authorize({ email: "a@b.co", password: "nope" })).toBeNull();
  });

  it("the old hardcoded admin credentials no longer work", async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    expect(await authorize({ email: "jay@admin.com", password: "admin@123" })).toBeNull();
  });

  it("env bootstrap admin works only when configured", async () => {
    process.env.ADMIN_EMAIL = "boss@example.com";
    process.env.ADMIN_PASSWORD = "a-strong-secret";
    expect((await authorize({ email: "boss@example.com", password: "a-strong-secret" }))?.role).toBe("admin");
  });
});

describe("jwt callback session revocation", () => {
  const jwt = authOptions.callbacks!.jwt! as unknown as (a: { token: Record<string, unknown>; user?: unknown }) => Promise<Record<string, unknown>>;
  const session = authOptions.callbacks!.session! as unknown as (a: { session: { user: Record<string, unknown> }; token: Record<string, unknown> }) => Promise<{ user: { id: string } }>;

  it("revokes a stale token whose user was disabled", async () => {
    prisma.user.findUnique.mockResolvedValue({ disabled: true });
    const token = await jwt({ token: { id: "u1", checkedAt: 0 } });
    expect(token.revoked).toBe(true);
    const s = await session({ session: { user: { id: "u1" } }, token });
    expect(s.user.id).toBe("");
  });

  it("does not hit the DB for a recently checked token", async () => {
    const token = await jwt({ token: { id: "u1", checkedAt: Date.now() } });
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
    expect(token.revoked).toBeUndefined();
  });
});
