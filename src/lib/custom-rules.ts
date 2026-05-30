import { Issue, PuppeteerData, LighthouseMetrics } from "@/types";
import { nanoid } from "nanoid";

function id() {
  return nanoid(8);
}

export function runCustomRules(
  data: PuppeteerData,
  lh: LighthouseMetrics | null,
): Issue[] {
  const issues: Issue[] = [];

  // ─── PERFORMANCE ───────────────────────────────────────────────────
  if (lh) {
    if (lh.lcp > 4000) {
      issues.push({
        id: id(),
        category: "Performance",
        severity: "critical",
        title: "Largest Contentful Paint is too slow",
        description: `LCP is ${(lh.lcp / 1000).toFixed(1)}s (target: <2.5s). This means users wait a long time to see the main content, hurting Core Web Vitals ranking signals.`,
        fix: "Optimize hero images with next-gen formats (WebP/AVIF), preload critical resources, eliminate render-blocking scripts, and use a CDN.",
        impact: "High — directly affects Google ranking and user bounce rate.",
      });
    } else if (lh.lcp > 2500) {
      issues.push({
        id: id(),
        category: "Performance",
        severity: "warning",
        title: "Largest Contentful Paint needs improvement",
        description: `LCP is ${(lh.lcp / 1000).toFixed(1)}s (target: <2.5s). Slightly above Google's threshold for a "good" rating.`,
        fix: "Preload the LCP image with <link rel='preload'>, defer non-critical CSS, and consider lazy-loading below-the-fold images.",
        impact: "Medium — borderline Core Web Vitals score.",
      });
    }

    if (lh.tbt > 600) {
      issues.push({
        id: id(),
        category: "Performance",
        severity: "critical",
        title: "Total Blocking Time is critically high",
        description: `TBT is ${lh.tbt.toFixed(0)}ms (target: <200ms). Long tasks on the main thread prevent the page from responding to user input.`,
        fix: "Break up long JavaScript tasks using code splitting, defer third-party scripts, and remove unused JavaScript.",
        impact: "High — causes sluggish interactivity and poor INP score.",
      });
    } else if (lh.tbt > 200) {
      issues.push({
        id: id(),
        category: "Performance",
        severity: "warning",
        title: "Total Blocking Time is elevated",
        description: `TBT is ${lh.tbt.toFixed(0)}ms (target: <200ms). Some JavaScript is blocking the main thread.`,
        fix: "Audit and defer heavy third-party scripts (chat widgets, analytics). Use web workers for intensive computations.",
        impact: "Medium — affects interactivity perception.",
      });
    }

    if (lh.cls > 0.25) {
      issues.push({
        id: id(),
        category: "Performance",
        severity: "critical",
        title: "Cumulative Layout Shift is very high",
        description: `CLS score is ${lh.cls.toFixed(3)} (target: <0.1). Elements are jumping around as the page loads, causing a jarring experience.`,
        fix: "Set explicit width/height on images and video embeds. Avoid inserting content above existing content. Reserve space for dynamic ads and embeds.",
        impact: "High — Core Web Vitals fail, users mis-click.",
      });
    } else if (lh.cls > 0.1) {
      issues.push({
        id: id(),
        category: "Performance",
        severity: "warning",
        title: "Cumulative Layout Shift needs attention",
        description: `CLS score is ${lh.cls.toFixed(3)} (target: <0.1). Some layout instability detected on load.`,
        fix: "Add explicit dimensions to images, fonts, and embeds. Use font-display: swap carefully to minimize FOIT/FOUT shifts.",
        impact: "Medium — borderline Core Web Vitals.",
      });
    }

    if (lh.fcp > 3000) {
      issues.push({
        id: id(),
        category: "Performance",
        severity: "warning",
        title: "First Contentful Paint is slow",
        description: `FCP is ${(lh.fcp / 1000).toFixed(1)}s (target: <1.8s). Users see a blank page for too long before any content appears.`,
        fix: "Minimize render-blocking resources, inline critical CSS, and use server-side rendering or static generation.",
        impact: "Medium — affects perceived load speed significantly.",
      });
    }
  }

  if (data.pageLoadTime > 5000) {
    issues.push({
      id: id(),
      category: "Performance",
      severity: "critical",
      title: "Page load time exceeds 5 seconds",
      description: `The page took ${(data.pageLoadTime / 1000).toFixed(1)}s to fully load. Studies show 53% of mobile users abandon sites that take over 3 seconds.`,
      fix: "Enable browser caching, compress assets with Gzip/Brotli, optimize server response time (TTFB), and use a CDN.",
      impact: "Critical — major impact on bounce rate and conversions.",
    });
  }

  if (data.scriptCount > 20) {
    issues.push({
      id: id(),
      category: "Performance",
      severity: "warning",
      title: `Too many JavaScript files (${data.scriptCount})`,
      description: `Loading ${data.scriptCount} separate script files increases HTTP request overhead and parse time.`,
      fix: "Bundle JavaScript files, remove unused scripts, and use module/nomodule pattern to ship smaller bundles to modern browsers.",
      impact: "Medium — each extra script adds network round-trip latency.",
    });
  }

  // ─── SEO ───────────────────────────────────────────────────────────
  if (!data.title) {
    issues.push({
      id: id(),
      category: "SEO",
      severity: "critical",
      title: "Missing page title",
      description:
        "No <title> tag found. This is one of the most important on-page SEO factors and is used by search engines to understand page content.",
      fix: "Add a descriptive <title> tag (50–60 characters) that includes your primary keyword and brand name.",
      impact:
        "Critical — pages without titles are severely penalized in rankings.",
    });
  } else if (data.title.length > 60) {
    issues.push({
      id: id(),
      category: "SEO",
      severity: "warning",
      title: "Page title too long",
      description: `Title is ${data.title.length} characters (recommended: 50–60). Google will truncate it in search results.`,
      fix: `Shorten the title to 50–60 characters: "${data.title.slice(0, 57)}…"`,
      impact: "Medium — truncated titles look unprofessional in SERPs.",
    });
  }

  if (!data.metaDescription) {
    issues.push({
      id: id(),
      category: "SEO",
      severity: "critical",
      title: "Missing meta description",
      description:
        "No meta description tag found. Google uses this as the snippet in search results, directly affecting click-through rates.",
      fix: "Add a compelling meta description (150–160 characters) that summarizes the page and includes a call-to-action.",
      impact:
        "High — missing descriptions result in Google auto-generating poor snippets.",
    });
  } else if (data.metaDescription.length > 160) {
    issues.push({
      id: id(),
      category: "SEO",
      severity: "info",
      title: "Meta description too long",
      description: `Meta description is ${data.metaDescription.length} characters (recommended: 150–160). It will be cut off in search results.`,
      fix: "Trim the meta description to 150–160 characters, keeping the most compelling content first.",
      impact: "Low — mostly aesthetic but affects SERP appearance.",
    });
  }

  if (data.h1Count === 0) {
    issues.push({
      id: id(),
      category: "SEO",
      severity: "critical",
      title: "No H1 heading found",
      description:
        "The page has no H1 heading. H1 is the strongest on-page SEO signal after the title tag and helps search engines understand the page topic.",
      fix: "Add a single, descriptive H1 heading near the top of the page that includes your primary keyword.",
      impact: "High — missing H1 is a significant ranking disadvantage.",
    });
  } else if (data.h1Count > 1) {
    issues.push({
      id: id(),
      category: "SEO",
      severity: "warning",
      title: `Multiple H1 headings found (${data.h1Count})`,
      description: `The page has ${data.h1Count} H1 tags. Best practice is one H1 per page to clearly signal the primary topic to search engines.`,
      fix: "Keep only one H1 that represents the main topic. Convert other H1s to H2 or H3.",
      impact: "Medium — dilutes the SEO signal of your primary heading.",
    });
  }

  if (!data.hasCanonical) {
    issues.push({
      id: id(),
      category: "SEO",
      severity: "warning",
      title: "Missing canonical tag",
      description:
        "No canonical URL tag found. Without it, search engines may index duplicate versions of your pages (http vs https, www vs non-www, etc.).",
      fix: "Add <link rel='canonical' href='[full-url]'> to every page to prevent duplicate content penalties.",
      impact:
        "Medium — duplicate content can split link equity and cause ranking confusion.",
    });
  }

  if (!data.hasRobots) {
    issues.push({
      id: id(),
      category: "SEO",
      severity: "warning",
      title: "No robots.txt file found",
      description:
        "robots.txt helps search engine crawlers understand which pages to index. Without it, crawlers may waste budget on irrelevant pages.",
      fix: "Create a /robots.txt file that disallows admin/private paths and references your sitemap.",
      impact:
        "Medium — may cause crawl budget waste and unwanted page indexing.",
    });
  }

  if (!data.hasSitemap) {
    issues.push({
      id: id(),
      category: "SEO",
      severity: "warning",
      title: "No XML sitemap detected",
      description:
        "No sitemap.xml found. Sitemaps help search engines discover and index all your important pages, especially on large sites.",
      fix: "Generate and submit an XML sitemap at /sitemap.xml. Reference it in robots.txt and Google Search Console.",
      impact: "Medium — important pages may not be indexed without a sitemap.",
    });
  }

  if (data.imagesMissingAlt > 0) {
    issues.push({
      id: id(),
      category: "SEO",
      severity: data.imagesMissingAlt > 5 ? "warning" : "info",
      title: `${data.imagesMissingAlt} images missing alt text`,
      description: `${data.imagesMissingAlt} of ${data.totalImages} images lack alt text. Alt text helps search engines understand image content and contributes to image search rankings.`,
      fix: "Add descriptive alt attributes to all images. For decorative images, use alt='' to hide from screen readers.",
      impact:
        "Medium — missed opportunity for image SEO and keyword relevance.",
    });
  }

  if (!data.hasStructuredData) {
    issues.push({
      id: id(),
      category: "SEO",
      severity: "info",
      title: "No structured data (Schema.org) found",
      description:
        "Structured data helps search engines display rich results (star ratings, FAQs, breadcrumbs) in SERPs, improving click-through rates.",
      fix: "Add JSON-LD structured data for your content type (Organization, Product, Article, FAQ, etc.) using Schema.org vocabulary.",
      impact: "Medium — rich snippets can increase CTR by 20-30%.",
    });
  }

  if (!data.hasOpenGraph) {
    issues.push({
      id: id(),
      category: "SEO",
      severity: "info",
      title: "Missing Open Graph meta tags",
      description:
        "No Open Graph tags found. When your pages are shared on social media, they'll show a generic preview instead of a tailored image and description.",
      fix: "Add og:title, og:description, og:image, and og:url meta tags. Use a 1200×630px image for the og:image.",
      impact:
        "Low-Medium — affects social media appearance and referral traffic.",
    });
  }

  if (data.wordCount < 300) {
    issues.push({
      id: id(),
      category: "SEO",
      severity: "warning",
      title: "Low word count — thin content risk",
      description: `Page has only ~${data.wordCount} words. Search engines may consider this "thin content" and rank it lower, especially for competitive keywords.`,
      fix: "Add more substantive content (aim for 500+ words for key pages). Address user intent with detailed, helpful information.",
      impact:
        "Medium — thin content is a known Google ranking penalty trigger.",
    });
  }

  // ─── ACCESSIBILITY ─────────────────────────────────────────────────
  if (!data.hasViewport) {
    issues.push({
      id: id(),
      category: "Accessibility",
      severity: "critical",
      title: "Missing viewport meta tag",
      description:
        "No viewport meta tag found. The page will not render properly on mobile devices, appearing zoomed out with tiny text.",
      fix: "Add <meta name='viewport' content='width=device-width, initial-scale=1'> to the <head>.",
      impact:
        "Critical — breaks mobile rendering for all users on phones/tablets.",
    });
  }

  if (data.formsWithoutLabels > 0) {
    issues.push({
      id: id(),
      category: "Accessibility",
      severity: "warning",
      title: `${data.formsWithoutLabels} form(s) missing input labels`,
      description:
        "Form inputs without associated labels are inaccessible to screen reader users and don't comply with WCAG 2.1 AA.",
      fix: "Add <label for='inputId'> to each input, or use aria-label/aria-labelledby attributes.",
      impact:
        "High — excludes users with visual impairments from completing forms.",
    });
  }

  if (lh && lh.accessibilityScore < 70) {
    issues.push({
      id: id(),
      category: "Accessibility",
      severity: "critical",
      title: `Low accessibility score (${lh.accessibilityScore}/100)`,
      description: `Lighthouse accessibility audit score is ${lh.accessibilityScore}/100. This suggests significant WCAG violations that exclude users with disabilities.`,
      fix: "Run a full audit with axe DevTools or WAVE. Prioritize: color contrast ratios, keyboard navigation, ARIA labels, and focus management.",
      impact:
        "Critical — legal liability risk (ADA/WCAG) and excludes ~15% of users.",
    });
  } else if (lh && lh.accessibilityScore < 90) {
    issues.push({
      id: id(),
      category: "Accessibility",
      severity: "warning",
      title: `Accessibility score below 90 (${lh.accessibilityScore}/100)`,
      description:
        "There are accessibility issues that may affect users with disabilities or assistive technologies.",
      fix: "Review Lighthouse accessibility report for specific failing audits. Common fixes: add alt text, fix heading order, ensure sufficient color contrast.",
      impact:
        "Medium — some users with disabilities may struggle with the site.",
    });
  }

  // ─── SECURITY ──────────────────────────────────────────────────────
  if (!data.hasSSL) {
    issues.push({
      id: id(),
      category: "Security",
      severity: "critical",
      title: "Site is not served over HTTPS",
      description:
        "The website is using HTTP instead of HTTPS. All data transmitted is unencrypted and browsers show a 'Not Secure' warning.",
      fix: "Install an SSL/TLS certificate (free via Let's Encrypt) and redirect all HTTP traffic to HTTPS.",
      impact:
        "Critical — browsers actively warn users, and Google penalizes HTTP sites.",
    });
  }

  const missingSecHeaders = Object.entries(data.securityHeaders)
    .filter(([, v]) => !v)
    .map(([k]) => k);

  if (missingSecHeaders.includes("content-security-policy")) {
    issues.push({
      id: id(),
      category: "Security",
      severity: "warning",
      title: "Missing Content Security Policy header",
      description:
        "No CSP header found. CSP prevents cross-site scripting (XSS) attacks by controlling which resources the browser is allowed to load.",
      fix: "Add a Content-Security-Policy header. Start with 'default-src self' and progressively allow trusted sources.",
      impact:
        "High — XSS attacks can steal user sessions and inject malicious content.",
    });
  }

  if (missingSecHeaders.includes("x-frame-options")) {
    issues.push({
      id: id(),
      category: "Security",
      severity: "warning",
      title: "Missing X-Frame-Options header",
      description:
        "Without X-Frame-Options, your page can be embedded in iframes on malicious sites, enabling clickjacking attacks.",
      fix: "Add the header: X-Frame-Options: SAMEORIGIN (or DENY if you don't need iframing).",
      impact: "Medium — clickjacking can trick users into unintended actions.",
    });
  }

  if (missingSecHeaders.includes("x-content-type-options")) {
    issues.push({
      id: id(),
      category: "Security",
      severity: "info",
      title: "Missing X-Content-Type-Options header",
      description:
        "Without this header, browsers may MIME-sniff responses and execute files as a different type than intended (MIME confusion attacks).",
      fix: "Add the header: X-Content-Type-Options: nosniff",
      impact:
        "Low-Medium — prevents certain drive-by download and MIME-type confusion attacks.",
    });
  }

  if (missingSecHeaders.includes("strict-transport-security") && data.hasSSL) {
    issues.push({
      id: id(),
      category: "Security",
      severity: "warning",
      title: "Missing HSTS (HTTP Strict Transport Security) header",
      description:
        "HSTS tells browsers to always use HTTPS for your domain. Without it, users could be downgraded to HTTP via man-in-the-middle attacks.",
      fix: "Add: Strict-Transport-Security: max-age=31536000; includeSubDomains; preload",
      impact: "Medium — prevents SSL stripping attacks.",
    });
  }

  if (data.consoleErrors.length > 0) {
    issues.push({
      id: id(),
      category: "Security",
      severity: "info",
      title: `${data.consoleErrors.length} JavaScript console error(s) detected`,
      description: `Console errors may indicate broken functionality or insecure resource loading. Errors: "${data.consoleErrors[0]?.slice(0, 100)}…"`,
      fix: "Investigate and fix all console errors. Mixed content errors (HTTP resources on HTTPS pages) are a security concern.",
      impact: "Low-Medium — may indicate broken features or security issues.",
    });
  }

  // ─── UX ─────────────────────────────────────────────────────────────
  if (!data.isResponsive) {
    issues.push({
      id: id(),
      category: "UX",
      severity: "critical",
      title: "Site may not be mobile-responsive",
      description:
        "No viewport meta tag detected, suggesting the site was not built with mobile responsiveness in mind. Over 60% of web traffic is mobile.",
      fix: "Implement responsive design using CSS media queries. Start with a mobile-first approach and use flexible layouts (Flexbox/Grid).",
      impact: "Critical — alienates majority of users on mobile devices.",
    });
  }

  if (data.popupDetected && data.cookieBannerDetected) {
    issues.push({
      id: id(),
      category: "UX",
      severity: "warning",
      title: "Multiple intrusive overlays detected",
      description:
        "Both a popup and a cookie consent banner are detected. Multiple overlays on page load create a poor first impression and frustrate users.",
      fix: "Delay popups until users show engagement (e.g. 30 seconds or scroll 50%). Combine cookie notices into a slim footer bar.",
      impact:
        "Medium — can increase bounce rate significantly, especially on mobile.",
    });
  }

  if (data.pageLoadTime > 3000 && !data.videoContent) {
    issues.push({
      id: id(),
      category: "UX",
      severity: "warning",
      title: "Slow page load degrades user experience",
      description: `Page loads in ${(data.pageLoadTime / 1000).toFixed(1)}s. Users perceive sites over 3s as slow, leading to abandonment before they even see your content.`,
      fix: "Optimize images, enable lazy loading, remove unused CSS/JS, and upgrade hosting if necessary.",
      impact: "High — every 1-second delay reduces conversions by ~7%.",
    });
  }

  if (data.fontSize && parseInt(data.fontSize) < 14) {
    issues.push({
      id: id(),
      category: "UX",
      severity: "warning",
      title: "Body text font size may be too small",
      description: `Detected body font size around ${data.fontSize}. Text below 16px is difficult to read, especially on mobile devices.`,
      fix: "Set body font size to at least 16px. Use relative units (rem/em) for scalability and accessibility.",
      impact:
        "Medium — small text causes reading fatigue and accessibility issues.",
    });
  }

  // ─── CONVERSION ─────────────────────────────────────────────────────
  if (data.ctaButtons === 0) {
    issues.push({
      id: id(),
      category: "Conversion",
      severity: "critical",
      title: "No clear call-to-action (CTA) found",
      description:
        "No obvious CTA buttons detected on the page. Without clear next steps, visitors don't know what action to take and leave without converting.",
      fix: "Add prominent CTA buttons with action-oriented text (e.g., 'Start Free Trial', 'Get a Quote', 'Shop Now'). Place above the fold.",
      impact:
        "Critical — CTAs are the primary driver of conversions on any page.",
    });
  } else if (data.ctaButtons > 6) {
    issues.push({
      id: id(),
      category: "Conversion",
      severity: "warning",
      title: "Too many CTAs creating decision paralysis",
      description: `${data.ctaButtons} CTA buttons detected. Too many competing calls-to-action confuse visitors and reduce the effectiveness of each individual CTA.`,
      fix: "Identify your primary conversion goal and make that CTA visually dominant. Limit to 1-2 primary CTAs per section.",
      impact:
        "Medium — choice overload can reduce click-through rates on key CTAs.",
    });
  }

  if (!data.testimonials && !data.socialProofElements) {
    issues.push({
      id: id(),
      category: "Conversion",
      severity: "warning",
      title: "No social proof elements found",
      description:
        "No testimonials, reviews, ratings, or trust badges detected. Social proof is one of the most powerful conversion factors, especially for new visitors.",
      fix: "Add customer testimonials, star ratings, review counts, logos of clients, or trust badges (SSL, money-back guarantee) near key CTAs.",
      impact: "High — social proof can increase conversions by 15-34%.",
    });
  }

  if (data.formCount > 0 && data.formsWithoutLabels === data.formCount) {
    issues.push({
      id: id(),
      category: "Conversion",
      severity: "warning",
      title: "Forms lack proper labeling and guidance",
      description:
        "Forms on the page don't have proper labels, which increases friction and form abandonment rates.",
      fix: "Add clear labels, placeholder examples, inline validation, and progress indicators for multi-step forms.",
      impact:
        "Medium — well-designed forms can improve completion rates by 25-40%.",
    });
  }

  if (!data.videoContent) {
    issues.push({
      id: id(),
      category: "Conversion",
      severity: "info",
      title: "No video content detected",
      description:
        "Pages with video content see significantly higher engagement and conversion rates. Videos can explain complex offerings more effectively than text.",
      fix: "Consider adding a product demo, explainer video, or customer testimonial video. Keep it under 2 minutes and autoplay muted.",
      impact:
        "Medium — video can increase conversion rates by up to 80% on landing pages.",
    });
  }

  if (data.popupDetected) {
    issues.push({
      id: id(),
      category: "Conversion",
      severity: "info",
      title: "Popup detected — ensure it's optimized",
      description:
        "A popup or modal is present. While popups can boost conversions when done right, poorly timed or aggressive popups drive visitors away.",
      fix: "Use exit-intent triggers instead of immediate popups. Offer real value (discount, lead magnet). Make the close button obvious.",
      impact:
        "Variable — properly optimized popups convert at 3-5%; poorly executed ones hurt bounce rate.",
    });
  }

  return issues;
}

export function calculateScores(issues: Issue[], lh: LighthouseMetrics | null) {
  const categoryIssues = (cat: Issue["category"]) =>
    issues.filter((i) => i.category === cat);
  const severityPenalty = (issues: Issue[]) => {
    let penalty = 0;
    issues.forEach((i) => {
      if (i.severity === "critical") penalty += 20;
      else if (i.severity === "warning") penalty += 10;
      else penalty += 3;
    });
    return Math.min(penalty, 70);
  };

  const performance =
    lh?.performanceScore ??
    Math.max(10, 85 - severityPenalty(categoryIssues("Performance")));
  const seo =
    lh?.seoScore ?? Math.max(10, 90 - severityPenalty(categoryIssues("SEO")));
  const accessibility =
    lh?.accessibilityScore ??
    Math.max(10, 88 - severityPenalty(categoryIssues("Accessibility")));
  const bestPractices = lh?.bestPracticesScore ?? 80;
  const security = Math.max(
    10,
    95 - severityPenalty(categoryIssues("Security")),
  );
  const ux = Math.max(10, 90 - severityPenalty(categoryIssues("UX")));
  const conversion = Math.max(
    10,
    88 - severityPenalty(categoryIssues("Conversion")),
  );

  const overall = Math.round(
    performance * 0.2 +
      seo * 0.2 +
      accessibility * 0.15 +
      security * 0.15 +
      ux * 0.15 +
      conversion * 0.15,
  );

  return {
    overall,
    performance,
    seo,
    accessibility,
    security,
    ux,
    conversion,
    bestPractices,
  };
}

export function generateSummary(
  scores: ReturnType<typeof calculateScores>,
  issues: Issue[],
): { summary: string; topWins: string[] } {
  const critical = issues.filter((i) => i.severity === "critical").length;
  const warnings = issues.filter((i) => i.severity === "warning").length;

  let quality = "average";
  if (scores.overall >= 80) quality = "solid";
  else if (scores.overall >= 60) quality = "needs work";
  else quality = "significant issues";

  const summary =
    `This website has a ${quality} overall score of ${scores.overall}/100 with ${critical} critical issue${critical !== 1 ? "s" : ""} and ${warnings} warning${warnings !== 1 ? "s" : ""} identified across all categories. ` +
    `The strongest area is ${
      Object.entries(scores)
        .filter(([k]) => !["overall", "bestPractices"].includes(k))
        .sort((a, b) => (b[1] as number) - (a[1] as number))[0][0]
    } (${Math.max(
      ...Object.entries(scores)
        .filter(([k]) => !["overall", "bestPractices"].includes(k))
        .map(([, v]) => v as number),
    )}/100), ` +
    `while ${
      Object.entries(scores)
        .filter(([k]) => !["overall", "bestPractices"].includes(k))
        .sort((a, b) => (a[1] as number) - (b[1] as number))[0][0]
    } needs the most attention (${Math.min(
      ...Object.entries(scores)
        .filter(([k]) => !["overall", "bestPractices"].includes(k))
        .map(([, v]) => v as number),
    )}/100).`;

  const topWins = issues
    .filter((i) => i.severity === "critical")
    .slice(0, 3)
    .map((i) => i.title);

  return { summary, topWins };
}
