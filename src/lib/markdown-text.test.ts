import { describe, expect, it } from "vitest";
import {
  linkedNoteSlugs,
  markdownPlainText,
  referencedMedia,
  resolveWikiLinks,
} from "./markdown-text";
import { liftDisplayMath } from "./lift-display-math";

const known = new Map([["slurm", { title: "Slurm jobs" }]]);
const lookup = (slug: string) => known.get(slug);

describe("resolveWikiLinks", () => {
  it("links known notes with their title or a label", () => {
    expect(resolveWikiLinks("see [[slurm]].", lookup)).toBe(
      "see [Slurm jobs](/notes/slurm).",
    );
    expect(resolveWikiLinks("[[slurm#arrays|arrays]]", lookup)).toBe(
      "[arrays](/notes/slurm#arrays)",
    );
  });

  it("renders unknown targets as text, not dead links", () => {
    expect(resolveWikiLinks("[[nope|Nope]]", lookup)).toBe("Nope");
  });

  it("leaves code alone", () => {
    const src = "`[[slurm]]`\n```\n[[slurm]]\n```";
    expect(resolveWikiLinks(src, lookup)).toBe(src);
  });

});

describe("linkedNoteSlugs", () => {
  it("finds markdown and wiki links, not ones in code", () => {
    const src =
      "[a](/notes/one) [b](/notes/two.md#x) [[three|3]] `[c](/notes/four)`";
    expect(linkedNoteSlugs(src).sort()).toEqual(["one", "three", "two"]);
  });
});

describe("referencedMedia", () => {
  it("lists /media paths", () => {
    expect(referencedMedia("![x](/media/a.png) ![y](https://e.org/b.png)")).toEqual([
      "/media/a.png",
    ]);
  });
});

describe("markdownPlainText", () => {
  it("strips syntax but keeps words and code", () => {
    const text = markdownPlainText("# Title\n\n**bold** [link](/x)\n```c\nint x;\n```");
    expect(text).toBe("Title bold link int x;");
  });
});

describe("liftDisplayMath", () => {
  it("turns $$ blocks into math fences outside code", () => {
    expect(liftDisplayMath("a $$x^2$$ b")).toContain("```math\nx^2\n```");
    expect(liftDisplayMath("`$$x$$`")).toBe("`$$x$$`");
  });
});
