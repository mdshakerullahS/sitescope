import { NextRequest, NextResponse } from "next/server";
import { scanWithPuppeteer } from "@/lib/puppeteer-scanner";
import { runLighthouse } from "@/lib/lighthouse-queue";
import {
  runCustomRules,
  calculateScores,
  generateSummary,
} from "@/lib/custom-rules";
import { pool } from "@/lib/browser-pool";
import { lighthouseQueue } from "@/lib/lighthouse-queue";
import { AnalysisResult } from "@/types";
import { redis } from "@/lib/redis";

function normalizeUrl(raw: string): string {
  let url = raw.trim();
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
  return url;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawUrl = body?.url;
    if (!rawUrl) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const url = normalizeUrl(rawUrl);
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 },
      );
    }

    const cachedResult = await redis.get<AnalysisResult>(url);
    if (cachedResult) return NextResponse.json(cachedResult);

    // Log queue state on every incoming request
    console.log(`[analyze] Incoming request for ${url}`, {
      browser: pool.stats,
      lighthouse: lighthouseQueue.stats,
    });

    // Puppeteer (uses browser pool — concurrent-safe)
    const { data: puppeteerData, screenshot } = await scanWithPuppeteer(url);

    // Lighthouse (uses queue — serialized to prevent port conflicts)
    const lighthouseData = await runLighthouse(url);

    // Custom rules + scoring (pure CPU, no concurrency issues)
    const issues = runCustomRules(puppeteerData, lighthouseData);
    const scores = calculateScores(issues, lighthouseData);
    const { summary, topWins } = generateSummary(scores, issues);

    const result: AnalysisResult = {
      url,
      analyzedAt: new Date().toISOString(),
      screenshot,
      puppeteer: puppeteerData,
      lighthouse: lighthouseData,
      issues,
      scores,
      summary,
      topWins,
    };

    await redis.set<AnalysisResult>(url, result, 300);

    return NextResponse.json(result);
  } catch (err: unknown) {
    console.error("Analysis error:", err);
    const message = err instanceof Error ? err.message : "Analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
