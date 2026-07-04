"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

const roleOptions = [
  { value: "student",          label: "Student" },
  { value: "recent_graduate",  label: "Recent graduate" },
  { value: "career_switcher",  label: "Career switcher" },
  { value: "other",            label: "Other" },
];

const interestTags = [
  "Tech",
  "Business",
  "Healthcare",
  "Design",
  "Data",
  "Marketing",
  "Education",
  "Engineering",
];

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [interests, setInterests] = useState<Set<string>>(new Set());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Name is required";
    if (!email) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "Please enter a valid email";
    if (!password) next.password = "Password is required";
    else if (password.length < 8)
      next.password = "Password must be at least 8 characters";
    if (!role) next.role = "Please select your role";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const toggleInterest = (tag: string) => {
    setInterests((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setFormError("");
    setLoading(true);
    try {
      const signupRes = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          role: role || undefined,
          interests: Array.from(interests),
        }),
      });
      const data = await signupRes.json();

      if (!signupRes.ok) {
        setFormError(data.error || "Sign up failed. Please try again.");
        return;
      }

      const signInRes = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });
      if (signInRes?.error) {
        setFormError("Account created. Please sign in.");
        router.push("/signin");
        return;
      }
      router.push("/overview");
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
      <div style={{ width: "100%", maxWidth: "460px" }}>

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
            CREATE ACCOUNT
          </p>
          <h1
            className="type-display-md"
            style={{ color: "var(--color-ink)" }}
          >
            START YOUR JOURNEY
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
            }}
          >
            <p className="type-caption" style={{ color: "var(--color-error)" }}>
              {formError.toUpperCase()}
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          <Input
            label="Name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
          />
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
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />
          <Select
            label="I am a"
            placeholder="Select your role"
            options={roleOptions}
            value={role}
            onChange={(e) => setRole(e.target.value)}
            error={errors.role}
          />

          {/* Interests */}
          <div>
            <p className="type-caption" style={{ color: "var(--color-muted)", marginBottom: "16px" }}>
              INTERESTS (OPTIONAL)
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {interestTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  id={`interest-${tag.toLowerCase()}`}
                  onClick={() => toggleInterest(tag)}
                  className="type-caption"
                  style={{
                    padding: "6px 16px",
                    background: "transparent",
                    border: interests.has(tag)
                      ? "1px solid var(--color-ink)"
                      : "1px solid var(--color-hairline)",
                    color: interests.has(tag)
                      ? "var(--color-ink)"
                      : "var(--color-muted)",
                    cursor: "pointer",
                    borderRadius: "0",
                    transition: "border-color 0.15s ease, color 0.15s ease",
                  }}
                >
                  {tag.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
            style={{ marginTop: "8px" }}
          >
            CREATE ACCOUNT
          </Button>
        </form>

        {/* Footer link */}
        <p
          className="type-body-sm"
          style={{ marginTop: "40px", textAlign: "center", color: "var(--color-muted)" }}
        >
          Already have an account?{" "}
          <Link
            href="/signin"
            style={{ color: "var(--color-link)", textDecoration: "none" }}
          >
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
}
