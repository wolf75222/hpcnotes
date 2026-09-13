import { noteUrl } from "@/lib/site-url";

export function markdownResponse(body: string, slug?: string) {
  const headers = new Headers({
    "Content-Type": "text/markdown; charset=utf-8",
    "Cache-Control": "s-maxage=600, stale-while-revalidate",
    Vary: "Accept",
  });
  headers.append("Link", "</llms.txt>; rel=\"describedby\"; type=\"text/markdown\"");
  if (slug != null) {
    headers.append("Link", `<${noteUrl(slug)}>; rel="canonical"`);
  }
  return new Response(body, { headers });
}
