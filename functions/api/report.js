// Cloudflare Pages Function: POST /api/report
// Receives browser CSP violation reports and client-side JS errors, and
// writes a short, sanitized line to the Functions logs (dashboard:
// Workers & Pages -> hpcnotes -> Functions -> Real-time logs).
// Free plan: 100k invocations/day; beyond that requests fail, nothing is billed.

const MAX_BODY = 8 * 1024;
const SAME_SITE = /^https:\/\/(hpcnotes\.eu|www\.hpcnotes\.eu|[a-z0-9-]+\.hpcnotes\.pages\.dev|hpcnotes\.pages\.dev)$/;

function clip(value, max = 300) {
  return typeof value === "string" ? value.slice(0, max) : undefined;
}

function summarize(body) {
  // Legacy CSP report: { "csp-report": {...} }
  if (body && typeof body === "object" && body["csp-report"]) {
    const r = body["csp-report"];
    return {
      kind: "csp",
      page: clip(r["document-uri"]),
      directive: clip(r["violated-directive"] ?? r["effective-directive"]),
      blocked: clip(r["blocked-uri"]),
    };
  }
  // Reporting API: [{ type: "csp-violation", body: {...} }]
  if (Array.isArray(body)) {
    return body.slice(0, 5).map((r) => ({
      kind: clip(r?.type, 40),
      page: clip(r?.url ?? r?.body?.documentURL),
      directive: clip(r?.body?.effectiveDirective),
      blocked: clip(r?.body?.blockedURL),
    }));
  }
  // Our own client error beacon.
  if (body && typeof body === "object" && body.kind === "js-error") {
    return {
      kind: "js-error",
      page: clip(body.page),
      message: clip(body.message, 500),
      source: clip(body.source),
      line: Number.isFinite(body.line) ? body.line : undefined,
    };
  }
  return null;
}

export async function onRequestPost({ request }) {
  const origin = request.headers.get("Origin");
  if (origin != null && !SAME_SITE.test(origin)) {
    return new Response(null, { status: 403 });
  }
  const length = Number(request.headers.get("Content-Length") ?? "0");
  if (length > MAX_BODY) {
    return new Response(null, { status: 413 });
  }
  const text = (await request.text()).slice(0, MAX_BODY);
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    return new Response(null, { status: 400 });
  }
  const summary = summarize(body);
  if (summary == null) {
    return new Response(null, { status: 400 });
  }
  console.log(JSON.stringify({ report: summary, ua: clip(request.headers.get("User-Agent"), 120) }));
  return new Response(null, { status: 204 });
}

export function onRequest() {
  return new Response(null, { status: 405, headers: { Allow: "POST" } });
}
