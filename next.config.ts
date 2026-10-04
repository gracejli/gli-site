import type { NextConfig } from "next";
import { GUESTBOOK_EXTERNAL_URL } from "./content/backgroundVideos";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/guestbook",
        destination: GUESTBOOK_EXTERNAL_URL,
        permanent: false,
      },
      {
        source: "/portfolio",
        destination: "https://gli.cargo.site/portfolio",
        permanent: true,
      },
      {
        source: "/library",
        destination: "/bookshelf",
        permanent: true,
      },
    ];
  },
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
      {
        protocol: "https",
        hostname: "covers.openlibrary.org",
      },
    ],
  },
  // Bundle postcard font into the send API so serverless can outline text.
  outputFileTracingIncludes: {
    "/api/posty/send": ["./fonts/**/*"],
  },
};

export default nextConfig;
