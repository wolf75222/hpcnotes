import type { NextConfig } from "next";
import { getNoteSlugs } from "./src/content/load-notes";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  transpilePackages: ["katex"],
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  devIndicators: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      { source: "/notes", destination: "/", permanent: true },
      { source: "/blog", destination: "/", permanent: true },
      {
        source: "/blog/:slug",
        destination: "/notes/:slug",
        permanent: true,
      },
      { source: "/wiki", destination: "/", permanent: true },
      { source: "/wiki/:path*", destination: "/", permanent: true },
      { source: "/contribute", destination: "/", permanent: true },
      { source: "/playlists", destination: "/", permanent: true },
      { source: "/playlists/:slug", destination: "/", permanent: true },
      { source: "/search", destination: "/", permanent: true },
      { source: "/tags", destination: "/explore", permanent: true },
      { source: "/years", destination: "/", permanent: true },
      { source: "/about", destination: "/", permanent: true },
      {
        source: "/privacy-policy",
        destination: "/privacy",
        permanent: true,
      },
      {
        source: "/terms-and-conditions",
        destination: "/terms",
        permanent: true,
      },
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

export default nextConfig;
