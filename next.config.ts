import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/blog", destination: "/", permanent: false },
      { source: "/blog/:slug", destination: "/:slug", permanent: false },
      { source: "/wiki", destination: "/", permanent: false },
      { source: "/wiki/:path*", destination: "/", permanent: false },
      { source: "/search", destination: "/", permanent: false },
      { source: "/contribute", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
