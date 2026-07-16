import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gracejli.com";

export const metadata: Metadata = {
  title: "posty",
  description: "send someone a digital postcard",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "posty",
    description: "send someone a digital postcard",
    url: "/posty",
    siteName: "posty",
    images: [
      {
        url: "/images/posty/og.jpg",
        width: 1200,
        height: 630,
        alt: "posty — send a digital postcard",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "posty",
    description: "send someone a digital postcard",
    images: ["/images/posty/og.jpg"],
  },
};

export default function PostyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
