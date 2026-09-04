import type { Metadata } from "next";
import Script from "next/script";
import { Providers } from "./providers";
import { SiteShell } from "@/components/site-shell";
import { getAdSenseConfig } from "@/lib/ads";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "hpcnotes.eu",
    template: "%s · hpcnotes.eu",
  },
  description:
    "Short notes on high-performance computing: Slurm, MPI, GPUs, I/O, and the habits that transfer between clusters.",
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
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const ads = getAdSenseConfig();

  return (
    <html lang="en" data-theme="light">
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
