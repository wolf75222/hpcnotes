import type { NextConfig } from "next";
import { getNoteSlugs } from "./src/content/load-notes";

const isDev = process.env.NODE_ENV !== "production";
const hasAds = /^ca-pub-\d{8,22}$/.test(
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() ?? "",
);

// Static pages cannot carry a per-request nonce, so scripts stay on
// 'self' + 'unsafe-inline' (Next's hydration payload is inline). The other
// directives still shut the doors that matter: no plugins, no <base>
// hijack, no framing, no form posts elsewhere, no mixed content.
const adHosts = hasAds
  ? " https://pagead2.googlesyndication.com https://*.googlesyndication.com https://*.doubleclick.net https://*.google.com https://*.gstatic.com https://*.adtrafficquality.google"
  : "";

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}${adHosts}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "media-src 'self' https:",
  "font-src 'self' data:",
  `connect-src 'self'${isDev ? " ws: wss:" : ""}${adHosts}`,
  `frame-src ${hasAds ? adHosts.trim() : "'none'"}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "manifest-src 'self'",
  "worker-src 'self' blob:",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=(), browsing-topics=()",
  },
  ...(isDev
    ? []
    : [
        {
          key: "Strict-Transport-Security",
          value: "max-age=31536000",
        },
      ]),
];

const nextConfig: NextConfig = {
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
