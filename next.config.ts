import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Disable type checking during build/dev for faster startup
    ignoreBuildErrors: false,
  },
  eslint: {
    // Disable ESLint during builds for faster startup
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
