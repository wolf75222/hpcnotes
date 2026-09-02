"use client";

import { usePathname } from "next/navigation";
import { Text } from "@astryxdesign/core/Text";
import { HStack, VStack } from "@astryxdesign/core/Stack";
import { Link } from "@astryxdesign/core/Link";
import { List, ListItem } from "@astryxdesign/core/List";
import { NAV_ITEMS, isNavActive } from "@/lib/nav";

export function SiteNav({
  orientation = "vertical",
}: {
  orientation?: "vertical" | "horizontal";
}) {
  const pathname = usePathname();

  if (orientation === "horizontal") {
    return (
      <HStack gap={4} wrap="wrap" align="center">
        {NAV_ITEMS.map((item) => {
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
        })}
      </HStack>
    );
  }

  return (
    <VStack padding={4} paddingBlockStart={8}>
      <List
        density="compact"
        header={<Text type="supporting">hpcnotes.eu</Text>}
      >
        {NAV_ITEMS.map((item) => (
          <ListItem
            key={item.href}
            label={item.label}
            href={item.href}
            isSelected={isNavActive(pathname, item)}
            className={
              isNavActive(pathname, item) ? "site-nav-current" : undefined
            }
          />
        ))}
      </List>
    </VStack>
  );
}
