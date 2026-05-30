"use client";
import { useState } from "react";
import { Issue } from "@/types";

const SEVERITY_STYLES = {
  critical: {
    dot: "bg-red-500 shadow-[0_0_8px_#ef4444]",
    badge: "bg-red-500/10 text-red-400 border-red-500/30",
    border: "border-red-500/20",
    bg: "bg-red-500/5",
    bar: "bg-red-500",
    label: "Critical",
  },
  warning: {
    dot: "bg-amber-400 shadow-[0_0_8px_#f59e0b]",
    badge: "bg-amber-400/10 text-amber-400 border-amber-400/30",
    border: "border-amber-400/20",
    bg: "bg-amber-400/5",
    bar: "bg-amber-400",
    label: "Warning",
  },
  info: {
    dot: "bg-blue-400 shadow-[0_0_8px_#60a5fa]",
    badge: "bg-blue-400/10 text-blue-400 border-blue-400/30",
    border: "border-blue-400/20",
    bg: "bg-blue-400/5",
    bar: "bg-blue-400",
    label: "Info",
  },
};

const CATEGORY_ICONS: Record<string, string> = {
  Performance: "⚡",
  SEO: "🔍",
  Accessibility: "♿",
  Security: "🔒",
  UX: "✨",
  Conversion: "🎯",
};

export default function IssueCard({
  issue,
  index,
}: {
  issue: Issue;
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const s = SEVERITY_STYLES[issue.severity];

  return (
    <div
      className={`rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden
        ${open ? `${s.border} ${s.bg}` : "border-slate-800 bg-slate-900/60 hover:border-slate-700"}`}
      style={{ animationDelay: `${index * 0.05}s` }}
      onClick={() => setOpen(!open)}
    >
      {/* Left severity bar */}
      <div className="flex">
        <div className={`w-1 shrink-0 ${s.bar} rounded-l-xl`} />
        <div className="flex-1 p-4">
          {/* Header row */}
          <div className="flex items-center gap-3">
            <span className={`w-2 h-2 rounded-full shrink-0 ${s.dot}`} />
            <span className="text-xs text-slate-500 shrink-0">
              {CATEGORY_ICONS[issue.category]} {issue.category}
            </span>
            <span className="flex-1 text-sm font-medium text-slate-200 leading-snug">
              {issue.title}
            </span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold tracking-wide shrink-0 ${s.badge}`}
            >
              {s.label}
            </span>
            <span className="text-slate-600 text-xs ml-1 shrink-0">
              {open ? "▲" : "▼"}
            </span>
          </div>

          {/* Expanded content */}
          {open && (
            <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
              <p className="text-sm text-slate-400 leading-relaxed">
                {issue.description}
              </p>
              <div className="rounded-lg bg-slate-950 border border-slate-800 p-3 space-y-1">
                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                  → Recommended Fix
                </p>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {issue.fix}
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mt-0.5">
                  Impact
                </span>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {issue.impact}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
