"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnalysisResult, Issue } from "@/types";
import ScoreRing from "@/components/report/ScoreRing";
import IssueCard from "@/components/report/IssueCard";
import MetricCard from "@/components/report/MetricCard";
import DownloadMenu from "@/components/report/DownloadMenu";
import Image from "next/image";
import Logo from "@/components/Logo";

const CATEGORIES = [
  "All",
  "Performance",
  "SEO",
  "Accessibility",
  "Security",
  "UX",
  "Conversion",
] as const;
type Category = (typeof CATEGORIES)[number];

const SCORE_KEYS: {
  key: keyof AnalysisResult["scores"];
  label: string;
  icon: string;
}[] = [
  { key: "performance", label: "Performance", icon: "⚡" },
  { key: "seo", label: "SEO", icon: "🔍" },
  { key: "accessibility", label: "Accessibility", icon: "♿" },
  { key: "security", label: "Security", icon: "🔒" },
  { key: "ux", label: "UX", icon: "✨" },
  { key: "conversion", label: "Conversion", icon: "🎯" },
];

function formatMs(ms: number) {
  return ms > 1000 ? `${(ms / 1000).toFixed(1)}s` : `${Math.round(ms)}ms`;
}
function lcpStatus(ms: number): "good" | "needs-improvement" | "poor" {
  return ms < 2500 ? "good" : ms < 4000 ? "needs-improvement" : "poor";
}
function fcpStatus(ms: number): "good" | "needs-improvement" | "poor" {
  return ms < 1800 ? "good" : ms < 3000 ? "needs-improvement" : "poor";
}
function tbtStatus(ms: number): "good" | "needs-improvement" | "poor" {
  return ms < 200 ? "good" : ms < 600 ? "needs-improvement" : "poor";
}
function clsStatus(v: number): "good" | "needs-improvement" | "poor" {
  return v < 0.1 ? "good" : v < 0.25 ? "needs-improvement" : "poor";
}

export default function Page() {
  const [activeTab, setActiveTab] = useState<Category>("All");
  const [showPuppeteer, setShowPuppeteer] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const router = useRouter();

  useEffect(() => {
    function initializeReport() {
      const raw = sessionStorage.getItem("analysisResult");
      if (!raw) {
        router.push("/");
        return;
      }
      try {
        setResult(JSON.parse(raw));
      } catch {
        router.push("/");
      }
    }
    initializeReport();
  }, [router]);

  if (!result) {
    return (
      <div className="min-h-screen bg-[#050d1a] flex items-center justify-center">
        <div className="text-slate-400 font-mono">Loading report…</div>
      </div>
    );
  }

  const filteredIssues: Issue[] =
    activeTab === "All"
      ? result.issues
      : result.issues.filter((i) => i.category === activeTab);

  const criticalCount = result.issues.filter(
    (i) => i.severity === "critical",
  ).length;
  const warningCount = result.issues.filter(
    (i) => i.severity === "warning",
  ).length;
  const infoCount = result.issues.filter((i) => i.severity === "info").length;
  const lh = result.lighthouse;

  return (
    <div className="min-h-screen bg-[#050d1a] text-white">
      {/* ── Nav ─────────────────────────────────────────────────── */}
      <nav className="border-b border-slate-800/60 px-6 py-4 flex items-center gap-3 sticky top-0 z-20 bg-[#050d1a]/95 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
        </Link>
        <div className="w-px h-4 bg-slate-700 mx-1" />
        <span className="text-sm text-slate-400">Report</span>
        <div className="flex-1" />
        <Link
          href="/"
          className="text-sm text-slate-400 hover:text-white transition-colors"
        >
          ← Back to Home
        </Link>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
        {/* ── Hero: score + summary ──────────────────────────────── */}
        <div className="grid md:grid-cols-[auto_1fr] gap-6 items-start">
          <div className="flex flex-col items-center gap-4">
            {result.screenshot ? (
              <div className="w-64 rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
                <Image
                  src={result.screenshot}
                  width={512}
                  height={360}
                  alt="Site screenshot"
                  className="w-full block"
                />
              </div>
            ) : (
              <div className="w-64 h-40 rounded-xl border border-slate-800 bg-slate-900 flex items-center justify-center text-slate-600 text-sm">
                No screenshot
              </div>
            )}
            <ScoreRing
              score={result.scores.overall}
              size={110}
              label="Overall Score"
            />
          </div>

          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight mb-1 truncate">
                {result.url}
              </h1>
              <p className="text-slate-400 leading-relaxed text-sm">
                {result.summary}
              </p>
            </div>

            <div className="flex gap-3 flex-wrap">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                {criticalCount} Critical
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                {warningCount} Warnings
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-400/10 border border-blue-400/20 text-blue-400 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                {infoCount} Info
              </span>
            </div>

            {result.topWins.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
                <p className="text-xs font-bold text-red-400 uppercase tracking-widest">
                  🔥 Top Issues to Fix
                </p>
                <ul className="space-y-1">
                  {result.topWins.map((w, i) => (
                    <li
                      key={i}
                      className="text-sm text-slate-300 flex items-start gap-2"
                    >
                      <span className="text-red-400 mt-0.5 shrink-0">→</span>
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="md:hidden">
              <DownloadMenu result={result} />
            </div>
          </div>
        </div>

        {/* ── Category scores ────────────────────────────────────── */}
        <div>
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
            Category Scores
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {SCORE_KEYS.map(({ key, label, icon }) => (
              <div
                key={key}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col items-center gap-3"
              >
                <ScoreRing score={result.scores[key]} size={72} />
                <span className="text-xs text-slate-400 font-medium text-center">
                  {icon} {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Lighthouse / Core Web Vitals ───────────────────────── */}
        {lh && (
          <div>
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
              ⚡ Core Web Vitals & Lighthouse
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <MetricCard
                label="LCP"
                value={formatMs(lh.lcp)}
                status={lcpStatus(lh.lcp)}
                description="Largest Contentful Paint (target: <2.5s)"
              />
              <MetricCard
                label="FCP"
                value={formatMs(lh.fcp)}
                status={fcpStatus(lh.fcp)}
                description="First Contentful Paint (target: <1.8s)"
              />
              <MetricCard
                label="TBT"
                value={formatMs(lh.tbt)}
                status={tbtStatus(lh.tbt)}
                description="Total Blocking Time (target: <200ms)"
              />
              <MetricCard
                label="CLS"
                value={lh.cls.toFixed(3)}
                status={clsStatus(lh.cls)}
                description="Cumulative Layout Shift (target: <0.1)"
              />
              <MetricCard
                label="TTI"
                value={formatMs(lh.tti)}
                status={
                  lh.tti < 3800
                    ? "good"
                    : lh.tti < 7300
                      ? "needs-improvement"
                      : "poor"
                }
                description="Time to Interactive"
              />
              <MetricCard
                label="Speed Index"
                value={formatMs(lh.speedIndex)}
                status={
                  lh.speedIndex < 3400
                    ? "good"
                    : lh.speedIndex < 5800
                      ? "needs-improvement"
                      : "poor"
                }
                description="Visual display speed"
              />
              <MetricCard
                label="Performance"
                value={`${lh.performanceScore}/100`}
                status={
                  lh.performanceScore >= 90
                    ? "good"
                    : lh.performanceScore >= 50
                      ? "needs-improvement"
                      : "poor"
                }
                description="Lighthouse performance score"
              />
              <MetricCard
                label="Best Practices"
                value={`${lh.bestPracticesScore}/100`}
                status={
                  lh.bestPracticesScore >= 90
                    ? "good"
                    : lh.bestPracticesScore >= 50
                      ? "needs-improvement"
                      : "poor"
                }
                description="Lighthouse best practices"
              />
            </div>
          </div>
        )}

        {/* ── Issues ─────────────────────────────────────────────── */}
        <div>
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
            Issues & Recommendations{" "}
            <span className="text-slate-700 normal-case font-normal">
              ({result.issues.length} total)
            </span>
          </h2>

          <div className="flex gap-2 flex-wrap mb-5">
            {CATEGORIES.map((cat) => {
              const count =
                cat === "All"
                  ? result.issues.length
                  : result.issues.filter((i) => i.category === cat).length;
              if (count === 0 && cat !== "All") return null;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border
                    ${
                      activeTab === cat
                        ? "bg-blue-500/15 border-blue-500/40 text-blue-400"
                        : "bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700"
                    }`}
                >
                  {cat} <span className="opacity-60">({count})</span>
                </button>
              );
            })}
          </div>

          <div className="space-y-2">
            {filteredIssues.length === 0 ? (
              <div className="text-center py-12 text-slate-600 font-mono text-sm">
                No issues in this category.
              </div>
            ) : (
              filteredIssues.map((issue, i) => (
                <IssueCard key={issue.id} issue={issue} index={i} />
              ))
            )}
          </div>
        </div>

        {/* ── Raw data inspector ─────────────────────────────────── */}
        <div className="border border-slate-800 rounded-xl overflow-hidden">
          <button
            onClick={() => setShowPuppeteer(!showPuppeteer)}
            className="w-full px-5 py-4 flex items-center justify-between text-left bg-slate-900/50 hover:bg-slate-900 transition-colors"
          >
            <span className="text-sm font-semibold text-slate-300">
              🕷️ Raw Puppeteer Scan Data
            </span>
            <span className="text-slate-600 text-sm">
              {showPuppeteer ? "▲ Hide" : "▼ Show"}
            </span>
          </button>
          {showPuppeteer && (
            <div className="px-5 py-4 bg-slate-950 overflow-x-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 text-xs font-mono">
                {Object.entries(result.puppeteer)
                  .filter(([k]) => k !== "securityHeaders")
                  .map(([key, val]) => (
                    <div
                      key={key}
                      className="bg-slate-900 rounded-lg p-3 border border-slate-800"
                    >
                      <div className="text-slate-500 mb-1 truncate">{key}</div>
                      <div className="text-slate-200 truncate">
                        {typeof val === "boolean"
                          ? val
                            ? "✓ yes"
                            : "✗ no"
                          : Array.isArray(val)
                            ? `[${val.length} items]`
                            : String(val).slice(0, 60)}
                      </div>
                    </div>
                  ))}
                <div className="col-span-full bg-slate-900 rounded-lg p-3 border border-slate-800">
                  <div className="text-slate-500 mb-2">securityHeaders</div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {Object.entries(result.puppeteer.securityHeaders).map(
                      ([k, v]) => (
                        <div
                          key={k}
                          className={`text-xs px-2 py-1 rounded ${v ? "text-emerald-400" : "text-red-400"}`}
                        >
                          {v ? "✓" : "✗"} {k}
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Download CTA at bottom ─────────────────────────────── */}
        <div className="border border-slate-800 rounded-2xl p-6 bg-slate-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-slate-200 mb-1">Save this report</p>
            <p className="text-sm text-slate-500">
              Download as a PDF, CSV spreadsheet, or raw JSON for sharing or
              record-keeping.
            </p>
          </div>
          <DownloadMenu result={result} />
        </div>
      </div>
    </div>
  );
}
