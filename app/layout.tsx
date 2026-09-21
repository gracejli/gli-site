import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import AppShell from "@/components/AppShell";
import "@/app/styling/globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gracejli.com";

const title = "grace li";
const description =
  "tinkerer in los angeles, from a small town in michigan. welcome to my internet room.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    title,
    description,
    url: "/",
    siteName: title,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen w-full overflow-x-hidden font-serif">
        <AppShell>{children}</AppShell>
        <Analytics />
      </body>
    </html>
  );
}
