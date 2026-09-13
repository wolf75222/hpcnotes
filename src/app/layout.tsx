import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Providers } from "./providers";
import { sans } from "./sans";
import { SiteShell } from "@/components/site-shell";
import { getAdSenseConfig } from "@/lib/ads";
import { SITE_DESCRIPTION, SITE_NAME, getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const site = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "hpcnotes", url: site }],
  creator: "hpcnotes",
  publisher: SITE_NAME,
  category: "technology",
  keywords: [
    "HPC",
    "high-performance computing",
    "Slurm",
    "MPI",
    "GPU",
    "cluster",
    "notes",
  ],
  alternates: {
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: site,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const ads = getAdSenseConfig();

  return (
    <html lang="en" data-theme="light" className={sans.variable}>
      <body>
        <Providers>
          <SiteShell>{children}</SiteShell>
        </Providers>
        {ads.client ? (
          <Script
            id="adsense"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ads.client}`}
            strategy="afterInteractive"
            crossOrigin="anonymous"
          />
        ) : null}
      </body>
    </html>
  );
}
