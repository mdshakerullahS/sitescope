"use client";

import { QueueStatus } from "@/app/page";
import Link from "next/link";
import { useState } from "react";
import AnalyzerLink from "../AnalyzerLink";
import Logo from "../Logo";

interface HeaderProps {
  scrolled: boolean;
  loading: boolean;
  queueStatus: QueueStatus | null;
}

export default function Header({
  scrolled,
  loading,
  queueStatus,
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  return (
    <div className="relative">
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || mobileOpen
            ? "bg-[#050d1a]/95 backdrop-blur-md border-b border-slate-800/60 py-3"
            : "py-5"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Logo Brand Block */}
          <Link
            href="/"
            className="flex items-center gap-3 shrink-0"
            onClick={() => setMobileOpen(false)}
          >
            <Logo />
          </Link>

          {/* Center/Right Dynamic Layout Segments */}
          <div className="flex-1 flex items-center justify-end">
            {/* Live Pool Indicator in Nav */}
            {loading && queueStatus ? (
              <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-4 text-[11px] sm:text-xs font-mono text-right">
                <span className="text-slate-500 whitespace-nowrap">
                  Browsers:{" "}
                  <span
                    className={
                      queueStatus.browserPool.free > 0
                        ? "text-emerald-400"
                        : "text-amber-400"
                    }
                  >
                    {queueStatus.browserPool.busy}/
                    {queueStatus.browserPool.total} busy
                  </span>
                </span>
                {queueStatus.lighthouseQueue.queued > 0 && (
                  <span className="text-amber-400 whitespace-nowrap">
                    LH queue: {queueStatus.lighthouseQueue.queued}
                  </span>
                )}
              </div>
            ) : (
              <>
                {/* Desktop View Menu Links */}
                <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
                  <Link
                    href="/docs"
                    className="hover:text-slate-300 transition-colors"
                  >
                    Docs
                  </Link>
                  <div className="w-px h-4 bg-slate-700 -mx-3" />
                  <nav className="flex items-center gap-6">
                    {["Features", "How it works", "Exports", "FAQ"].map((i) => (
                      <Link
                        key={i}
                        href={`#${i.toLowerCase().replaceAll(" ", "-")}`}
                        className="hover:text-slate-300 transition-colors"
                      >
                        {i}
                      </Link>
                    ))}
                  </nav>
                  <AnalyzerLink className="px-4 py-2 sm:py-2 active:scale-95">
                    Try it free →
                  </AnalyzerLink>
                </div>

                {/* Mobile Menu Interactive Trigger Icon */}
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  aria-label="Toggle navigation menu"
                  className="flex flex-col items-center justify-center gap-1.5 md:hidden w-8 h-8 rounded-lg border border-slate-800 bg-slate-900/50 hover:bg-slate-800/50 transition-colors"
                >
                  <span
                    className={`w-5 h-0.5 bg-slate-200 transition-all duration-300 ${
                      mobileOpen ? "rotate-45 translate-y-2" : ""
                    }`}
                  />
                  <span
                    className={`w-5 h-0.5 bg-slate-200 transition-all duration-300 ${
                      mobileOpen ? "opacity-0" : "opacity-100"
                    }`}
                  />
                  <span
                    className={`w-5 h-0.5 bg-slate-200 transition-all duration-300 ${
                      mobileOpen ? "-rotate-45 -translate-y-2" : ""
                    }`}
                  />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Dropdown Panel */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            mobileOpen && !(loading && queueStatus)
              ? "opacity-100 border-t border-slate-800/40 mt-3 px-6 py-4 bg-[#050d1a]"
              : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex flex-col gap-4 text-sm text-slate-400 mb-5">
            <Link
              href="/docs"
              className="hover:text-slate-300 transition-colors"
            >
              Docs
            </Link>

            <div className="w-full h-px bg-slate-700" />

            <nav className="flex flex-col gap-4">
              {["Features", "How it works", "Exports", "FAQ"].map((i) => (
                <Link
                  key={i}
                  href={`#${i.toLowerCase().replaceAll(" ", "-")}`}
                  onClick={() => setMobileOpen(false)}
                  className="hover:text-slate-300 transition-colors py-1"
                >
                  {i}
                </Link>
              ))}
            </nav>
          </div>

          <AnalyzerLink className="px-4 py-2 sm:py-2 active:scale-95">
            Try it free →
          </AnalyzerLink>
        </div>
      </header>

      <div className={`transition-all ${scrolled ? "h-14.25" : "h-18"}`} />
      <div
        onClick={() => setMobileOpen(false)}
        className={`${mobileOpen ? "block" : "hidden"} fixed inset-0 z-10 h-screen w-full bg-[#050d1a]/20 backdrop-blur-xs transition-all duration-300`}
      />
    </div>
  );
}
