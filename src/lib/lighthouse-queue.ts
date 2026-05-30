/**
 * LighthouseQueue — serializes Lighthouse runs to prevent Chrome port conflicts.
 *
 * Lighthouse launches its own Chrome instance and binds to a random port.
 * Running two Lighthouse audits simultaneously can cause port collisions and
 * corrupt results. This queue ensures only one Lighthouse run executes at a time
 * while others wait.
 *
 * For higher throughput you can increase LIGHTHOUSE_CONCURRENCY, but each
 * concurrent run needs its own Chrome process (~300MB RAM).
 */

import { LighthouseMetrics } from "@/types";
import { withBrowser } from "./browser-pool";

const LIGHTHOUSE_CONCURRENCY = parseInt(
  process.env.LIGHTHOUSE_CONCURRENCY || "1",
  10,
);

type LighthouseTask = {
  url: string;
  resolve: (result: LighthouseMetrics | null) => void;
  reject: (err: Error) => void;
};

class LighthouseQueue {
  private queue: LighthouseTask[] = [];
  private running = 0;

  enqueue(url: string): Promise<LighthouseMetrics | null> {
    return new Promise((resolve, reject) => {
      this.queue.push({ url, resolve, reject });
      console.log(
        `[LighthouseQueue] Enqueued ${url} (queue depth: ${this.queue.length})`,
      );
      this.drain();
    });
  }

  private drain(): void {
    while (this.running < LIGHTHOUSE_CONCURRENCY && this.queue.length > 0) {
      const task = this.queue.shift()!;
      this.running++;
      console.log(
        `[LighthouseQueue] Starting audit for ${task.url} (running: ${this.running})`,
      );
      this.runAudit(task).finally(() => {
        this.running--;
        console.log(
          `[LighthouseQueue] Finished audit (running: ${this.running}, queued: ${this.queue.length})`,
        );
        this.drain();
      });
    }
  }

  private async runAudit(task: LighthouseTask): Promise<void> {
    try {
      const result = await this.execLighthouse(task.url);
      task.resolve(result);
    } catch (err) {
      console.error(`[LighthouseQueue] Audit failed for ${task.url}:`, err);
      task.resolve(null); // Graceful degradation — don't fail the whole analysis
    }
  }

  private async execLighthouse(url: string): Promise<LighthouseMetrics | null> {
    const { default: lighthouse } = await import("lighthouse");

    return withBrowser(async (browser) => {
      const wsEndpoint = browser.wsEndpoint();
      const port = parseInt(new URL(wsEndpoint).port);

      const options = {
        logLevel: "error" as const,
        output: "json" as const,
        onlyCategories: [
          "performance",
          "accessibility",
          "best-practices",
          "seo",
        ],
        port,
      };

      const runnerResult = await lighthouse(url, options);

      if (!runnerResult?.lhr) return null;

      const lhr = runnerResult.lhr;
      const audits = lhr.audits;

      return {
        fcp: audits["first-contentful-paint"]?.numericValue || 0,
        lcp: audits["largest-contentful-paint"]?.numericValue || 0,
        tbt: audits["total-blocking-time"]?.numericValue || 0,
        cls: audits["cumulative-layout-shift"]?.numericValue || 0,
        tti: audits["interactive"]?.numericValue || 0,
        speedIndex: audits["speed-index"]?.numericValue || 0,
        performanceScore: Math.round(
          (lhr.categories["performance"]?.score || 0) * 100,
        ),
        accessibilityScore: Math.round(
          (lhr.categories["accessibility"]?.score || 0) * 100,
        ),
        seoScore: Math.round((lhr.categories["seo"]?.score || 0) * 100),
        bestPracticesScore: Math.round(
          (lhr.categories["best-practices"]?.score || 0) * 100,
        ),
      };
    });
  }

  get stats() {
    return {
      running: this.running,
      queued: this.queue.length,
    };
  }
}

// Singleton
const lighthouseQueue = new LighthouseQueue();

export function runLighthouse(url: string): Promise<LighthouseMetrics | null> {
  return lighthouseQueue.enqueue(url);
}

export { lighthouseQueue };
