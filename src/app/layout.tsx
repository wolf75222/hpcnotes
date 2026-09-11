import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Source_Sans_3 } from "next/font/google";
import { Providers } from "./providers";
import { SiteShell } from "@/components/site-shell";
import { getAdSenseConfig } from "@/lib/ads";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const sans = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const site = getSiteUrl();
const description =
  "Short notes on high-performance computing, and personal thoughts around HPC.";

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: {
    default: "hpcnotes.eu",
    template: "%s · hpcnotes.eu",
  },
  description,
  applicationName: "hpcnotes.eu",
  keywords: [
    "HPC",
    "high-performance computing",
    "Slurm",
    "MPI",
    "GPU",
    "notes",
    "cluster",
  ],
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: site,
    siteName: "hpcnotes.eu",
    title: "hpcnotes.eu",
    description,
  },
  twitter: {
    card: "summary",
    title: "hpcnotes.eu",
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
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
