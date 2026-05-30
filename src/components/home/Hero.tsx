"use client";

import { useAppContext } from "@/contexts/AppContext";
import UrlBar from "./UrlBar";

export default function Hero() {
  const { url, setUrl, setLoading, setProgress, setProgressLabel } =
    useAppContext();
  return (
    <section className="relative pt-8 pb-28 px-6 text-center overflow-hidden">
      {/* Background glow blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-175 h-100 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute top-40 left-1/4 w-75 h-75 bg-violet-600/8 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-75 h-75 bg-emerald-600/8 rounded-full blur-3xl" />
        {/* Grid lines */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.03]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="white"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div id="analyzer" className="relative max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono tracking-widest uppercase mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          Results in ~60 seconds
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter leading-[1.05] mb-6">
          Find out exactly
          <br />
          <span className="bg-linear-to-r from-blue-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">
            what&apos;s wrong
          </span>{" "}
          with
          <br />
          your website.
        </h1>

        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
          SiteScope runs a real browser against your site and surfaces issues
          across performance, SEO, accessibility, security, UX, and conversion —
          with specific fixes, not vague advice.
        </p>

        <div className="space-y-6">
          {/* Inline URL bar */}
          <UrlBar
            url={url}
            setUrl={setUrl}
            setLoading={setLoading}
            setProgress={setProgress}
            setProgressLabel={setProgressLabel}
          />

          <div className="flex flex-wrap justify-center gap-2 text-xs text-slate-500">
            {[
              "⚡ Core Web Vitals",
              "🔍 SEO Audit",
              "♿ Accessibility",
              "🔒 Security Headers",
              "✨ UX Analysis",
              "🎯 Conversion Audit",
            ].map((f) => (
              <span
                key={f}
                className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
