import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "d2w9rnfcy7mm78.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "images.are.na",
      },
    ],
  },
  // Bundle postcard font into the send API so serverless can outline text.
  outputFileTracingIncludes: {
    "/api/posty/send": ["./fonts/**/*"],
  },
};

export default nextConfig;
