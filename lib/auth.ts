import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getEnvAdmin, matchesEnvAdmin } from "@/lib/admin-credentials";
import { isAdminUser } from "@/lib/roles";

const USER_RECHECK_MS = 5 * 60 * 1000; // re-check disabled status every 5 minutes

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email.trim().toLowerCase();

        // 1. Optional bootstrap admin from env (no hardcoded defaults)
        if (matchesEnvAdmin(email, credentials.password)) {
          return {
            id: "admin-1",
            email: getEnvAdmin()!.email,
            name: "Default Admin",
            role: "admin",
          };
        }

        // 2. Check for regular user or admin in DB
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) return null;

        const ok = await bcrypt.compare(credentials.password, user.password);
        if (!ok) return null;

        // Prevent disabled users from logging in
        if (user.disabled) return null;

        // Admin access comes ONLY from the server-controlled isAdmin flag.
        // `user.role` is a self-selected career stage and must never grant privileges.
        const isAdmin = isAdminUser(user);

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
          role: isAdmin ? "admin" : "user",
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role ?? "user";
        token.checkedAt = Date.now();
        return token;
      }

      // Periodically re-validate DB users so that disabling or deleting an
      // account takes effect without waiting for the 30-day JWT to expire.
      const isDbUser = token.id && token.id !== "admin-1";
      const stale = !token.checkedAt || Date.now() - token.checkedAt > USER_RECHECK_MS;
      if (isDbUser && !token.revoked && stale) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { disabled: true },
          });
          token.checkedAt = Date.now();
          if (!dbUser || dbUser.disabled) token.revoked = true;
        } catch (err) {
          // Fail open on transient DB errors; the next request will retry.
          console.error("Session re-validation failed:", err);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token.revoked) {
        // Strip identity so every `session.user.id` check rejects the request.
        return { ...session, user: { id: "" } };
      }
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.role = token.role ?? "user";
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
