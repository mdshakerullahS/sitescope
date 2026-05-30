/**
 * BrowserPool — manages a fixed set of reusable Puppeteer browser instances.
 *
 * Instead of spawning a new Chrome process per request (which crashes under load),
 * this pool keeps N browsers alive and lends a page to each request.
 * When all browsers are busy, incoming requests wait in a queue.
 */

import puppeteer, { Browser } from "puppeteer";

const CHROME_PATH = process.env.CHROME_PATH || undefined;

const CHROME_ARGS = [
  "--disable-dev-shm-usage",
  "--disable-gpu",
  "--no-first-run",
  "--disable-extensions",
  "--disable-background-networking",
  "--disable-default-apps",
  "--mute-audio",
  // Linux-only flags — safe to include, ignored on Windows/macOS
  ...(process.platform === "linux"
    ? ["--no-sandbox", "--disable-setuid-sandbox", "--single-process"]
    : []),
];

// Max concurrent browser instances. Keep low to avoid OOM.
// Rule of thumb: ~300MB RAM per browser. 3 = ~1GB.
const POOL_SIZE = parseInt(process.env.BROWSER_POOL_SIZE || "3", 10);

interface PoolSlot {
  browser: Browser;
  busy: boolean;
}

type QueuedTask = {
  resolve: (slot: PoolSlot) => void;
  reject: (err: Error) => void;
};

class BrowserPool {
  private slots: PoolSlot[] = [];
  private queue: QueuedTask[] = [];
  private initialized = false;
  private initializing = false;

  async init(): Promise<void> {
    if (this.initialized || this.initializing) return;
    this.initializing = true;

    console.log(`[BrowserPool] Initializing ${POOL_SIZE} browser(s)…`);

    const launches = Array.from({ length: POOL_SIZE }, () =>
      puppeteer
        .launch({
          executablePath: CHROME_PATH,
          headless: true,
          args: CHROME_ARGS,
        })
        .then((browser) => {
          // Auto-remove slot if browser crashes unexpectedly
          browser.on("disconnected", () => {
            console.warn("[BrowserPool] Browser disconnected, removing slot");
            this.slots = this.slots.filter((s) => s.browser !== browser);
            // Spawn a replacement
            this.spawnReplacement();
          });
          return { browser, busy: false } as PoolSlot;
        }),
    );

    this.slots = await Promise.all(launches);
    this.initialized = true;
    this.initializing = false;
    console.log(`[BrowserPool] Ready with ${this.slots.length} browser(s)`);
  }

  private async spawnReplacement(): Promise<void> {
    try {
      const browser = await puppeteer.launch({
        executablePath: CHROME_PATH,
        headless: true,
        args: CHROME_ARGS,
      });
      const slot: PoolSlot = { browser, busy: false };
      browser.on("disconnected", () => {
        this.slots = this.slots.filter((s) => s.browser !== browser);
        this.spawnReplacement();
      });
      this.slots.push(slot);
      console.log(
        `[BrowserPool] Replacement browser ready (pool size: ${this.slots.length})`,
      );
      this.dispatchQueue();
    } catch (err) {
      console.error("[BrowserPool] Failed to spawn replacement browser:", err);
    }
  }

  /** Acquire a free browser slot. Queues the caller if all slots are busy. */
  acquire(): Promise<PoolSlot> {
    return new Promise((resolve, reject) => {
      const free = this.slots.find((s) => !s.busy);
      if (free) {
        free.busy = true;
        resolve(free);
      } else {
        // Queue position logging
        const pos = this.queue.length + 1;
        console.log(
          `[BrowserPool] All browsers busy — queuing request (position ${pos})`,
        );
        this.queue.push({ resolve, reject });
      }
    });
  }

  /** Release a slot back to the pool and dispatch the next queued request. */
  release(slot: PoolSlot): void {
    slot.busy = false;
    this.dispatchQueue();
  }

  private dispatchQueue(): void {
    if (this.queue.length === 0) return;
    const free = this.slots.find((s) => !s.busy);
    if (!free) return;
    const next = this.queue.shift()!;
    free.busy = true;
    console.log(
      `[BrowserPool] Dispatching queued request (${this.queue.length} remaining)`,
    );
    next.resolve(free);
  }

  get stats() {
    return {
      total: this.slots.length,
      busy: this.slots.filter((s) => s.busy).length,
      free: this.slots.filter((s) => !s.busy).length,
      queued: this.queue.length,
    };
  }
}

// Singleton — shared across all API route invocations in the same process
const pool = new BrowserPool();

/**
 * Run a function with a browser from the pool.
 * The browser slot is always released after fn completes (success or error).
 */
export async function withBrowser<T>(
  fn: (browser: Browser) => Promise<T>,
): Promise<T> {
  // Lazy-init pool on first request
  if (!pool["initialized"]) await pool.init();

  const slot = await pool.acquire();
  console.log(`[BrowserPool] Slot acquired — stats:`, pool.stats);

  try {
    return await fn(slot.browser);
  } finally {
    pool.release(slot);
    console.log(`[BrowserPool] Slot released — stats:`, pool.stats);
  }
}

export { pool };
