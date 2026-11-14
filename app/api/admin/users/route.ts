import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

import bcrypt from "bcryptjs";
import { isValidEmail, parseIntParam, validatePassword } from "@/lib/validation";

const PAGE_SIZE = 10;

/** POST /api/admin/users - Create a new admin */
export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await req.json().catch(() => ({}));
    const { name, email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
    }
    const passwordError = validatePassword(password);
    if (passwordError) {
      return NextResponse.json({ error: passwordError }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (existing) {
      return NextResponse.json({ error: "User already exists with this email" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        name: typeof name === "string" && name.trim() ? name.trim().slice(0, 100) : undefined,
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        isAdmin: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isAdmin: true,
        createdAt: true,
      }
    });

    return NextResponse.json({ message: "Admin created successfully", user: newUser }, { status: 201 });
  } catch (err) {
    console.error("Failed to create admin:", err);
    return NextResponse.json({ error: "Failed to create admin account" }, { status: 500 });
  }
}

/** GET /api/admin/users?page=1&search=&limit=10 */
export async function GET(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { searchParams } = req.nextUrl;
  const page = parseIntParam(searchParams.get("page"), 1, { min: 1 });
  const limit = parseIntParam(searchParams.get("limit"), PAGE_SIZE, { min: 1, max: 100 });
  const search = (searchParams.get("search") ?? "").trim();
  const roleFilter = searchParams.get("role")?.toLowerCase();

  const where: Prisma.UserWhereInput = search
    ? {
      OR: [
        { name: { contains: search, mode: "insensitive" as const } },
        { email: { contains: search, mode: "insensitive" as const } },
      ],
    }
    : {};

  if (roleFilter === "admins") {
    where.isAdmin = true;
  } else if (roleFilter === "users") {
    where.isAdmin = false;
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        disabled: true,
        createdAt: true,
        _count: {
          select: {
            roadmaps: true,
            savedJobs: true,
            quizSessions: true,
            careerTrees: true,
            resumeAnalyses: true,
          },
        },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return NextResponse.json({
    users: users.map((u) => ({ ...u, createdAt: u.createdAt.toISOString() })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
