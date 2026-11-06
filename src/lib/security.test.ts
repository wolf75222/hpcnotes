import { describe, expect, it } from "vitest";
import { markdownLinkProps } from "./markdown-href";
import {
  isCompressibleRasterSrc,
  isSafeLocalMediaSrc,
  isSafeRemoteMediaSrc,
} from "./media";
import { serializeJsonLd } from "./json-ld";
import { isNoteSlug, isSafeTag } from "./slugs";

describe("markdownLinkProps", () => {
  it.each([
    "javascript:alert(1)",
    " JaVaScRiPt:alert(1)",
    "java\u0000script:alert(1)",
    "data:text/html,<script>",
    "vbscript:x",
    "",
  ])("drops %j", (href) => {
    expect(markdownLinkProps(href)).toBeNull();
  });

  it("keeps local paths and anchors", () => {
    expect(markdownLinkProps("/notes/x")).toEqual({ href: "/notes/x" });
    expect(markdownLinkProps("#part")).toEqual({ href: "#part" });
  });

  it("opens other origins in a new tab without opener", () => {
    expect(markdownLinkProps("https://example.org/a")).toEqual({
      href: "https://example.org/a",
      target: "_blank",
      rel: "noopener noreferrer",
    });
  });

  it("treats protocol-relative URLs as external", () => {
    expect(markdownLinkProps("//evil.example/x")?.target).toBe("_blank");
  });
});

describe("media", () => {
  it("accepts plain /media paths only", () => {
    expect(isSafeLocalMediaSrc("/media/ranks.png")).toBe(true);
    expect(isSafeLocalMediaSrc("/media/../secret.png")).toBe(false);
    expect(isSafeLocalMediaSrc("/media/a%2e%2e/x.png")).toBe(false);
    expect(isSafeLocalMediaSrc("/etc/passwd")).toBe(false);
  });

  it("rejects remote media on private or credentialed hosts", () => {
    expect(isSafeRemoteMediaSrc("https://example.org/a.png")).toBe(true);
    expect(isSafeRemoteMediaSrc("http://example.org/a.png")).toBe(false);
    expect(isSafeRemoteMediaSrc("https://u:p@example.org/a.png")).toBe(false);
    expect(isSafeRemoteMediaSrc("https://127.0.0.1/a.png")).toBe(false);
    expect(isSafeRemoteMediaSrc("https://10.0.0.4/a.png")).toBe(false);
    expect(isSafeRemoteMediaSrc("https://169.254.169.254/a.png")).toBe(false);
    expect(isSafeRemoteMediaSrc("https://[::1]/a.png")).toBe(false);
    expect(isSafeRemoteMediaSrc("https://example.org/a.html")).toBe(false);
  });

  it("only sends local stills through the image optimizer", () => {
    expect(isCompressibleRasterSrc("/media/ranks.png")).toBe(true);
    expect(isCompressibleRasterSrc("/media/heartbeat.gif")).toBe(false);
    expect(isCompressibleRasterSrc("https://example.org/a.png")).toBe(false);
  });
});

describe("serializeJsonLd", () => {
  it("cannot close the script tag", () => {
    const out = serializeJsonLd({ title: "</script><script>alert(1)</script>" });
    expect(out).not.toContain("</script>");
    expect(JSON.parse(out).title).toBe("</script><script>alert(1)</script>");
  });
});

describe("slugs", () => {
  it("rejects traversal and odd characters", () => {
    expect(isNoteSlug("ok-slug-1")).toBe(true);
    expect(isNoteSlug("../x")).toBe(false);
    expect(isNoteSlug("A")).toBe(false);
    expect(isNoteSlug("a--b")).toBe(false);
    expect(isSafeTag("mpi")).toBe(true);
    expect(isSafeTag("<b>")).toBe(false);
  });
});
