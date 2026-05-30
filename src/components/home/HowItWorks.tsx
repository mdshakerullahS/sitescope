const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Enter any URL",
    desc: "Paste a full URL or just a domain — SiteScope normalises it automatically.",
    icon: "🔗",
  },
  {
    step: "02",
    title: "Puppeteer scans the page",
    desc: "A real headless Chrome visits your site, takes a screenshot, and extracts 35+ data points from the DOM.",
    icon: "🕷️",
  },
  {
    step: "03",
    title: "Lighthouse runs a full audit",
    desc: "Google's own Lighthouse engine measures performance, accessibility, SEO, and best practices against real metrics.",
    icon: "🏠",
  },
  {
    step: "04",
    title: "Custom rules fire",
    desc: "30+ hand-written rules check UX patterns and conversion blockers that Lighthouse doesn't cover.",
    icon: "⚙️",
  },
  {
    step: "05",
    title: "Download your report",
    desc: "Get a polished PDF, a CSV spreadsheet of every issue, or raw JSON — whatever fits your workflow.",
    icon: "📄",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-24 px-6 bg-slate-900/30 border-y border-slate-800/40"
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">
            Under the hood
          </p>
          <h2 className="text-4xl font-extrabold tracking-tighter mb-4">
            How SiteScope works
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Not a simulated audit — a real browser, real metrics, real issues.
          </p>
        </div>

        <div className="relative">
          {/* Vertical connector line */}
          <div className="absolute left-8 top-10 bottom-10 w-px bg-linear-to-b from-blue-500/40 via-violet-500/40 to-emerald-500/40 hidden md:block" />

          <div className="space-y-6">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.step} className="relative flex gap-6 items-start">
                {/* Step number circle */}
                <div className="shrink-0 w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center z-10">
                  <span className="text-xl">{step.icon}</span>
                  <span className="text-[10px] font-mono text-slate-600 mt-0.5">
                    {step.step}
                  </span>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex-1">
                  <h3 className="font-bold text-white mb-1">{step.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
