"use client";
import { useState, useRef, useEffect } from "react";
import { AnalysisResult } from "@/types";
import { downloadJSON, downloadCSV } from "@/lib/download-utils";

interface DownloadMenuProps {
  result: AnalysisResult;
}

type Format = "pdf" | "json" | "csv";

const OPTIONS: { format: Format; icon: string; label: string; desc: string }[] =
  [
    {
      format: "pdf",
      icon: "📄",
      label: "PDF Report",
      desc: "Full styled report with charts",
    },
    {
      format: "csv",
      icon: "📊",
      label: "CSV Issues",
      desc: "Spreadsheet of all issues",
    },
    {
      format: "json",
      icon: "🗂️",
      label: "JSON Data",
      desc: "Raw machine-readable data",
    },
  ];

export default function DownloadMenu({ result }: DownloadMenuProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<Format | null>(null);
  const [done, setDone] = useState<Format | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleDownload = async (format: Format) => {
    setLoading(format);
    setDone(null);
    try {
      if (format === "json") {
        downloadJSON(result);
      } else if (format === "csv") {
        downloadCSV(result);
      } else {
        // PDF — lazy-load to avoid SSR issues with jsPDF
        const { generatePDF } = await import("@/lib/pdf-generator");
        await generatePDF(result);
      }
      setDone(format);
      setTimeout(() => setDone(null), 2000);
    } catch (err) {
      console.error("Download error:", err);
    } finally {
      setLoading(null);
      setOpen(false);
    }
  };

  return (
    <div className="relative" ref={ref}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700
          text-sm font-semibold text-slate-200 hover:bg-slate-700 hover:border-slate-600
          transition-all active:scale-95"
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-slate-500 border-t-blue-400 rounded-full animate-spin" />
        ) : done ? (
          <span className="text-emerald-400">✓</span>
        ) : (
          <span>⬇</span>
        )}
        Download Report
        <span className="text-slate-500 text-xs">▼</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-64 bg-slate-900 border border-slate-700
          rounded-2xl shadow-2xl shadow-black/60 z-50 overflow-hidden
          animate-in fade-in slide-in-from-top-2 duration-150"
        >
          <div className="px-4 py-3 border-b border-slate-800">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Export format
            </p>
          </div>
          {OPTIONS.map(({ format, icon, label, desc }) => (
            <button
              key={format}
              onClick={() => handleDownload(format)}
              disabled={!!loading}
              className="w-full flex items-center gap-3 px-4 py-3 text-left
                hover:bg-slate-800 transition-colors disabled:opacity-50 group"
            >
              <span className="text-xl w-8 text-center shrink-0">{icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
                  {label}
                </p>
                <p className="text-xs text-slate-500">{desc}</p>
              </div>
              {loading === format && (
                <span className="w-4 h-4 border-2 border-slate-600 border-t-blue-400 rounded-full animate-spin shrink-0" />
              )}
              {done === format && (
                <span className="text-emerald-400 text-sm shrink-0">✓</span>
              )}
            </button>
          ))}
          <div className="px-4 py-2 border-t border-slate-800 bg-slate-900/50">
            <p className="text-[10px] text-slate-600">
              Report includes scores, all {result.issues.length} issues, and
              Core Web Vitals
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
