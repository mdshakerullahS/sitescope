const FEATURES = [
  {
    icon: "⚡",
    title: "Core Web Vitals",
    desc: "Real Lighthouse scores: LCP, FCP, TBT, CLS, TTI, and Speed Index — the exact signals Google uses to rank your site.",
    color: "from-blue-500/20 to-blue-500/5",
    border: "border-blue-500/20",
  },
  {
    icon: "🔍",
    title: "Deep SEO Audit",
    desc: "Title tags, meta descriptions, H1 structure, canonical URLs, robots.txt, sitemaps, structured data, and Open Graph — all checked.",
    color: "from-violet-500/20 to-violet-500/5",
    border: "border-violet-500/20",
  },
  {
    icon: "♿",
    title: "Accessibility",
    desc: "WCAG 2.1 AA checks: form labels, viewport meta, keyboard navigation signals, font sizing, and Lighthouse a11y scoring.",
    color: "from-emerald-500/20 to-emerald-500/5",
    border: "border-emerald-500/20",
  },
  {
    icon: "🔒",
    title: "Security Headers",
    desc: "Scans for HTTPS, CSP, X-Frame-Options, HSTS, X-Content-Type-Options, Referrer-Policy, and console errors in one pass.",
    color: "from-red-500/20 to-red-500/5",
    border: "border-red-500/20",
  },
  {
    icon: "✨",
    title: "UX Analysis",
    desc: "Detects intrusive popups, cookie banners, unresponsive layouts, and font-size issues that quietly kill user satisfaction.",
    color: "from-amber-500/20 to-amber-500/5",
    border: "border-amber-500/20",
  },
  {
    icon: "🎯",
    title: "Conversion Audit",
    desc: "Finds missing CTAs, lack of social proof, poor form labelling, and absent video content — the real reasons visitors don't convert.",
    color: "from-pink-500/20 to-pink-500/5",
    border: "border-pink-500/20",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">
            What we audit
          </p>
          <h2 className="text-4xl font-extrabold tracking-tighter mb-4">
            Six categories. One report.
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Every audit covers the dimensions that actually move the needle on
            rankings, revenue, and user trust.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className={`bg-linear-to-b ${f.color} border ${f.border} rounded-2xl p-6 space-y-3`}
            >
              <span className="text-3xl">{f.icon}</span>
              <h3 className="text-base font-bold text-white">{f.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
