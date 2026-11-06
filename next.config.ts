import type { NextConfig } from "next";
import { PHASE_PRODUCTION_BUILD } from "next/constants";
import { getNoteSlugs } from "./src/content/load-notes";
import { LEGACY_REDIRECTS, securityHeaders } from "./site-rules.mjs";

// `next dev` serves headers, redirects and the Markdown rewrite itself.
// `next build` is a static export for Cloudflare Pages: those rules are
// written to out/_headers and out/_redirects by scripts/postbuild.mjs.
const devConfig: NextConfig = {
  transpilePackages: ["katex"],
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  devIndicators: false,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // Only /media/* goes through the optimizer. A wildcard remotePatterns
    // turned /_next/image into an open proxy for any HTTPS image on the web.
    localPatterns: [{ pathname: "/media/**", search: "" }],
    remotePatterns: [],
    dangerouslyAllowSVG: false,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders({ dev: true }),
      },
    ];
  },
  async redirects() {
    return [
      ...LEGACY_REDIRECTS.map(([source, destination]) => ({
        source,
        destination,
        permanent: true,
      })),
      { source: "/wiki/:path*", destination: "/", permanent: true },
      ...getNoteSlugs().map((slug) => ({
        source: `/${slug}`,
        destination: `/notes/${slug}`,
        permanent: true,
      })),
    ];
  },
  async rewrites() {
    return [
      {
        source: "/notes/:slug.md",
        destination: "/notes/md/:slug",
      },
      {
        source: "/notes/:slug",
        destination: "/notes/md/:slug",
        has: [
          {
            type: "header",
            key: "accept",
            value: "(.*)text/markdown(.*)",
          },
        ],
      },
    ];
  },
};

const exportConfig: NextConfig = {
  transpilePackages: devConfig.transpilePackages,
  devIndicators: false,
  poweredByHeader: false,
  output: "export",
  // No image server on a static host: /media files ship as they are.
  images: { unoptimized: true },
};

export default function config(phase: string): NextConfig {
  return phase === PHASE_PRODUCTION_BUILD ? exportConfig : devConfig;
}
