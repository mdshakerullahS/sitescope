import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["puppeteer", "lighthouse"],
  allowedDevOrigins: ["172.28.48.1"],
};

export default nextConfig;
