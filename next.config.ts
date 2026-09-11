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
      { source: "/notes", destination: "/", permanent: false },
      { source: "/blog", destination: "/", permanent: false },
      {
        source: "/blog/:slug",
        destination: "/notes/:slug",
        permanent: false,
      },
      { source: "/wiki", destination: "/", permanent: false },
      { source: "/wiki/:path*", destination: "/", permanent: false },
      { source: "/contribute", destination: "/", permanent: false },
      { source: "/playlists", destination: "/", permanent: false },
      { source: "/playlists/:slug", destination: "/", permanent: false },
      { source: "/search", destination: "/", permanent: false },
      { source: "/tags", destination: "/explore", permanent: false },
      { source: "/years", destination: "/", permanent: false },
      { source: "/about", destination: "/", permanent: false },
      ...getNoteSlugs().map((slug) => ({
        source: `/${slug}`,
        destination: `/notes/${slug}`,
        permanent: false,
      })),
    ];
  },
};

export default nextConfig;
