import { prisma } from "@/lib/prisma";

/**
 * A course's structure is visible to its author at any status, and to everyone
 * else only once an admin has PUBLISHED it. Drafts, pending and rejected
 * courses must not leak through the section/lecture endpoints.
 */
export function courseVisibilityFilter(userId: string | undefined) {
  return userId
    ? { OR: [{ authorId: userId }, { status: "PUBLISHED" }] }
    : { status: "PUBLISHED" };
}

export async function canViewCourse(courseId: string, userId: string | undefined): Promise<boolean> {
  const course = await prisma.course.findFirst({
    where: { id: courseId, ...courseVisibilityFilter(userId) },
    select: { id: true },
  });
  return course !== null;
}
