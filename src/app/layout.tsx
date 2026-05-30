import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { AppProvider } from "@/contexts/AppContext";

export const metadata: Metadata = {
  title: "SiteScope — Website Analyzer",
  description:
    "Full website audit: performance, SEO, accessibility, security, UX, and conversion.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <AppProvider>{children}</AppProvider>

        {/* ── Footer ───────────────────────────────────────────────── */}
        <footer className="border-t border-slate-800/60 py-8 px-6">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-linear-to-br from-blue-500 to-emerald-400 flex items-center justify-center text-xs font-bold text-white">
                S
              </div>
              <span className="font-semibold text-slate-400">SiteScope</span>
              <span>— Open-source website analyzer</span>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-5">
              <div className="flex items-center gap-5">
                {["Features", "How it works", "Exports", "FAQ"].map((i) => (
                  <Link
                    key={i}
                    href={`/#${i.toLowerCase().replaceAll(" ", "-")}`}
                    className="hover:text-slate-300 transition-colors"
                  >
                    {i}
                  </Link>
                ))}
              </div>

              <div className="flex items-center gap-5">
                <div className="w-px h-4 bg-slate-700 hidden md:block" />
                <Link
                  href="/docs"
                  className="hover:text-slate-300 transition-colors"
                >
                  Docs
                </Link>

                <div className="w-px h-4 bg-slate-700 hidden md:block" />

                <Link
                  href="/#analyzer"
                  className="hover:text-slate-300 transition-colors"
                >
                  Analyzer
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
