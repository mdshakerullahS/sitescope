export interface Issue {
  id: string;
  category:
    | "Performance"
    | "SEO"
    | "Accessibility"
    | "Security"
    | "UX"
    | "Conversion";
  severity: "critical" | "warning" | "info";
  title: string;
  description: string;
  fix: string;
  impact: string;
  element?: string;
}

export interface CategoryScore {
  score: number;
  label: string;
  issues: number;
}

export interface LighthouseMetrics {
  fcp: number; // First Contentful Paint (ms)
  lcp: number; // Largest Contentful Paint (ms)
  tbt: number; // Total Blocking Time (ms)
  cls: number; // Cumulative Layout Shift
  tti: number; // Time to Interactive (ms)
  speedIndex: number;
  performanceScore: number;
  accessibilityScore: number;
  seoScore: number;
  bestPracticesScore: number;
}

export interface PuppeteerData {
  title: string;
  metaDescription: string;
  metaKeywords: string;
  h1Count: number;
  h1Text: string[];
  imagesMissingAlt: number;
  totalImages: number;
  internalLinks: number;
  externalLinks: number;
  brokenLinks: string[];
  hasViewport: boolean;
  hasCanonical: boolean;
  hasRobots: boolean;
  hasSitemap: boolean;
  hasSSL: boolean;
  hasOpenGraph: boolean;
  hasTwitterCard: boolean;
  formCount: number;
  formsWithoutLabels: number;
  ctaButtons: number;
  ctaButtonTexts: string[];
  colorContrastIssues: number;
  fontSize: string;
  mobileViewport: boolean;
  pageLoadTime: number;
  resourceCount: number;
  scriptCount: number;
  styleCount: number;
  consoleErrors: string[];
  securityHeaders: Record<string, string | null>;
  wordCount: number;
  hasStructuredData: boolean;
  structuredDataTypes: string[];
  isResponsive: boolean;
  popupDetected: boolean;
  cookieBannerDetected: boolean;
  chatWidgetDetected: boolean;
  socialProofElements: number;
  exitIntentPopup: boolean;
  videoContent: boolean;
  testimonials: boolean;
}

export interface AnalysisResult {
  url: string;
  analyzedAt: string;
  screenshot: string | null;
  puppeteer: PuppeteerData;
  lighthouse: LighthouseMetrics | null;
  issues: Issue[];
  scores: {
    overall: number;
    performance: number;
    seo: number;
    accessibility: number;
    security: number;
    ux: number;
    conversion: number;
  };
  summary: string;
  topWins: string[];
}
