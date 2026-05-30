import { NextResponse } from "next/server";
import { pool } from "@/lib/browser-pool";
import { lighthouseQueue } from "@/lib/lighthouse-queue";

/**
 * GET /api/status
 * Returns real-time pool and queue stats — useful for monitoring and the UI queue indicator.
 */
export async function GET() {
  return NextResponse.json({
    browserPool: pool.stats,
    lighthouseQueue: lighthouseQueue.stats,
    timestamp: new Date().toISOString(),
  });
}
