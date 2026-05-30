"use client";

import { useState, useRef, SetStateAction, Dispatch } from "react";
import { useRouter } from "next/navigation";

interface UrlBarProps {
  url: string;
  setUrl: Dispatch<SetStateAction<string>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setProgress: Dispatch<SetStateAction<number>>;
  setProgressLabel: Dispatch<SetStateAction<string>>;
}

const EXAMPLE_SITES = ["stripe.com", "airbnb.com", "notion.so", "vercel.com"];

const STEPS = [
  "Launching browser…",
  "Scanning page structure…",
  "Running Lighthouse audit…",
  "Analyzing performance metrics…",
  "Checking SEO signals…",
  "Auditing accessibility…",
  "Scanning security headers…",
  "Running UX & conversion rules…",
  "Compiling report…",
];

export default function UrlBar({
  url,
  setUrl,
  setLoading,
  setProgress,
  setProgressLabel,
}: UrlBarProps) {
  const [error, setError] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const analyze = async (targetUrl?: string) => {
    const raw = (targetUrl || url).trim();
    if (!raw) return;
    setLoading(true);
    setError("");
    setProgress(0);

    let stepIdx = 0;
    const stepInterval = setInterval(() => {
      stepIdx = Math.min(stepIdx + 1, STEPS.length - 1);
      setProgressLabel(STEPS[stepIdx]);
      setProgress(Math.round((stepIdx / STEPS.length) * 85));
    }, 6000);
    setProgressLabel(STEPS[0]);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: raw }),
      });

      clearInterval(stepInterval);
      setProgress(95);

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Analysis failed");
      }

      const result = await res.json();
      setLoading(false);
      setProgress(100);
      sessionStorage.setItem("analysisResult", JSON.stringify(result));
      setTimeout(() => router.push("/report"), 300);
    } catch (err: unknown) {
      clearInterval(stepInterval);
      setLoading(false);
      setProgress(0);
      setProgressLabel("");
      setError(
        err instanceof Error
          ? err.message
          : "Analysis failed. Please try again.",
      );
    }
  };

  return (
    <div className="space-y-4 w-full px-2 sm:px-0">
      <div className="max-w-3xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-1 bg-slate-900 border border-slate-700 rounded-2xl p-2 sm:pl-5 mx-auto focus-within:border-blue-500/60 transition-all">
        <div className="flex items-center gap-2 flex-1 px-3 sm:px-0">
          <span
            className="text-slate-500 text-base select-none shrink-0"
            aria-hidden="true"
          >
            🔗
          </span>
          <input
            ref={inputRef}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && analyze()}
            placeholder="Enter website URL (e.g. stripe.com)"
            className="w-full bg-transparent text-white placeholder-slate-600 font-mono text-sm outline-none py-3 sm:py-3.5 min-w-0"
          />
        </div>
        <button
          onClick={() => analyze()}
          disabled={!url.trim()}
          className="w-full sm:w-auto shrink-0 px-6 py-3.5 sm:py-3 rounded-xl bg-linear-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold disabled:opacity-40 sm:hover:from-blue-400 sm:hover:to-blue-500 transition-all active:scale-98 sm:active:scale-95"
        >
          Analyze →
        </button>
      </div>

      {error && (
        <p className="text-red-400 text-xs sm:text-sm text-center bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3 max-w-3xl mx-auto wrap-break-word">
          {error}
        </p>
      )}

      <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap max-w-prose mx-auto">
        <span className="text-slate-600 text-xs">Try:</span>
        {EXAMPLE_SITES.map((s) => (
          <button
            key={s}
            onClick={() => {
              setUrl(s);
              analyze(s);
            }}
            className="text-xs text-slate-400 hover:text-blue-400 transition-colors px-2 py-1 rounded-lg hover:bg-slate-800 active:bg-slate-800/60"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
