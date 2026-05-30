"use client";

import AnalyzerLink from "@/components/AnalyzerLink";
import Exports from "@/components/home/Exports";
import Faq from "@/components/home/Faq";
import Features from "@/components/home/Features";
import Header from "@/components/home/Header";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import StatsBar from "@/components/home/StatsBar";
import { useAppContext } from "@/contexts/AppContext";
import { useState, useEffect, useRef } from "react";

export interface QueueStatus {
  browserPool: { total: number; busy: number; free: number; queued: number };
  lighthouseQueue: { running: number; queued: number };
}

export default function Page() {
  const [scrolled, setScrolled] = useState(false);

  const { url, loading, progress, progressLabel } = useAppContext();

  const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);
  const [isQueued, setIsQueued] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    if (loading) {
      const poll = async () => {
        try {
          const res = await fetch("/api/status");
          if (res.ok) {
            const data: QueueStatus = await res.json();
            setQueueStatus(data);
            setIsQueued(
              data.browserPool.free === 0 && data.browserPool.queued > 0,
            );
          }
        } catch {}
      };
      poll();
      pollRef.current = setInterval(poll, 2000);
    } else {
      if (pollRef.current) clearInterval(pollRef.current);
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [loading]);

  return (
    <div className="min-h-screen bg-[#050d1a] text-white overflow-x-hidden">
      {/* ── Header ───────────────────────────────────────────── */}
      <Header scrolled={scrolled} loading={loading} queueStatus={queueStatus} />

      <main className="flex-1 flex flex-col justify-center sm:px-4">
        {!loading ? (
          <>
            {/* ── Hero ─────────────────────────────────────────────────── */}
            <Hero />

            {/* ── Stats bar ────────────────────────────────────────────── */}
            <StatsBar />

            {/* ── Features ─────────────────────────────────────────────── */}
            <Features />

            {/* ── How it works ─────────────────────────────────────────── */}
            <HowItWorks />

            {/* ── Export formats ───────────────────────────────────────── */}
            <Exports />

            {/* ── FAQ ──────────────────────────────────────────────────── */}
            <Faq />

            {/* ── CTA ──────────────────────────────────────────────────── */}
            <section className="py-24 px-6">
              <div className="max-w-2xl mx-auto text-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-linear-to-r from-blue-600/15 via-violet-600/15 to-emerald-600/15 rounded-3xl blur-2xl" />
                  <div className="relative bg-slate-900/80 border border-slate-800 rounded-3xl p-12 space-y-6">
                    <h2 className="text-4xl font-extrabold tracking-tighter">
                      Ready to fix your site?
                    </h2>
                    <p className="text-slate-400 leading-relaxed">
                      Paste any URL and get a full report in about 60 seconds.
                      No account required.
                    </p>

                    <AnalyzerLink className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-blue-600 text-white font-medium transition-all duration-200 hover:bg-blue-500 shadow-lg shadow-blue-500/20 active:scale-95">
                      Analyze your website for free →
                    </AnalyzerLink>
                    <p className="text-xs text-slate-600">
                      Free to use · No sign-up needed
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : (
          <div className="w-full max-w-md mx-auto px-4 py-24 md:p-0 space-y-8 text-center">
            <div className="space-y-2">
              {isQueued ? (
                <>
                  <div className="text-4xl font-extrabold tracking-tighter text-amber-400">
                    Queued…
                  </div>
                  <p className="text-slate-400 text-sm">
                    All browsers are busy. Your request is in line.
                  </p>
                  {queueStatus && (
                    <p className="text-amber-400 font-mono text-xs">
                      Position: #{queueStatus.browserPool.queued} in queue
                    </p>
                  )}
                </>
              ) : (
                <>
                  <div className="text-4xl font-extrabold tracking-tighter">
                    Analyzing…
                  </div>
                  <p className="text-slate-400 font-mono text-sm truncate">
                    {url}
                  </p>
                </>
              )}
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${isQueued ? "bg-amber-400" : "bg-linear-to-r from-blue-500 to-emerald-400"}`}
                  style={{
                    width: isQueued ? "100%" : `${progress}%`,
                    animation: isQueued
                      ? "pulse 1.5s ease-in-out infinite"
                      : "none",
                  }}
                />
              </div>
              {!isQueued && (
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-blue-400 animate-pulse">
                    {progressLabel}
                  </span>
                  <span className="text-slate-600">{progress}%</span>
                </div>
              )}
            </div>

            {/* Bouncing dots */}
            <div className="flex justify-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${isQueued ? "bg-amber-400" : "bg-blue-500"}`}
                  style={{
                    animation: `bounce 1.2s ${i * 0.2}s ease-in-out infinite`,
                  }}
                />
              ))}
            </div>

            {/* Step checklist */}
            {!isQueued && (
              <div className="grid grid-cols-2 gap-2 text-left">
                {[
                  "Puppeteer scan",
                  "Lighthouse audit",
                  "Custom UX rules",
                  "Conversion analysis",
                ].map((step, i) => (
                  <div
                    key={step}
                    className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg border
                          ${
                            progress > (i + 1) * 20
                              ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-400"
                              : "border-slate-800 bg-slate-900 text-slate-600"
                          }`}
                  >
                    <span>{progress > (i + 1) * 20 ? "✓" : "○"}</span>
                    {step}
                  </div>
                ))}
              </div>
            )}

            {/* Live pool stats */}
            {queueStatus && (
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-2">
                  <div className="text-xs text-slate-600 mb-0.5">Browsers</div>
                  <div className="text-sm font-mono font-bold text-slate-300">
                    {queueStatus.browserPool.busy}/
                    {queueStatus.browserPool.total}
                  </div>
                  <div className="text-[10px] text-slate-600">busy</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-2">
                  <div className="text-xs text-slate-600 mb-0.5">LH Queue</div>
                  <div
                    className={`text-sm font-mono font-bold ${queueStatus.lighthouseQueue.queued > 0 ? "text-amber-400" : "text-slate-300"}`}
                  >
                    {queueStatus.lighthouseQueue.queued}
                  </div>
                  <div className="text-[10px] text-slate-600">waiting</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-2">
                  <div className="text-xs text-slate-600 mb-0.5">Browser Q</div>
                  <div
                    className={`text-sm font-mono font-bold ${queueStatus.browserPool.queued > 0 ? "text-amber-400" : "text-slate-300"}`}
                  >
                    {queueStatus.browserPool.queued}
                  </div>
                  <div className="text-[10px] text-slate-600">waiting</div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
