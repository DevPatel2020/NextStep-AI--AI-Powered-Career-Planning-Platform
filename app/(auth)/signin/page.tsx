"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/overview";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next: typeof errors = {};
    if (!email) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "Please enter a valid email";
    if (!password) next.password = "Password is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });
      if (res?.error) {
        setFormError("Invalid email or password. Please try again.");
        return;
      }
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      if (session?.user?.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push(callbackUrl);
      }
      router.refresh();
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--color-canvas)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "420px" }}>

        {/* Wordmark */}
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span className="type-wordmark" style={{ color: "var(--color-ink)" }}>
              CAREERSENCE
            </span>
          </Link>
        </div>

        {/* Form heading */}
        <div style={{ marginBottom: "48px" }}>
          <p className="type-caption" style={{ color: "var(--color-muted)", marginBottom: "12px" }}>
            SIGN IN
          </p>
          <h1
            className="type-display-md"
            style={{ color: "var(--color-ink)" }}
          >
            WELCOME BACK
          </h1>
        </div>

        {/* Error */}
        {formError && (
          <div
            role="alert"
            style={{
              marginBottom: "24px",
              padding: "12px 16px",
              border: "1px solid var(--color-error)",
              background: "transparent",
            }}
          >
            <p className="type-caption" style={{ color: "var(--color-error)" }}>
              {formError.toUpperCase()}
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Checkbox
              label="Remember me"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <Link
              href="/"
              className="type-caption"
              style={{ color: "var(--color-link)", textDecoration: "none" }}
            >
              FORGOT PASSWORD
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
          >
            SIGN IN
          </Button>
        </form>

        {/* Footer link */}
        <p
          className="type-body-sm"
          style={{ marginTop: "40px", textAlign: "center", color: "var(--color-muted)" }}
        >
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            style={{ color: "var(--color-link)", textDecoration: "none" }}
          >
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--color-canvas)",
          }}
        >
          <span className="type-caption" style={{ color: "var(--color-muted)" }}>
            LOADING...
          </span>
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
