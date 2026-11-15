import { vi } from "vitest";

/**
 * A minimal Prisma mock: every model method is a vi.fn() so tests can set
 * return values and assert on the exact `where` clauses routes send.
 */
export function createPrismaMock() {
  const model = () => ({
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    updateMany: vi.fn(),
    upsert: vi.fn(),
    delete: vi.fn(),
    deleteMany: vi.fn(),
    count: vi.fn(),
  });
  return {
    user: model(),
    course: model(),
    section: model(),
    lecture: model(),
    progress: model(),
    enrollment: model(),
    quizSession: model(),
    savedResource: model(),
    savedJob: model(),
  };
}

export type PrismaMock = ReturnType<typeof createPrismaMock>;

export function jsonRequest(url: string, body: unknown, method = "POST") {
  return new Request(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

export const params = <T extends Record<string, string>>(p: T) => ({ params: Promise.resolve(p) });
