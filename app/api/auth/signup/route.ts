import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { InvalidRoleError, normalizeUserRole } from "@/lib/roles";
import { isValidEmail, sanitizeStringArray, validatePassword } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
    const { name, email, password, role, interests } = body as {
      name?: string;
      email?: string;
      password?: string;
      role?: string;
      interests?: string[];
    };

    const trimmedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    if (!trimmedEmail || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }
    if (!isValidEmail(trimmedEmail)) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
    }
    const passwordError = validatePassword(password);
    if (passwordError) {
      return NextResponse.json({ error: passwordError }, { status: 400 });
    }

    // `role` is a career stage. Reject anything outside the allowlist so a
    // client can never self-assign privileged values such as "admin".
    let normalizedRole: string | null;
    try {
      normalizedRole = normalizeUserRole(role) ?? null;
    } catch (err) {
      if (err instanceof InvalidRoleError) {
        return NextResponse.json({ error: err.message }, { status: 400 });
      }
      throw err;
    }

    const existing = await prisma.user.findUnique({
      where: { email: trimmedEmail },
    });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const interestsJson = Array.isArray(interests) ? JSON.stringify(sanitizeStringArray(interests)) : null;

    const user = await prisma.user.create({
      data: {
        email: trimmedEmail,
        password: hashedPassword,
        name: typeof name === "string" ? name.trim().slice(0, 100) || null : null,
        role: normalizedRole,
        interests: interestsJson,
      },
    });

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
    });
  } catch (e) {
    console.error("Signup error:", e);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
