import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { InvalidRoleError, normalizeUserRole } from "@/lib/roles";
import { sanitizeStringArray } from "@/lib/validation";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      interests: true,
      createdAt: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const { name, phone, role, interests } = body as {
    name?: unknown;
    phone?: unknown;
    role?: unknown;
    interests?: unknown;
  };

  if (name !== undefined && typeof name !== "string") {
    return NextResponse.json({ error: "Invalid name" }, { status: 400 });
  }
  if (phone !== undefined && typeof phone !== "string") {
    return NextResponse.json({ error: "Please enter a valid phone number" }, { status: 400 });
  }

  // `role` is a self-described career stage. Only allowlisted values are
  // accepted so users can never grant themselves privileged roles.
  let normalizedRole: string | null | undefined;
  try {
    normalizedRole = normalizeUserRole(role);
  } catch (err) {
    if (err instanceof InvalidRoleError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    throw err;
  }

  // Validate phone if provided
  if (phone !== undefined && phone !== "") {
    const cleaned = phone.replace(/[\s\-()]/g, "");
    if (!/^\+?\d{7,15}$/.test(cleaned)) {
      return NextResponse.json(
        { error: "Please enter a valid phone number" },
        { status: 400 }
      );
    }
  }

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      ...(name !== undefined && { name: name.trim().slice(0, 100) || null }),
      ...(phone !== undefined && { phone: phone.trim() || null }),
      ...(normalizedRole !== undefined && { role: normalizedRole }),
      ...(interests !== undefined && {
        interests: JSON.stringify(sanitizeStringArray(interests)),
      }),
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      interests: true,
    },
  });

  return NextResponse.json(updated);
}
