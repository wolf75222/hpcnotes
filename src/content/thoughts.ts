import type { NoteIndex, ThoughtNode, ThoughtRef } from "./types";

function sortSiblings(a: NoteIndex, b: NoteIndex) {
  return a.order - b.order || a.date.localeCompare(b.date) || a.title.localeCompare(b.title);
}

function latestDate(node: ThoughtNode): string {
  return [node.note.date, ...node.children.map(latestDate)].reduce((a, b) =>
    a > b ? a : b,
  );
}

export function buildThoughtForest(notes: NoteIndex[]): ThoughtNode[] {
  const slugs = new Set(notes.map((note) => note.slug));
  const byParent = new Map<string, NoteIndex[]>();
  const roots: NoteIndex[] = [];

  for (const note of notes) {
    const parent = note.parent;
    if (parent != null && parent !== note.slug && slugs.has(parent)) {
      const siblings = byParent.get(parent) ?? [];
      siblings.push(note);
      byParent.set(parent, siblings);
    } else {
      roots.push(note);
    }
  }

  const visiting = new Set<string>();
  const built = new Map<string, ThoughtNode>();

  function build(note: NoteIndex): ThoughtNode {
    const cached = built.get(note.slug);
    if (cached != null) {
      return cached;
    }
    if (visiting.has(note.slug)) {
      return { note, children: [] };
    }
    visiting.add(note.slug);
    const children = [...(byParent.get(note.slug) ?? [])]
      .sort(sortSiblings)
      .map(build);
    visiting.delete(note.slug);
    const node = { note, children };
    built.set(note.slug, node);
    return node;
  }

  function mark(node: ThoughtNode, placed: Set<string>) {
    placed.add(node.note.slug);
    for (const child of node.children) {
      mark(child, placed);
    }
  }

  const forest: ThoughtNode[] = [];
  const placed = new Set<string>();
  for (const note of [...roots, ...notes]) {
    if (placed.has(note.slug)) {
      continue;
    }
    const node = build(note);
    forest.push(node);
    mark(node, placed);
  }

  return forest.sort((a, b) => latestDate(b).localeCompare(latestDate(a)));
}

export function findThoughtPath(
  forest: ThoughtNode[],
  slug: string,
): ThoughtNode[] | null {
  function walk(node: ThoughtNode, path: ThoughtNode[]): ThoughtNode[] | null {
    const next = [...path, node];
    if (node.note.slug === slug) {
      return next;
    }
    for (const child of node.children) {
      const hit = walk(child, next);
      if (hit != null) {
        return hit;
      }
    }
    return null;
  }

  for (const root of forest) {
    const hit = walk(root, []);
    if (hit != null) {
      return hit;
    }
  }
  return null;
}

export function flattenThoughts(node: ThoughtNode): ThoughtNode[] {
  return [node, ...node.children.flatMap(flattenThoughts)];
}

function nestedLabel(parentLabel: string, index: number) {
  return `${parentLabel}.${index + 1}`;
}

function chapterLabels(children: ThoughtNode[]): string[] {
  const prefaceFirst = children[0]?.note.title === "Preface";
  return children.map((_, index) =>
    prefaceFirst ? String(index) : String(index + 1),
  );
}

export function flattenThoughtRefs(
  node: ThoughtNode,
  depth = 0,
  label = "1",
): ThoughtRef[] {
  return [
    {
      slug: node.note.slug,
      title: node.note.title,
      depth,
      label,
      hasChildren: node.children.length > 0,
    },
    ...node.children.flatMap((child, index) =>
      flattenThoughtRefs(child, depth + 1, nestedLabel(label, index)),
    ),
  ];
}

export function noteContents(path: ThoughtNode[] | null): ThoughtRef[] {
  if (path == null || path.length === 0) {
    return [];
  }
  const root = path[0];
  if (root == null) {
    return [];
  }
  const labels = chapterLabels(root.children);
  if (path.length === 1) {
    return coverContents(root, labels);
  }
  const chapter = path[1];
  if (chapter == null) {
    return [];
  }
  const start: ThoughtRef = {
    slug: root.note.slug,
    title: root.note.title,
    depth: 0,
    label: "Start",
    hasChildren: false,
    isRoot: true,
  };
  const chapterIndex = root.children.findIndex(
    (child) => child.note.slug === chapter.note.slug,
  );
  const chapterLabel = labels[chapterIndex] ?? "1";
  if (chapter.children.length === 0) {
    return [
      start,
      ...root.children.map((child, index) => ({
        slug: child.note.slug,
        title: child.note.title,
        depth: 0,
        label: labels[index] ?? String(index + 1),
        hasChildren: false,
      })),
    ];
  }
  return [start, ...flattenThoughtRefs(chapter, 0, chapterLabel)];
}

function coverContents(root: ThoughtNode, labels: string[]): ThoughtRef[] {
  return root.children.flatMap((child, index) =>
    flattenThoughtRefs(child, 0, labels[index] ?? String(index + 1)),
  );
}

export function defaultExpandedSlugs(
  pages: ThoughtRef[],
  activeSlug?: string,
): string[] {
  if (activeSlug == null) {
    return [];
  }
  const stack: ThoughtRef[] = [];
  for (const page of pages) {
    stack.length = page.depth;
    stack[page.depth] = page;
    if (page.slug !== activeSlug) {
      continue;
    }
    const open = stack
      .slice(0, page.depth)
      .map((ancestor) => ancestor.slug);
    if (page.hasChildren) {
      open.push(page.slug);
    }
    return open;
  }
  return [];
}

export function visibleContents(
  pages: ThoughtRef[],
  expanded: ReadonlySet<string>,
): ThoughtRef[] {
  const openAtDepth: boolean[] = [];
  const visible: ThoughtRef[] = [];
  for (const page of pages) {
    const parentOpen = page.depth === 0 || openAtDepth[page.depth - 1] === true;
    if (!parentOpen) {
      openAtDepth[page.depth] = false;
      continue;
    }
    visible.push(page);
    openAtDepth[page.depth] = page.hasChildren && expanded.has(page.slug);
  }
  return visible;
}

export function thoughtSlugs(node: ThoughtNode): string[] {
  return flattenThoughts(node).map((item) => item.note.slug);
}

export function isNoteDocument(node: ThoughtNode) {
  return node.children.length > 0 || node.note.kind === "note";
}

export function splitHomeLists(forest: ThoughtNode[]) {
  const notes: NoteIndex[] = [];
  const thoughts: NoteIndex[] = [];
  for (const node of forest) {
    if (isNoteDocument(node)) {
      notes.push(node.note);
    } else {
      thoughts.push(node.note);
    }
  }
  return { notes, thoughts };
}

export function thoughtNeighbors(path: ThoughtNode[] | null): {
  previous: NoteIndex | null;
  next: NoteIndex | null;
} {
  if (path == null || path.length === 0) {
    return { previous: null, next: null };
  }
  const root = path[0];
  const current = path[path.length - 1];
  if (root == null || current == null) {
    return { previous: null, next: null };
  }
  const sequence = flattenThoughts(root).map((node) => node.note);
  const index = sequence.findIndex((note) => note.slug === current.note.slug);
  if (index < 0) {
    return { previous: null, next: null };
  }
  return {
    previous: sequence[index - 1] ?? null,
    next: sequence[index + 1] ?? null,
  };
}
