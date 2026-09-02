export const NAV_ITEMS = [
  { id: "notes", href: "/", label: "notes" },
  { id: "playlists", href: "/playlists", label: "playlists" },
  { id: "tags", href: "/tags", label: "tags" },
  { id: "search", href: "/search", label: "search" },
  { id: "about", href: "/about", label: "about" },
] as const;

export type NavItem = (typeof NAV_ITEMS)[number];

export function isNavActive(pathname: string, item: NavItem) {
  switch (item.id) {
    case "notes":
      return (
        pathname === "/" ||
        pathname.startsWith("/notes") ||
        pathname.startsWith("/years")
      );
    case "playlists":
      return pathname.startsWith("/playlists");
    case "tags":
      return pathname.startsWith("/tags");
    case "search":
      return pathname.startsWith("/search");
    case "about":
      return pathname.startsWith("/about");
  }
}
