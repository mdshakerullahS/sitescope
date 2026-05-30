"use client";

import { useState } from "react";

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`border rounded-xl overflow-hidden transition-all duration-200 ${open ? "border-blue-500/30 bg-blue-500/5" : "border-slate-800 bg-slate-900/40"}`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left gap-4"
      >
        <span className="text-sm font-semibold text-slate-200">{q}</span>
        <span
          className={`text-slate-500 shrink-0 text-lg transition-transform duration-200 ${open ? "rotate-45" : ""}`}
        >
          +
        </span>
      </button>
      {open && (
        <div className="px-5 pb-5">
          <p className="text-sm text-slate-400 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

const FAQS = [
  {
    q: "Is SiteScope free to use?",
    a: "Yes — self-hosted and fully open source. Run it on your own server at zero cost.",
  },
  {
    q: "Does it work on password-protected or staging sites?",
    a: "Puppeteer can navigate any URL accessible from your server. For staging sites behind a VPN, run SiteScope on a machine inside your network.",
  },
  {
    q: "How is this different from Google PageSpeed Insights?",
    a: "SiteScope runs the same Lighthouse engine as PageSpeed Insights, but adds 30+ custom rules covering UX, conversion, and security headers — plus a screenshot, exportable reports, and a browser pool for concurrent requests.",
  },
  {
    q: "Can it handle multiple requests at once?",
    a: "Yes — a configurable browser pool (default: 3) handles concurrent Puppeteer scans, and a Lighthouse queue serialises audits to prevent Chrome port conflicts. Tune BROWSER_POOL_SIZE and LIGHTHOUSE_CONCURRENCY in .env.local.",
  },
  {
    q: "What does the PDF export include?",
    a: "A multi-page PDF with a cover page, overall and category scores, Core Web Vitals dashboard, every issue grouped by category with its description and fix, and a full-size screenshot of the scanned page.",
  },
];

export default function Faq() {
  return (
    <section
      id="faq"
      className="py-24 px-6 bg-slate-900/30 border-t border-slate-800/40"
    >
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-3">
            Frequently asked questions
          </p>
          <h2 className="text-4xl font-extrabold tracking-tighter">
            Common questions
          </h2>
        </div>
        <div className="space-y-3">
          {FAQS.map((f) => (
            <FaqItem key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
      </div>
    </section>
  );
}
