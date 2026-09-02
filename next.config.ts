import type { NextConfig } from "next";

const NOTE_SLUGS = [
  "site-independent-hpc-docs",
  "slurm-jobs-that-finish",
  "measure-before-you-optimize",
  "first-gpu-kernel",
  "login-nodes-are-not-compute",
  "modules-are-a-contract",
];

const nextConfig: NextConfig = {
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
      ...NOTE_SLUGS.map((slug) => ({
        source: `/${slug}`,
        destination: `/notes/${slug}`,
        permanent: false,
      })),
    ];
  },
};

export default nextConfig;
