"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

const navLinks = [
  { href: "/overview",           label: "Overview" },
  { href: "/ai-roadmap",         label: "AI Roadmap" },
  { href: "/career-quiz",        label: "Career Quiz" },
  { href: "/career-tree",        label: "Career Tree" },
  { href: "/learning-resources", label: "Learning" },
  { href: "/job-hunting",        label: "Jobs" },
  { href: "/college-finder",     label: "Colleges" },
  { href: "/analyze",            label: "Analyze" },
];

export function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const isLoggedIn = status === "authenticated" && !!session?.user;
  const userInitial =
    session?.user?.name?.[0]?.toUpperCase() ??
    session?.user?.email?.[0]?.toUpperCase() ??
    "U";
  const isAuthPage = pathname === "/signin" || pathname === "/signup";

  return (
    <header
      role="banner"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        height: "56px",
        background: "transparent",
        borderBottom: mobileMenuOpen
          ? "1px solid var(--color-hairline)"
          : "none",
      }}
    >
      {/* Main bar */}
      <div
        style={{
          height: "56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 40px",
          position: "relative",
        }}
      >
        {/* Left — MENU label or hamburger on mobile */}
        <div style={{ display: "flex", alignItems: "center", gap: "24px", width: "160px" }}>
          {isLoggedIn && (
            <button
              type="button"
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation"
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 0,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {/* Hamburger icon */}
              <svg
                width="18"
                height="12"
                viewBox="0 0 18 12"
                fill="none"
                style={{ display: "block" }}
              >
                <line x1="0" y1="1"  x2="18" y2="1"  stroke="white" strokeWidth="1.5" />
                <line x1="0" y1="6"  x2="18" y2="6"  stroke="white" strokeWidth="1.5" />
                <line x1="0" y1="11" x2="18" y2="11" stroke="white" strokeWidth="1.5" />
              </svg>
              <span className="type-nav" style={{ color: "var(--color-ink)" }}>
                {mobileMenuOpen ? "CLOSE" : "MENU"}
              </span>
            </button>
          )}

          {!isLoggedIn && !isAuthPage && (
            <Link
              href="/signin"
              className="type-nav"
              style={{ color: "var(--color-muted)", textDecoration: "none" }}
            >
              SIGN IN
            </Link>
          )}
        </div>

        {/* Center — Wordmark */}
        <Link
          href="/"
          aria-label="Careersence home"
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            textDecoration: "none",
          }}
        >
          <span className="type-wordmark" style={{ color: "var(--color-ink)" }}>
            CAREERSENCE
          </span>
        </Link>

        {/* Right — auth or store-like slot */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            width: "160px",
            justifyContent: "flex-end",
          }}
        >
          {!isAuthPage && (
            <>
              {isLoggedIn ? (
                <div style={{ position: "relative" }}>
                  <button
                    type="button"
                    id="user-menu-btn"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    aria-expanded={userMenuOpen}
                    aria-haspopup="true"
                    aria-label="User menu"
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      border: "1px solid var(--color-hairline-strong)",
                      background: "transparent",
                      color: "var(--color-ink)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-mono)",
                      fontSize: "11px",
                      letterSpacing: "0",
                    }}
                  >
                    {userInitial}
                  </button>

                  {userMenuOpen && (
                    <>
                      <div
                        style={{ position: "fixed", inset: 0, zIndex: 40 }}
                        aria-hidden="true"
                        onClick={() => setUserMenuOpen(false)}
                      />
                      <div
                        role="menu"
                        style={{
                          position: "absolute",
                          right: 0,
                          top: "calc(100% + 8px)",
                          zIndex: 50,
                          minWidth: "160px",
                          background: "var(--color-surface-card)",
                          border: "1px solid var(--color-hairline)",
                          padding: "8px 0",
                        }}
                      >
                        <Link
                          href="/profile"
                          role="menuitem"
                          className="type-nav"
                          onClick={() => setUserMenuOpen(false)}
                          style={{
                            display: "block",
                            padding: "10px 16px",
                            color: "var(--color-body)",
                            textDecoration: "none",
                          }}
                        >
                          PROFILE
                        </Link>
                        <button
                          type="button"
                          role="menuitem"
                          className="type-nav"
                          onClick={() => {
                            setUserMenuOpen(false);
                            signOut({ callbackUrl: "/" });
                          }}
                          style={{
                            display: "block",
                            width: "100%",
                            padding: "10px 16px",
                            background: "transparent",
                            border: "none",
                            textAlign: "left",
                            color: "var(--color-muted)",
                            cursor: "pointer",
                            letterSpacing: "2px",
                            fontSize: "12px",
                            fontFamily: "var(--font-mono)",
                            textTransform: "uppercase",
                          }}
                        >
                          SIGN OUT
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link
                  href="/signup"
                  className="btn-bugatti"
                  style={{ height: "32px", padding: "0 20px", fontSize: "11px" }}
                >
                  GET STARTED
                </Link>
              )}
            </>
          )}
        </div>
      </div>

      {/* Full-screen slide-down nav (when MENU is open) */}
      {mobileMenuOpen && isLoggedIn && (
        <div
          role="navigation"
          aria-label="Main navigation"
          style={{
            position: "fixed",
            top: "56px",
            left: 0,
            right: 0,
            bottom: 0,
            background: "var(--color-canvas)",
            borderTop: "1px solid var(--color-hairline)",
            padding: "64px 40px",
            zIndex: 99,
            overflowY: "auto",
          }}
        >
          <div
            style={{
              maxWidth: "1280px",
              margin: "0 auto",
              width: "100%",
            }}
          >
            <nav
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: "24px 40px",
              }}
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="type-nav"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: "block",
                    padding: "16px 0",
                    borderBottom: "1px solid var(--color-hairline)",
                    color:
                      pathname === link.href
                        ? "var(--color-ink)"
                        : "var(--color-muted)",
                    textDecoration: "none",
                    transition: "color 0.15s ease",
                  }}
                >
                  {link.label.toUpperCase()}
                  {pathname === link.href && (
                    <span
                      style={{
                        display: "inline-block",
                        marginLeft: "8px",
                        color: "var(--color-ink)",
                      }}
                    >
                      —
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
