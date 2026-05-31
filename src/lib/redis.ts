import Redis from "ioredis";

export const ioredis = new Redis("redis://redis:6379");

export const redis = {
  async set<T>(
    key: string,
    value: T,
    exSeconds: number = 300,
  ): Promise<T | "OK" | null | void> {
    try {
      const stringValue = JSON.stringify(value);
      return await ioredis!.set(key, stringValue, "EX", exSeconds);
    } catch (error) {
      console.error("Redis SET error:", error);
    }
  },

  async get<T>(key: string): Promise<T | null | void> {
    try {
      const data = await ioredis!.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Redis GET error:", error);
    }
  },
};
