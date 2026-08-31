import type { Metadata } from "next";
import { Figtree, IBM_Plex_Mono } from "next/font/google";
import Script from "next/script";
import { Providers } from "./providers";
import { SiteShell } from "@/components/site-shell";
import { getAdSenseConfig } from "@/lib/ads";
import "./globals.css";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-hpc-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-hpc-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "HPC Wiki",
    template: "%s · HPC Wiki",
  },
  description:
    "A modern wiki and blog for site-independent high-performance computing: batch systems, MPI, GPUs, and the practice that transfers between clusters.",
  applicationName: "HPC Wiki",
  keywords: [
    "HPC",
    "high-performance computing",
    "Slurm",
    "MPI",
    "GPU",
    "wiki",
    "cluster",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const ads = getAdSenseConfig();

  return (
    <html
      lang="en"
      className={`${figtree.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
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
