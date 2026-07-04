"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChatBot } from "@/components/ui/ChatBot";

export function RootShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Admin routes have their own full-screen layout
  if (pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "var(--color-canvas)",
      }}
    >
      <Header />
      {/* pt-14 pushes content below the fixed 56px transparent header */}
      <main
        id="main-content"
        style={{ flex: 1, paddingTop: "56px" }}
      >
        {children}
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
}
