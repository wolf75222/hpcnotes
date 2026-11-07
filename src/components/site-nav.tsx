"use client";

import { usePathname } from "next/navigation";
import { Link } from "@astryxdesign/core/Link";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/Stack";

export interface NavItem {
  slug: string;
  title: string;
  children: NavItem[];
}

export interface SiteNavData {
  notes: NavItem[];
  thoughts: NavItem[];
}

function contains(item: NavItem, slug: string): boolean {
  return item.slug === slug || item.children.some((child) => contains(child, slug));
}

function NavRows({
  items,
  current,
  depth,
}: {
  items: NavItem[];
  current: string | null;
  depth: number;
}) {
  return (
    <VStack gap={0} as="ul" className="site-nav-list" data-depth={depth}>
      {items.map((item) => {
        const isCurrent = item.slug === current;
        // Open the branch the reader is in; the rest stays one line each.
        const open =
          item.children.length > 0 && current != null && contains(item, current);
        return (
          <li
            key={item.slug}
            className="site-nav-item"
            data-current={isCurrent ? "" : undefined}
            data-open={open ? "" : undefined}
          >
            <Link
              href={`/notes/${item.slug}`}
              color={isCurrent ? "primary" : "secondary"}
              type="supporting"
              isStandalone
              hasUnderline={false}
              aria-current={isCurrent ? "page" : undefined}
            >
              {item.title}
            </Link>
            {open ? (
              <NavRows items={item.children} current={current} depth={depth + 1} />
            ) : null}
          </li>
        );
      })}
    </VStack>
  );
}

function NavGroup({
  label,
  items,
  current,
}: {
  label: string;
  items: NavItem[];
  current: string | null;
}) {
  if (items.length === 0) {
    return null;
  }
  return (
    <VStack gap={2}>
      <Text type="supporting" color="secondary">
        <span className="home-group">{label}</span>
      </Text>
      <NavRows items={items} current={current} depth={0} />
    </VStack>
  );
}

/** Left sidebar on wide screens: every note and thought, current branch open. */
export function SiteNav({ data }: { data: SiteNavData }) {
  const pathname = usePathname();
  const match = /^\/notes\/([^/.]+)$/.exec(pathname ?? "");
  const current = match?.[1] ?? null;

  return (
    // The home page already is this list: keep the column in place but
    // leave the sidebar empty there.
    <VStack
      gap={8}
      as="nav"
      aria-label="Site"
      className="site-nav"
      aria-hidden={pathname === "/" ? true : undefined}
      data-home={pathname === "/" ? "" : undefined}
    >
      <NavGroup label="Notes" items={data.notes} current={current} />
      <NavGroup label="Thoughts" items={data.thoughts} current={current} />
    </VStack>
  );
}
