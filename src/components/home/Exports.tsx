import Link from "next/link";

const EXPORT_FORMATS = [
  {
    icon: "📄",
    label: "PDF",
    desc: "Multi-page styled report with score rings, Core Web Vitals, and every issue with its fix.",
    tag: "Client-ready",
    tagColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  {
    icon: "📊",
    label: "CSV",
    desc: "All issues in a spreadsheet — category, severity, title, description, fix, and impact.",
    tag: "For spreadsheets",
    tagColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  {
    icon: "🗂️",
    label: "JSON",
    desc: "Complete machine-readable dump of every metric, score, and issue for integrating into your own tools.",
    tag: "Developer-friendly",
    tagColor: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  },
];

export default function Exports() {
  return (
    <section id="exports" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-3">
            Report downloads
          </p>
          <h2 className="text-4xl font-extrabold tracking-tighter mb-4">
            Share it your way
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Every analysis can be exported in three formats — pick what fits
            your workflow.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {EXPORT_FORMATS.map((f) => (
            <div
              key={f.label}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-4xl">{f.icon}</span>
                <span
                  className={`text-[10px] px-2 py-1 rounded-full border font-semibold tracking-wide ${f.tagColor}`}
                >
                  {f.tag}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {f.label} Export
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* PDF preview card */}
        <div className="mt-10 bg-linear-to-r from-slate-900 to-slate-900/60 border border-slate-800 rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="shrink-0 w-32 h-44 bg-[#0d1724] border border-slate-700 rounded-xl flex flex-col overflow-hidden shadow-2xl">
            {/* Mini PDF preview */}
            <div className="bg-slate-800 px-2 py-1.5 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded bg-blue-500" />
              <span className="text-[7px] font-bold text-slate-300">
                SiteScope
              </span>
            </div>
            <div className="flex-1 p-2 space-y-1.5">
              <div className="h-1.5 bg-slate-700 rounded w-3/4" />
              <div className="h-1 bg-slate-800 rounded w-1/2" />
              <div className="grid grid-cols-3 gap-1 mt-2">
                {[78, 65, 90].map((s) => (
                  <div key={s} className="bg-slate-800 rounded p-1 text-center">
                    <div
                      className="text-[8px] font-bold"
                      style={{
                        color:
                          s >= 80 ? "#22d3a0" : s >= 60 ? "#f59e0b" : "#ef4444",
                      }}
                    >
                      {s}
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-1 mt-1">
                {[0, 1, 2].map((_, i) => (
                  <div
                    key={i}
                    className="h-1 bg-slate-800 rounded"
                    style={{ width: `${70 + i * 10}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <h3 className="text-xl font-bold text-white">
              PDF report included with every analysis
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              The PDF export is a print-ready multi-page report: cover page with
              your overall score, category breakdowns, Core Web Vitals
              dashboard, all issues grouped by category with their fixes, and a
              full-page screenshot of the site. Perfect for sharing with clients
              or stakeholders.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium"
            >
              Run a free analysis → <span>↗</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
