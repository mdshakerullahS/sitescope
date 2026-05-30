import { Browser, HTTPResponse } from "puppeteer";
import { PuppeteerData } from "@/types";
import { withBrowser } from "@/lib/browser-pool";

export async function scanWithPuppeteer(
  url: string,
): Promise<{ data: PuppeteerData; screenshot: string | null }> {
  return withBrowser(async (browser: Browser) => {
    const page = await browser.newPage();

    try {
      await page.setViewport({ width: 1280, height: 900 });
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0 Safari/537.36",
      );

      // Console errors
      const consoleErrors: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error")
          consoleErrors.push(msg.text().slice(0, 200));
      });

      const start = Date.now();

      let response: HTTPResponse | null = null;
      try {
        response = await page.goto(url, {
          waitUntil: "load",
          timeout: 60000,
        });
      } catch (gotoError) {
        console.warn(
          `[PuppeteerScanner] Navigation warning for ${url}:`,
          gotoError,
        );
      }

      const pageLoadTime = Date.now() - start;
      const hasSSL = url.startsWith("https://");

      // Screenshot
      let screenshot: string | null = null;
      try {
        const buf = await page.screenshot({
          type: "jpeg",
          quality: 80,
          clip: { x: 0, y: 0, width: 1280, height: 900 },
        });
        screenshot = `data:image/jpeg;base64,${Buffer.from(buf).toString("base64")}`;
      } catch {}

      // Security headers
      const headers = response?.headers() || {};
      const securityHeaders: Record<string, string | null> = {
        "content-security-policy": headers["content-security-policy"] || null,
        "x-frame-options": headers["x-frame-options"] || null,
        "x-content-type-options": headers["x-content-type-options"] || null,
        "strict-transport-security":
          headers["strict-transport-security"] || null,
        "referrer-policy": headers["referrer-policy"] || null,
        "permissions-policy": headers["permissions-policy"] || null,
      };

      // DOM extraction
      const data = await page.evaluate(() => {
        const getMeta = (name: string) =>
          document
            .querySelector(`meta[name="${name}"]`)
            ?.getAttribute("content") ||
          document
            .querySelector(`meta[property="${name}"]`)
            ?.getAttribute("content") ||
          "";

        const h1Elements = Array.from(document.querySelectorAll("h1"));
        const images = Array.from(document.querySelectorAll("img"));
        const links = Array.from(document.querySelectorAll("a[href]"));
        const forms = Array.from(document.querySelectorAll("form"));
        const scripts = Array.from(document.querySelectorAll("script[src]"));
        const styles = Array.from(
          document.querySelectorAll("link[rel='stylesheet']"),
        );

        const host = window.location.hostname;
        const internalLinks = links.filter((a) => {
          const href = a.getAttribute("href") || "";
          return href.startsWith("/") || href.includes(host);
        }).length;
        const externalLinks = links.length - internalLinks;

        const hasViewport = !!document.querySelector("meta[name='viewport']");
        const hasCanonical = !!document.querySelector("link[rel='canonical']");

        const structuredDataScripts = Array.from(
          document.querySelectorAll("script[type='application/ld+json']"),
        );
        const structuredDataTypes: string[] = [];
        structuredDataScripts.forEach((s) => {
          try {
            const obj = JSON.parse(s.textContent || "{}");
            if (obj["@type"]) structuredDataTypes.push(obj["@type"]);
          } catch {}
        });

        const ctaKeywords = [
          // Purchase / conversion
          "buy",
          "purchase",
          "order",
          "checkout",
          "add to cart",
          "add to bag",
          // Sign-up / trial
          "sign up",
          "signup",
          "register",
          "create account",
          "get started",
          "get access",
          "start free",
          "free trial",
          "try free",
          "try it",
          "start trial",
          "claim",
          // Download / install
          "download",
          "install",
          "get the app",
          "get app",
          "app store",
          "play store",
          // Contact / booking
          "contact",
          "book",
          "schedule",
          "request",
          "get a quote",
          "get quote",
          "talk to",
          "speak to",
          "call us",
          "message us",
          // Subscribe / join
          "subscribe",
          "join",
          "join now",
          "join free",
          "become a member",
          // Generic action words that usually live on CTA buttons
          "learn more",
          "see how",
          "find out",
          "discover",
          "explore",
          "view demo",
          "watch demo",
          "see demo",
          "get demo",
          "request demo",
          "book demo",
          "show me",
          "take a tour",
          "start now",
          "go",
          "submit",
          "send",
          "apply",
          "open account",
          "open free",
          "get started for free",
          "continue",
        ];

        const allClickable = Array.from(
          document.querySelectorAll(
            "button, a[href], input[type='submit'], input[type='button'], [role='button'], .btn, .button",
          ),
        );

        const ctaButtons = allClickable.filter((el) => {
          const raw = (el.textContent || (el as HTMLInputElement).value || "")
            .toLowerCase()
            .trim();
          // Short non-descriptive labels like "go", "ok", "yes" on small elements → skip
          if (raw.length < 2) return false;
          if (ctaKeywords.some((k) => raw.includes(k))) return true;
          // Visual heuristic: prominent standalone buttons (not in nav/footer) with short text
          // const tag = el.tagName.toLowerCase();
          const inNav = !!el.closest("nav, header, footer");
          const cls = (el.getAttribute("class") || "").toLowerCase();
          const looksProminent =
            cls.includes("primary") ||
            cls.includes("hero") ||
            cls.includes("action") ||
            cls.includes("prominent") ||
            cls.includes("highlight") ||
            cls.includes("main") ||
            el.getAttribute("data-cta") !== null ||
            el.getAttribute("aria-label")?.toLowerCase().includes("sign") ||
            el.getAttribute("aria-label")?.toLowerCase().includes("start");
          return !inNav && looksProminent;
        });

        const socialProofSelectors = [
          // Class/id keywords
          "[class*='testimonial']",
          "[id*='testimonial']",
          "[class*='review']",
          "[id*='review']",
          "[class*='rating']",
          "[id*='rating']",
          "[class*='stars']",
          "[id*='stars']",
          "[class*='trust']",
          "[id*='trust']",
          "[class*='social-proof']",
          "[class*='socialproof']",
          "[class*='quote']",
          "[id*='quote']",
          "[class*='feedback']",
          "[class*='customer']",
          "[class*='client']",
          "[class*='case-study']",
          // ARIA / semantic
          "[role='comment']",
          "[role='article']",
          // Semantic HTML patterns (blockquote near a name/cite is almost always a testimonial)
          "blockquote",
          "figure blockquote",
          "blockquote + cite",
          "blockquote footer",
          // Star rating patterns (emoji or SVG stars)
          ".star-rating",
          "[aria-label*='star']",
          "[aria-label*='rating']",
          "[aria-label*='out of']",
        ];
        let socialProofElements = socialProofSelectors.reduce((acc, sel) => {
          try {
            return acc + document.querySelectorAll(sel).length;
          } catch {
            return acc;
          }
        }, 0);

        // Text-content fallback: scan for quotation marks + attribution patterns
        // A <p> or <div> containing a long quote (>40 chars) followed by "— Name" or "- Name"
        if (socialProofElements === 0) {
          const candidates = Array.from(
            document.querySelectorAll("p, div, section, article"),
          );
          const quotePattern = /[""«].{40,}[""»]/;
          const attributionPattern = /[—\-–]\s+[A-Z][a-z]+/;
          const hasQuotes = candidates.some((el) => {
            const t = el.textContent || "";
            return quotePattern.test(t) || attributionPattern.test(t);
          });
          if (hasQuotes) socialProofElements += 1;
        }

        const testimonials = socialProofElements > 0;

        const popupSelectors = [
          ".modal",
          ".popup",
          "[class*='modal']",
          "[class*='popup']",
          "[role='dialog']",
        ];
        const popupDetected = popupSelectors.some(
          (sel) => document.querySelector(sel) !== null,
        );

        const cookieSelectors = [
          "[class*='cookie']",
          "[id*='cookie']",
          "[class*='gdpr']",
          "[id*='gdpr']",
          "[class*='consent']",
        ];
        const cookieBannerDetected = cookieSelectors.some(
          (sel) => document.querySelector(sel) !== null,
        );

        const chatSelectors = [
          "[class*='chat']",
          "[id*='chat']",
          "[class*='intercom']",
          "[id*='intercom']",
          "[class*='zendesk']",
          ".tawk-min-container",
        ];
        const chatWidgetDetected = chatSelectors.some(
          (sel) => document.querySelector(sel) !== null,
        );

        const videoContent =
          document.querySelectorAll(
            "video, iframe[src*='youtube'], iframe[src*='vimeo']",
          ).length > 0;

        const formsWithoutLabels = forms.filter((form) => {
          const inputs = form.querySelectorAll(
            "input:not([type='hidden']):not([type='submit'])",
          );
          const labels = form.querySelectorAll("label");
          return labels.length < inputs.length;
        }).length;

        const bodyText = document.body?.innerText || "";
        const wordCount = bodyText.split(/\s+/).filter(Boolean).length;
        const bodyStyle = window.getComputedStyle(document.body);
        const fontSize = bodyStyle.fontSize;

        return {
          title: document.title || "",
          metaDescription: getMeta("description"),
          metaKeywords: getMeta("keywords"),
          h1Count: h1Elements.length,
          h1Text: h1Elements
            .map((h) => h.textContent?.trim() || "")
            .slice(0, 3),
          imagesMissingAlt: images.filter((img) => !img.alt).length,
          totalImages: images.length,
          internalLinks,
          externalLinks,
          hasViewport,
          hasCanonical,
          hasOpenGraph: !!document.querySelector("meta[property^='og:']"),
          hasTwitterCard: !!document.querySelector("meta[name^='twitter:']"),
          formCount: forms.length,
          formsWithoutLabels,
          ctaButtons: ctaButtons.length,
          ctaButtonTexts: ctaButtons
            .map((b) => b.textContent?.trim() || "")
            .slice(0, 5),
          resourceCount: scripts.length + styles.length + images.length,
          scriptCount: scripts.length,
          styleCount: styles.length,
          wordCount,
          hasStructuredData: structuredDataScripts.length > 0,
          structuredDataTypes,
          isResponsive: hasViewport,
          popupDetected,
          cookieBannerDetected,
          chatWidgetDetected,
          socialProofElements,
          exitIntentPopup: false,
          videoContent,
          testimonials,
          fontSize,
        };
      });

      // Check robots.txt & sitemap using the same page (reuse browser tab)
      const baseUrl = new URL(url).origin;
      let hasRobots = false;
      let hasSitemap = false;

      try {
        const rRes = await page.goto(`${baseUrl}/robots.txt`, {
          waitUntil: "load",
          timeout: 5000,
        });
        hasRobots = (rRes?.status() || 404) < 400;
      } catch {}

      try {
        const sRes = await page.goto(`${baseUrl}/sitemap.xml`, {
          waitUntil: "load",
          timeout: 5000,
        });
        hasSitemap = (sRes?.status() || 404) < 400;
      } catch {}

      return {
        data: {
          ...data,
          hasSSL,
          hasRobots,
          hasSitemap,
          pageLoadTime,
          consoleErrors: consoleErrors.slice(0, 5),
          securityHeaders,
          brokenLinks: [],
          mobileViewport: data.hasViewport,
          colorContrastIssues: 0,
        },
        screenshot,
      };
    } finally {
      // Always close the page — but NOT the browser (it goes back to pool)
      await page.close().catch(() => {});
    }
  });
}
