import type { NextConfig } from "next";
import { getNoteSlugs } from "./src/content/load-notes";

const nextConfig: NextConfig = {
  transpilePackages: ["katex"],
  allowedDevOrigins: ["127.0.0.1", "localhost"],
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
      ...getNoteSlugs().map((slug) => ({
        source: `/${slug}`,
        destination: `/notes/${slug}`,
        permanent: false,
      })),
    ];
  },
};

export default nextConfig;
