import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION } from "@/lib/site-url";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "hpcnotes: HPC notes and wiki",
    short_name: "hpcnotes",
    description: SITE_DESCRIPTION,
    start_url: "/",
    scope: "/",
    display: "minimal-ui",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
