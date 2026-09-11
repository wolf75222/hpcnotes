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

export function flattenThoughtRefs(node: ThoughtNode, depth = 0): ThoughtRef[] {
  return [
    { slug: node.note.slug, title: node.note.title, depth },
    ...node.children.flatMap((child) => flattenThoughtRefs(child, depth + 1)),
  ];
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
  if (path == null || path.length < 2) {
    return { previous: null, next: null };
  }
  const parent = path[path.length - 2];
  const current = path[path.length - 1];
  if (parent == null || current == null) {
    return { previous: null, next: null };
  }
  const index = parent.children.findIndex(
    (node) => node.note.slug === current.note.slug,
  );
  if (index < 0) {
    return { previous: null, next: null };
  }
  const previous =
    index === 0 ? parent.note : (parent.children[index - 1]?.note ?? null);
  const next = parent.children[index + 1]?.note ?? null;
  return { previous, next };
}
