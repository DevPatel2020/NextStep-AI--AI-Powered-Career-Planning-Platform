"use client";

import Link from "next/link";
import { useState } from "react";

const features = [
  {
    title: "Career Quiz",
    caption: "DISCOVER",
    description:
      "Answer a series of questions and receive personalized career cluster recommendations aligned to your strengths.",
    href: "/career-quiz",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
      </svg>
    ),
  },
  {
    title: "AI Roadmap",
    caption: "PLAN",
    description:
      "A step-by-step timeline from interests to interviews — with action items, milestones, and adaptive guidance.",
    href: "/ai-roadmap",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
      </svg>
    ),
  },
  {
    title: "Learning Resources",
    caption: "ACQUIRE",
    description:
      "Courses, articles, and videos curated by career path and skill level — structured for efficient progress.",
    href: "/learning-resources",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
  {
    title: "Job Hunting",
    caption: "EXECUTE",
    description:
      "Track applications, save roles, and use AI to tailor resumes and cover letters to each position.",
    href: "/job-hunting",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
      </svg>
    ),
  },
  {
    title: "College Finder",
    caption: "EXPLORE",
    description:
      "Discover and compare programs that match your goals. Filter by location, ranking, cost, and field.",
    href: "/college-finder",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
      </svg>
    ),
  },
  {
    title: "Analyze",
    caption: "OPTIMIZE",
    description:
      "Get AI feedback on your resume, job descriptions, and career comparisons. Surface gaps and opportunities.",
    href: "/analyze",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
      </svg>
    ),
  },
];

function FeatureCard({ item, colIndex }: { item: typeof features[0]; colIndex: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={item.href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "block",
        padding: "40px 32px",
        background: hovered ? "var(--color-surface-soft)" : "var(--color-canvas)",
        borderRight: colIndex % 3 !== 2 ? "1px solid var(--color-hairline)" : "none",
        textDecoration: "none",
        transition: "background 0.2s ease",
      }}
    >
      {/* Icon & caption row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "32px",
        }}
      >
        <span style={{ color: "var(--color-muted)" }}>{item.icon}</span>
        <span className="type-caption" style={{ color: "var(--color-muted-soft)" }}>
          {item.caption}
        </span>
      </div>

      {/* Title */}
      <h3
        className="type-display-sm"
        style={{ color: "var(--color-ink)", marginBottom: "16px" }}
      >
        {item.title.toUpperCase()}
      </h3>

      {/* Description */}
      <p
        className="type-body-sm"
        style={{ color: "var(--color-muted)", marginBottom: "32px" }}
      >
        {item.description}
      </p>

      {/* CTA */}
      <span
        className="type-caption"
        style={{ color: "var(--color-body-strong)" }}
      >
        EXPLORE →
      </span>
    </Link>
  );
}

export default function HomePage() {
  return (
    <div style={{ background: "var(--color-canvas)" }}>

      {/* ─── HERO PHOTO BAND ─── */}
      <section
        style={{
          position: "relative",
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          background: "var(--color-canvas)",
        }}
      >
        {/* Subtle grid texture */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
            zIndex: 0,
          }}
        />
        {/* Radial center glow */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 70%)",
            zIndex: 0,
          }}
        />
        {/* Vignette */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse 120% 100% at 50% 50%, transparent 30%, rgba(0,0,0,0.85) 100%)",
            zIndex: 1,
          }}
        />

        {/* Hero content */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            textAlign: "center",
            padding: "0 40px",
            maxWidth: "1000px",
          }}
        >
          {/* Caption above headline */}
          <p
            className="type-caption"
            style={{
              color: "var(--color-muted)",
              marginBottom: "32px",
            }}
          >
            AI-POWERED CAREER ASSISTANT
          </p>

          {/* Main headline */}
          <h1
            className="type-display-xl"
            style={{ color: "var(--color-ink)", marginBottom: "24px" }}
          >
            YOUR JOB HUNT,
            <br />
            TAILORED
          </h1>

          {/* Sub-copy */}
          <p
            className="type-body-md"
            style={{
              color: "var(--color-muted)",
              maxWidth: "560px",
              margin: "0 auto 56px",
              lineHeight: 1.7,
            }}
          >
            Track your applications and use advanced AI to perfectly tailor your resume and cover letter to every job description.
          </p>

          {/* CTAs */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <Link href="/signup" className="btn-bugatti">
              GET STARTED
            </Link>
            <Link
              href="/job-hunting"
              className="btn-bugatti"
              style={{ borderColor: "var(--color-hairline-strong)", color: "var(--color-muted)" }}
            >
              START JOB HUNTING
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <p className="type-caption" style={{ color: "var(--color-muted-soft)" }}>
            SCROLL
          </p>
          <div
            style={{
              width: "1px",
              height: "40px",
              background: "linear-gradient(to bottom, var(--color-hairline-strong), transparent)",
            }}
          />
        </div>
      </section>

      {/* ─── FEATURES SECTION ─── */}
      <section
        style={{
          padding: "120px 40px",
          maxWidth: "1280px",
          margin: "0 auto",
        }}
      >
        {/* Section heading */}
        <div
          style={{
            marginBottom: "80px",
            borderTop: "1px solid var(--color-hairline)",
            paddingTop: "48px",
          }}
        >
          <p
            className="type-caption"
            style={{ color: "var(--color-muted)", marginBottom: "16px" }}
          >
            THE PLATFORM
          </p>
          <h2
            className="type-display-md"
            style={{ color: "var(--color-ink)", maxWidth: "600px" }}
          >
            EVERYTHING YOU NEED TO MOVE FORWARD
          </h2>
        </div>

        {/* Feature grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "0",
            border: "1px solid var(--color-hairline)",
          }}
        >
          {features.map((item, i) => (
            <div
              key={item.href}
              style={{
                borderBottom: i < 3 ? "1px solid var(--color-hairline)" : "none",
              }}
            >
              <FeatureCard item={item} colIndex={i} />
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA BAND ─── */}
      <section
        style={{
          borderTop: "1px solid var(--color-hairline)",
          padding: "120px 40px",
          textAlign: "center",
          background: "var(--color-canvas)",
        }}
      >
        <p
          className="type-caption"
          style={{ color: "var(--color-muted)", marginBottom: "24px" }}
        >
          BEGIN TODAY
        </p>
        <h2
          className="type-display-lg"
          style={{ color: "var(--color-ink)", marginBottom: "48px" }}
        >
          DISCOVER YOUR PATH
        </h2>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <Link href="/signup" className="btn-bugatti">
            CREATE AN ACCOUNT
          </Link>
          <Link
            href="/signin"
            className="type-nav"
            style={{ color: "var(--color-muted)", textDecoration: "none" }}
          >
            ALREADY HAVE AN ACCOUNT →
          </Link>
        </div>
      </section>

    </div>
  );
}
