import type { Metadata } from "next";
import Script from "next/script";
import { Providers } from "./providers";
import { SiteShell } from "@/components/site-shell";
import { getAdSenseConfig } from "@/lib/ads";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "HPC Wiki",
    template: "%s · HPC Wiki",
  },
  description:
    "A small blog of site-independent notes on high-performance computing: Slurm, MPI, GPUs, and the habits that transfer between clusters.",
  applicationName: "HPC Wiki",
  keywords: [
    "HPC",
    "high-performance computing",
    "Slurm",
    "MPI",
    "GPU",
    "blog",
    "cluster",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const ads = getAdSenseConfig();

  return (
    <html lang="en">
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
