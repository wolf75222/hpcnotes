"use client";

import { usePathname } from "next/navigation";
import { Link } from "@astryxdesign/core/Link";
import { Text } from "@astryxdesign/core/Text";
import { HStack, VStack } from "@astryxdesign/core/Stack";
import { NAV_ITEMS, isNavActive } from "@/lib/nav";

export function SiteNav({
  orientation = "vertical",
}: {
  orientation?: "vertical" | "horizontal";
}) {
  const pathname = usePathname();
  const links = NAV_ITEMS.map((item) => {
    const active = isNavActive(pathname, item);
    return (
      <Link
        key={item.href}
        href={item.href}
        isStandalone
        color={active ? "primary" : "secondary"}
        weight={active ? "semibold" : "normal"}
        className={active ? "site-nav-current" : undefined}
        aria-current={active ? "page" : undefined}
      >
        {item.label}
      </Link>
    );
  });

  if (orientation === "horizontal") {
    return (
      <HStack gap={4} wrap="wrap" align="center">
        {links}
      </HStack>
    );
  }

  return (
    <VStack gap={8} padding={4} paddingBlockStart={8}>
      <Text type="supporting">hpcnotes.eu</Text>
      <VStack gap={2}>{links}</VStack>
    </VStack>
  );
}
