import { noteUrl } from "@/lib/site-url";

export function markdownResponse(body: string, slug?: string) {
  const links = ['</llms.txt>; rel="describedby"; type="text/markdown"'];
  if (slug != null) {
    links.unshift(`<${noteUrl(slug)}>; rel="canonical"`);
  }
  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "s-maxage=600, stale-while-revalidate",
      Vary: "Accept",
      Link: links.join(", "),
    },
  });
}
