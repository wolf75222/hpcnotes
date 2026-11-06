// HTTP rules shared by `next dev` (next.config.ts) and the static export
// (scripts/postbuild.mjs writes them to out/_headers and out/_redirects
// for Cloudflare Pages). Plain JS so both can import it.

const AD_HOSTS = [
  "https://pagead2.googlesyndication.com",
  "https://*.googlesyndication.com",
  "https://*.doubleclick.net",
  "https://*.google.com",
  "https://*.gstatic.com",
  "https://*.adtrafficquality.google",
];

export function hasAdSense(env = process.env) {
  return /^ca-pub-\d{8,22}$/.test(env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() ?? "");
}

/**
 * Static pages cannot carry a per-request nonce, so scripts stay on
 * 'self' + 'unsafe-inline' (Next's hydration payload is inline). The other
 * directives still shut the doors that matter: no plugins, no <base>
 * hijack, no framing, no form posts elsewhere, no mixed content.
 */
export function securityHeaders({ dev = false, ads = hasAdSense() } = {}) {
  const adHosts = ads ? ` ${AD_HOSTS.join(" ")}` : "";
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""}${adHosts}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "media-src 'self' https:",
    "font-src 'self' data:",
    `connect-src 'self'${dev ? " ws: wss:" : ""}${adHosts}`,
    `frame-src ${ads ? adHosts.trim() : "'none'"}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "manifest-src 'self'",
    "worker-src 'self' blob:",
    ...(dev ? [] : ["upgrade-insecure-requests"]),
  ].join("; ");

  return [
    { key: "Content-Security-Policy", value: csp },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
    {
      key: "Permissions-Policy",
      value:
        "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=(), browsing-topics=()",
    },
    ...(dev ? [] : [{ key: "Strict-Transport-Security", value: "max-age=31536000" }]),
  ];
}

/** Old URLs kept alive. `:slug` and `*` work in both Next and Cloudflare. */
export const LEGACY_REDIRECTS = [
  ["/notes", "/"],
  ["/blog", "/"],
  ["/blog/:slug", "/notes/:slug"],
  ["/wiki", "/"],
  ["/contribute", "/"],
  ["/playlists", "/"],
  ["/playlists/:slug", "/"],
  ["/search", "/"],
  ["/tags", "/explore"],
  ["/years", "/"],
  ["/about", "/"],
  ["/privacy-policy", "/privacy"],
  ["/terms-and-conditions", "/terms"],
];
