import Link from "next/link";

const footerCols = [
  {
    heading: "Careersence",
    links: [
      { href: "/overview",  label: "Overview" },
      { href: "/analyze",   label: "Analyze" },
      { href: "/profile",   label: "Profile" },
    ],
  },
  {
    heading: "Tools",
    links: [
      { href: "/career-quiz",        label: "Career Quiz" },
      { href: "/ai-roadmap",         label: "AI Roadmap" },
      { href: "/career-tree",        label: "Career Tree" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { href: "/learning-resources", label: "Learning" },
      { href: "/job-hunting",        label: "Job Hunting" },
      { href: "/college-finder",     label: "College Finder" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { href: "/", label: "Privacy" },
      { href: "/", label: "Terms" },
      { href: "/", label: "Contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer
      role="contentinfo"
      style={{
        background: "var(--color-canvas)",
        borderTop: "1px solid var(--color-hairline)",
        padding: "64px 40px 40px",
      }}
    >
      {/* 4-column link grid */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "40px",
        }}
      >
        {footerCols.map((col) => (
          <div key={col.heading}>
            <p
              className="type-caption"
              style={{
                color: "var(--color-muted)",
                marginBottom: "20px",
              }}
            >
              {col.heading}
            </p>
            <ul role="list" style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px" }}>
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="type-nav"
                    style={{
                      color: "var(--color-muted-soft)",
                      textDecoration: "none",
                      transition: "color 0.15s ease",
                    }}
                    onMouseEnter={(e) =>
                      ((e.target as HTMLElement).style.color = "var(--color-body)")
                    }
                    onMouseLeave={(e) =>
                      ((e.target as HTMLElement).style.color = "var(--color-muted-soft)")
                    }
                  >
                    {link.label.toUpperCase()}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom — wordmark + copyright */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "64px auto 0",
          borderTop: "1px solid var(--color-hairline)",
          paddingTop: "32px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
          textAlign: "center",
        }}
      >
        <Link
          href="/"
          aria-label="Careersence home"
          style={{ textDecoration: "none" }}
        >
          <span className="type-wordmark" style={{ color: "var(--color-muted)" }}>
            CAREERSENCE
          </span>
        </Link>
        <p
          className="type-body-sm"
          style={{ color: "var(--color-muted-soft)" }}
        >
          &copy; {new Date().getFullYear()} Careersence. AI-powered career guidance.
        </p>
      </div>
    </footer>
  );
}
