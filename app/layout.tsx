import type { Metadata } from "next";
import { Saira_Condensed, Cormorant_Garamond, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { RootShell } from "@/components/layout/RootShell";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

// Bugatti Display substitute — Saira Condensed (display headlines, wordmark)
const sairaCondensed = Saira_Condensed({
  weight: ["400", "500"],
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

// Bugatti Text Regular substitute — Cormorant Garamond (body serif)
const cormorantGaramond = Cormorant_Garamond({
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

// Bugatti Monospace substitute — JetBrains Mono (buttons, captions, nav)
const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500"],
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Careersence — AI-Powered Career & Education Guidance",
  description:
    "Discover your path. Get personalized career recommendations, learning roadmaps, and job-search strategies powered by AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Permanently dark — Bugatti system has no light mode
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${sairaCondensed.variable} ${cormorantGaramond.variable} ${jetbrainsMono.variable} min-h-screen antialiased`}
        style={{ fontFamily: "var(--font-body)" }}
      >
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <SessionProvider>
          <ThemeProvider>
            <ToastProvider>
              <RootShell>{children}</RootShell>
            </ToastProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
