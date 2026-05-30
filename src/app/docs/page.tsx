"use client";

import AnalyzerLink from "@/components/AnalyzerLink";
import Logo from "@/components/Logo";
import Link from "next/link";
import { useState } from "react";

// ── Content ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    id: "performance",
    icon: "⚡",
    label: "Performance",
    color: "text-blue-400",
    border: "border-blue-500/20",
    bg: "bg-blue-500/5",
    engine: "Lighthouse",
    summary:
      "Measures how fast your page loads and becomes usable, using Google's Core Web Vitals as the benchmark.",
    howItWorks: [
      "Lighthouse launches a fresh Chrome session and loads your page under simulated conditions.",
      "It measures six timing metrics and produces a 0–100 score.",
      "SiteScope also records the raw page load time using Puppeteer's network timer.",
    ],
    metrics: [
      {
        name: "LCP — Largest Contentful Paint",
        good: "< 2.5s",
        poor: "> 4s",
        desc: "How long until the biggest visible element (hero image, headline) is painted.",
      },
      {
        name: "FCP — First Contentful Paint",
        good: "< 1.8s",
        poor: "> 3s",
        desc: "How long until any content first appears on screen.",
      },
      {
        name: "TBT — Total Blocking Time",
        good: "< 200ms",
        poor: "> 600ms",
        desc: "How long the browser main thread is blocked, preventing user input.",
      },
      {
        name: "CLS — Cumulative Layout Shift",
        good: "< 0.1",
        poor: "> 0.25",
        desc: "How much page elements unexpectedly jump around while loading.",
      },
      {
        name: "TTI — Time to Interactive",
        good: "< 3.8s",
        poor: "> 7.3s",
        desc: "How long until the page is fully interactive and responsive to clicks.",
      },
      {
        name: "Speed Index",
        good: "< 3.4s",
        poor: "> 5.8s",
        desc: "How quickly content is visually filled in from top to bottom.",
      },
    ],
    limitations: [
      "Lighthouse runs in a simulated environment — results may differ from real user experience, especially on fast connections or powerful devices.",
      "Scores can vary between runs (±5 points) due to CPU scheduling and network conditions on the server.",
      "Server-side rendering or pages behind authentication cannot be accurately measured.",
    ],
    tips: [
      "Compress and serve images in WebP or AVIF format.",
      "Set explicit width and height on all images to prevent layout shifts.",
      "Defer non-critical JavaScript and CSS.",
      "Use a CDN to reduce server response time.",
    ],
  },
  {
    id: "seo",
    icon: "🔍",
    label: "SEO",
    color: "text-violet-400",
    border: "border-violet-500/20",
    bg: "bg-violet-500/5",
    engine: "Puppeteer + Lighthouse",
    summary:
      "Checks the on-page signals search engines use to understand, index, and rank your content.",
    howItWorks: [
      "Puppeteer extracts DOM elements directly: <title>, <meta name='description'>, <h1> tags, canonical links, and structured data scripts.",
      "It also performs HTTP requests to /robots.txt and /sitemap.xml to check for their existence.",
      "Lighthouse contributes its own SEO score based on mobile-friendliness, crawlability, and meta tag completeness.",
    ],
    metrics: [
      {
        name: "Title tag",
        good: "50–60 chars",
        poor: "Missing or >60 chars",
        desc: "The single most important on-page SEO element.",
      },
      {
        name: "Meta description",
        good: "150–160 chars",
        poor: "Missing or >160 chars",
        desc: "Controls the snippet shown in search results.",
      },
      {
        name: "H1 heading",
        good: "Exactly 1",
        poor: "0 or more than 1",
        desc: "The primary topic signal for the page.",
      },
      {
        name: "Canonical tag",
        good: "Present",
        poor: "Missing",
        desc: "Prevents duplicate content issues.",
      },
      {
        name: "robots.txt",
        good: "Present",
        poor: "404",
        desc: "Guides crawlers and protects private pages.",
      },
      {
        name: "XML sitemap",
        good: "Present",
        poor: "404",
        desc: "Ensures all important pages are discovered.",
      },
      {
        name: "Structured data",
        good: "Present",
        poor: "Missing",
        desc: "Enables rich results in Google search.",
      },
      {
        name: "Open Graph tags",
        good: "Present",
        poor: "Missing",
        desc: "Controls appearance when shared on social media.",
      },
    ],
    limitations: [
      "SiteScope only checks the page you provide — it does not crawl the entire site or check internal linking structure across pages.",
      "Structured data is detected by presence, not validity. Malformed JSON-LD will pass this check.",
      "Dynamic content rendered after JavaScript execution may be partially missed if it loads after the networkidle2 timeout.",
    ],
    tips: [
      "Write unique title and meta description for every page.",
      "Use one H1 per page that includes your primary keyword.",
      "Add JSON-LD structured data appropriate to your content type (Article, Product, FAQ, etc.).",
      "Submit your sitemap to Google Search Console.",
    ],
  },
  {
    id: "accessibility",
    icon: "♿",
    label: "Accessibility",
    color: "text-emerald-400",
    border: "border-emerald-500/20",
    bg: "bg-emerald-500/5",
    engine: "Puppeteer + Lighthouse",
    summary:
      "Checks whether your site can be used by people with visual, motor, or cognitive disabilities.",
    howItWorks: [
      "Puppeteer checks structural accessibility signals: viewport meta tag, form label associations, and font size.",
      "Lighthouse runs the axe-core accessibility engine under the hood and returns a detailed score.",
      "Issues are graded by WCAG 2.1 AA compliance level.",
    ],
    metrics: [
      {
        name: "Viewport meta tag",
        good: "Present",
        poor: "Missing",
        desc: "Without it, mobile devices zoom out and text becomes unreadable.",
      },
      {
        name: "Form input labels",
        good: "All inputs labelled",
        poor: "Inputs without <label>",
        desc: "Screen readers read labels aloud so users know what to type.",
      },
      {
        name: "Image alt text",
        good: "All images have alt",
        poor: "Missing alt attributes",
        desc: "Describes images to screen reader users.",
      },
      {
        name: "Lighthouse a11y score",
        good: "≥ 90",
        poor: "< 70",
        desc: "Composite score from axe-core automated testing.",
      },
    ],
    limitations: [
      "Automated tools like axe-core can only catch ~30–40% of real accessibility issues. Manual testing with a screen reader is always needed for full compliance.",
      "Colour contrast is checked by Lighthouse, not Puppeteer — contrast issues on dynamic or overlay elements may be missed.",
      "Keyboard navigation and focus order cannot be reliably tested in a headless browser without interaction scripts.",
    ],
    tips: [
      "Associate every form input with a <label for='id'> or aria-label.",
      "Add descriptive alt text to all informative images; use alt='' for decorative ones.",
      "Ensure all interactive elements are reachable and operable via keyboard (Tab, Enter, Escape).",
      "Maintain a colour contrast ratio of at least 4.5:1 for normal text.",
    ],
  },
  {
    id: "security",
    icon: "🔒",
    label: "Security",
    color: "text-red-400",
    border: "border-red-500/20",
    bg: "bg-red-500/5",
    engine: "Puppeteer (HTTP headers)",
    summary:
      "Checks for HTTPS and the presence of HTTP security response headers that protect against common web attacks.",
    howItWorks: [
      "Puppeteer reads the HTTP response headers returned when loading your page.",
      "Six security headers are checked for presence (not for correctness of their values).",
      "Console errors are captured during page load to surface mixed-content and other security-related warnings.",
    ],
    metrics: [
      {
        name: "HTTPS",
        good: "https://",
        poor: "http://",
        desc: "Encrypts all data in transit between browser and server.",
      },
      {
        name: "Content-Security-Policy",
        good: "Present",
        poor: "Missing",
        desc: "Prevents XSS attacks by controlling which resources load.",
      },
      {
        name: "X-Frame-Options",
        good: "SAMEORIGIN or DENY",
        poor: "Missing",
        desc: "Prevents your page being embedded in malicious iframes (clickjacking).",
      },
      {
        name: "Strict-Transport-Security",
        good: "Present",
        poor: "Missing",
        desc: "Forces browsers to always use HTTPS for your domain.",
      },
      {
        name: "X-Content-Type-Options",
        good: "nosniff",
        poor: "Missing",
        desc: "Stops browsers from guessing file types (MIME sniffing attacks).",
      },
      {
        name: "Referrer-Policy",
        good: "Present",
        poor: "Missing",
        desc: "Controls how much URL information is shared when users click links.",
      },
    ],
    limitations: [
      "Headers are checked for presence only, not correctness. A CSP of 'default-src *' will pass this check even though it provides no real protection.",
      "SiteScope does not perform active penetration testing, port scanning, or vulnerability assessment.",
      "Headers set by JavaScript (after page load) are not captured — only headers in the initial HTTP response are checked.",
    ],
    tips: [
      "Start with a simple CSP: Content-Security-Policy: default-src 'self' and add exceptions as needed.",
      "Set Strict-Transport-Security with a long max-age (at least 31536000) and consider adding your domain to the HSTS preload list.",
      "Use security header checkers like securityheaders.com for a deeper policy analysis.",
    ],
  },
  {
    id: "ux",
    icon: "✨",
    label: "UX",
    color: "text-amber-400",
    border: "border-amber-500/20",
    bg: "bg-amber-500/5",
    engine: "Puppeteer (DOM + CSS)",
    summary:
      "Checks for UX patterns known to frustrate users or increase bounce rates.",
    howItWorks: [
      "Puppeteer scans the DOM for modals, cookie banners, and chat widgets using class name and role patterns.",
      "It checks the computed CSS font-size of the document body.",
      "Mobile responsiveness is inferred from the presence of a viewport meta tag.",
    ],
    metrics: [
      {
        name: "Mobile responsiveness",
        good: "Viewport meta present",
        poor: "Missing",
        desc: "Without this tag, the site appears zoomed out on phones.",
      },
      {
        name: "Font size",
        good: "≥ 16px body text",
        poor: "< 14px",
        desc: "Small text causes reading fatigue, especially on mobile.",
      },
      {
        name: "Popup overload",
        good: "Single overlay at most",
        poor: "Modal + cookie banner simultaneously",
        desc: "Multiple overlays on load increase immediate bounce rate.",
      },
      {
        name: "Page load perception",
        good: "< 3s load time",
        poor: "> 5s",
        desc: "Users perceive anything over 3 seconds as 'slow'.",
      },
    ],
    limitations: [
      {
        text: "Popup and modal detection relies on class names and ARIA roles. A popup built with a plain <div> and no descriptive class will not be detected.",
        highlight: true,
      },
      {
        text: "UX quality beyond these structural checks (visual hierarchy, whitespace, clarity of copy) requires human review.",
      },
      {
        text: "Font size is read from the computed body style — custom properties or JavaScript-controlled sizing may not reflect accurately.",
      },
    ] as { text: string; highlight?: boolean }[],
    tips: [
      "Always add class='modal' or role='dialog' to overlay elements — it helps both scanners and assistive technologies.",
      "Delay popups until the user has been on the page for at least 30 seconds, or use exit-intent triggers.",
      "Set a base font size of 16px on the body element and use rem units throughout.",
    ],
  },
  {
    id: "conversion",
    icon: "🎯",
    label: "Conversion",
    color: "text-pink-400",
    border: "border-pink-500/20",
    bg: "bg-pink-500/5",
    engine: "Puppeteer (DOM analysis)",
    summary:
      "Checks for the presence of conversion-driving elements: calls to action, social proof, forms, and video.",
    howItWorks: [
      "Puppeteer scans all buttons, links, and inputs for CTA keywords and visual prominence signals.",
      "Social proof is detected via a wide range of class names, ARIA roles, semantic HTML patterns (blockquote, cite), and text-content analysis.",
      "Form quality is assessed by checking whether inputs have associated labels.",
    ],
    metrics: [
      {
        name: "CTA buttons",
        good: "1–6 found",
        poor: "0 found or >6",
        desc: "Primary action buttons that guide users toward conversion.",
      },
      {
        name: "Social proof",
        good: "Present",
        poor: "Not detected",
        desc: "Testimonials, reviews, ratings, or trust badges.",
      },
      {
        name: "Form labels",
        good: "All labelled",
        poor: "Inputs without labels",
        desc: "Well-labelled forms reduce abandonment.",
      },
      {
        name: "Video content",
        good: "Present",
        poor: "Not detected",
        desc: "Video can increase landing page conversions significantly.",
      },
    ],
    limitations: [
      {
        text: "CTA detection uses keyword matching on button text and visual prominence heuristics. A button that says 'Go' or uses an icon with no text will not be counted as a CTA, even if it's your primary action.",
        highlight: true,
      },
      {
        text: "Social proof detection looks for class names, ARIA roles, blockquote patterns, and text with quote+attribution structure. A testimonials section using a plain <section> with no descriptive class and no quotation marks may not be detected.",
        highlight: true,
      },
      {
        text: "Conversion quality (copywriting, offer strength, pricing clarity) cannot be measured automatically and requires human review.",
      },
    ] as { text: string; highlight?: boolean }[],
    tips: [
      "Add descriptive text to all CTA buttons — 'Get Started Free' converts better than 'Submit' and is reliably detected.",
      "Use class='testimonial' or role='comment' on testimonial elements so both SiteScope and screen readers understand them.",
      "Wrap blockquotes with a <cite> element containing the customer name — this is valid HTML and helps detection.",
      "If your CTA is an icon button, add an aria-label like aria-label='Start your free trial'.",
    ],
  },
];

// ── Components ─────────────────────────────────────────────────────────────

function MetricTable({
  metrics,
}: {
  metrics: { name: string; good: string; poor: string; desc: string }[];
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/80">
            <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-widest">
              Metric
            </th>
            <th className="text-left px-4 py-3 text-xs font-bold text-emerald-500 uppercase tracking-widest">
              Good
            </th>
            <th className="text-left px-4 py-3 text-xs font-bold text-red-500 uppercase tracking-widest">
              Needs work
            </th>
            <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-widest hidden md:table-cell">
              What it measures
            </th>
          </tr>
        </thead>
        <tbody>
          {metrics.map((m, i) => (
            <tr
              key={m.name}
              className={`border-b border-slate-800/60 ${i % 2 === 0 ? "bg-slate-900/20" : ""}`}
            >
              <td className="px-4 py-3 font-mono text-xs text-slate-300 font-medium">
                {m.name}
              </td>
              <td className="px-4 py-3 text-xs text-emerald-400 font-mono">
                {m.good}
              </td>
              <td className="px-4 py-3 text-xs text-red-400 font-mono">
                {m.poor}
              </td>
              <td className="px-4 py-3 text-xs text-slate-500 hidden md:table-cell">
                {m.desc}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CategorySection({ cat }: { cat: (typeof CATEGORIES)[number] }) {
  const [open, setOpen] = useState(false);

  type Limitation = { text: string; highlight?: boolean } | string;
  const limitations: { text: string; highlight?: boolean }[] = (
    cat.limitations as Limitation[]
  ).map((l) => (typeof l === "string" ? { text: l } : l));

  return (
    <div
      id={cat.id}
      className={`border ${cat.border} rounded-2xl overflow-hidden`}
    >
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center gap-4 px-6 py-5 text-left ${cat.bg} hover:brightness-110 transition-all`}
      >
        <span className="text-3xl shrink-0">{cat.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className={`text-lg font-bold ${cat.color}`}>{cat.label}</h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-500 font-mono uppercase tracking-widest">
              {cat.engine}
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-0.5 leading-snug">
            {cat.summary}
          </p>
        </div>
        <span
          className={`text-slate-500 text-lg shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </button>

      {/* Body */}
      {open && (
        <div className="px-6 py-6 space-y-8 bg-slate-950/40 border-t border-slate-800/60">
          {/* How it works */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
              How it works
            </h3>
            <ul className="space-y-2">
              {cat.howItWorks.map((step, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm text-slate-400"
                >
                  <span
                    className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${cat.bg} ${cat.color} border ${cat.border}`}
                  >
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ul>
          </div>

          {/* Metrics table */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
              Metrics & thresholds
            </h3>
            <MetricTable metrics={cat.metrics} />
          </div>

          {/* Limitations */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
              Known limitations
            </h3>
            <div className="space-y-2">
              {limitations.map((l, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 text-sm rounded-xl px-4 py-3
                  ${
                    l.highlight
                      ? "bg-amber-400/8 border border-amber-400/20 text-amber-200"
                      : "bg-slate-900/60 border border-slate-800 text-slate-400"
                  }`}
                >
                  <span
                    className={`shrink-0 mt-0.5 ${l.highlight ? "text-amber-400" : "text-slate-600"}`}
                  >
                    {l.highlight ? "⚠" : "•"}
                  </span>
                  {l.text}
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
              Tips for better results
            </h3>
            <ul className="space-y-2">
              {cat.tips.map((tip, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm text-slate-300"
                >
                  <span className="text-emerald-400 shrink-0 mt-0.5">→</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#050d1a] text-white">
      {/* Nav */}
      <nav className="border-b border-slate-800/60 px-6 py-4 flex items-center gap-3 sticky top-0 z-20 bg-[#050d1a]/95 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
        </Link>
        <div className="w-px h-4 bg-slate-700 mx-1" />
        <span className="text-sm text-slate-400">Docs</span>
        <div className="flex-1" />
        <Link
          href="/"
          className="text-sm text-slate-400 hover:text-white transition-colors"
        >
          ← Back to Home
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono tracking-widest uppercase">
            📖 Documentation
          </div>
          <h1 className="text-4xl font-extrabold tracking-tighter">
            How SiteScope audits your site
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
            This page explains exactly what SiteScope checks, how it detects
            each issue, the thresholds used to score them, and — importantly —
            what it <em>cannot</em> reliably detect.
          </p>
          <div className="bg-slate-900 border border-amber-500/20 rounded-xl px-5 py-4 flex items-start gap-3">
            <span className="text-amber-400 text-lg shrink-0">⚠</span>
            <p className="text-sm text-slate-300 leading-relaxed">
              <strong className="text-amber-400">
                Automated audits have limits.
              </strong>
              SiteScope uses a real browser and Google&apos;s Lighthouse engine,
              but no automated tool can catch everything. Scores should be
              treated as a <strong>starting point for investigation</strong>,
              not a definitive grade. Limitations for each category are
              highlighted below.
            </p>
          </div>
        </div>

        {/* Quick nav */}
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
            Jump to category
          </p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all hover:brightness-125 ${cat.bg} ${cat.border} ${cat.color}`}
              >
                {cat.icon} {cat.label}
              </a>
            ))}
          </div>
        </div>

        {/* Category sections */}
        <div className="space-y-4">
          {CATEGORIES.map((cat) => (
            <CategorySection key={cat.id} cat={cat} />
          ))}
        </div>

        {/* General limitations */}
        <div className="border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white">
            General limitations of all automated audits
          </h2>
          <div className="space-y-3 text-sm text-slate-400 leading-relaxed">
            <p>
              <strong className="text-slate-200">JavaScript-heavy SPAs:</strong>
              SiteScope waits for
              <code className="text-blue-400 bg-slate-900 px-1 rounded">
                networkidle2
              </code>
              before extracting DOM data, which covers most React, Vue, and
              Angular apps. However, content that loads on user interaction
              (scroll, click, hover) will not be scanned.
            </p>
            <p>
              <strong className="text-slate-200">Authentication walls:</strong>
              Pages behind a login, paywall, or IP restriction cannot be
              scanned. Run SiteScope on a machine with access to scan staging
              environments.
            </p>
            <p>
              <strong className="text-slate-200">Single-page audit:</strong>
              Only the URL you provide is scanned. Site-wide issues (broken
              links across pages, crawl budget problems, duplicate content at
              scale) require a full site crawler.
            </p>
            <p>
              <strong className="text-slate-200">Score variability:</strong>
              Lighthouse performance scores can vary by ±5 points between runs
              due to CPU scheduling, network jitter, and third-party script
              timing. Run multiple analyses and average the results for a more
              stable baseline.
            </p>
            <p>
              <strong className="text-slate-200">
                False negatives vs. false positives:
              </strong>
              Where in doubt, SiteScope errs toward <em>not</em> raising an
              issue rather than raising a false alarm. This means some real
              problems (especially in UX and Conversion) may not be flagged if
              the scanner can&apos;t find enough evidence.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/40">
          <div>
            <p className="font-bold text-white mb-1">Ready to run an audit?</p>
            <p className="text-sm text-slate-500">
              Now that you know how it works, paste any URL and get your report.
            </p>
          </div>
          <AnalyzerLink href="/#analyzer" className="shrink-0 px-5 py-2.5">
            Analyze a site →
          </AnalyzerLink>
        </div>
      </div>
    </div>
  );
}
