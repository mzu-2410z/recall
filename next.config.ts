import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Skip ESLint and TypeScript build errors — they are caught in CI separately
  eslint: { ignoreDuringBuilds: false },
  typescript: { ignoreBuildErrors: false },

  // Treat groq-sdk as a server-only external package
  serverExternalPackages: ['groq-sdk'],

  // Increase static page generation timeout (seconds)
  staticPageGenerationTimeout: 120,
};

export default nextConfig;
