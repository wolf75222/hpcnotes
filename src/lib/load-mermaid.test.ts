import { describe, expect, it } from "vitest";
import { prepareMermaidSvg } from "./load-mermaid";

describe("prepareMermaidSvg", () => {
  it("sizes the root svg from its viewBox and leaves inner rects alone", () => {
    const svg =
      '<svg id="m" viewBox="-8 -8 600 240" style="max-width: 600px;" role="img"><rect width="150" height="65"/></svg>';
    const out = prepareMermaidSvg(svg);
    expect(out).toMatch(/^<svg width="600" height="240" xmlns="http:\/\/www.w3.org\/2000\/svg"/);
    expect(out).toContain('<rect width="150" height="65"/>');
    expect(out).not.toContain("max-width: 600px");
  });

  it("replaces existing root width/height", () => {
    const out = prepareMermaidSvg('<svg width="100%" height="1" viewBox="0 0 10 20"><g/></svg>');
    expect(out.startsWith('<svg width="10" height="20"')).toBe(true);
    expect(out.match(/width=/g)).toHaveLength(2);
  });
});
