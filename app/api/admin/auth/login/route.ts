import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { encode } from "next-auth/jwt";
import { cookies } from "next/headers";
import { getEnvAdmin, matchesEnvAdmin } from "@/lib/admin-credentials";
import { isAdminUser } from "@/lib/roles";

const ADMIN_SESSION_SECONDS = 8 * 60 * 60; // 8 hours

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json().catch(() => ({}));

        if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
            return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
        }

        const emailLower = email.trim().toLowerCase();
        let adminPayload = null;

        // 1. Optional bootstrap admin from env (no hardcoded defaults)
        if (matchesEnvAdmin(emailLower, password)) {
            adminPayload = { id: "admin-1", email: getEnvAdmin()!.email, name: "Admin", role: "admin" };
        } else {
            // 2. Check DB admin
            const user = await prisma.user.findUnique({ where: { email: emailLower } });
            if (user && user.password && !user.disabled && isAdminUser(user)) {
                const ok = await bcrypt.compare(password, user.password);
                if (ok) {
                    adminPayload = { id: user.id, email: user.email, name: user.name ?? "Admin", role: "admin" };
                }
            }
        }

        if (!adminPayload) {
            return NextResponse.json({ error: "Invalid admin credentials" }, { status: 401 });
        }

        // Create a secure token specifically for admin
        const token = await encode({
            token: adminPayload,
            secret: process.env.NEXTAUTH_SECRET as string,
            maxAge: ADMIN_SESSION_SECONDS,
        });

        // Set cookie
        const cookieStore = cookies();
        (await cookieStore).set("admin_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: ADMIN_SESSION_SECONDS,
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Admin login error", err);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
