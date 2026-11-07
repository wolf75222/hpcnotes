"use client";

import { useEffect, type ComponentType, type SVGProps } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@astryxdesign/core/Icon";
import { Link } from "@astryxdesign/core/Link";
import { HStack } from "@astryxdesign/core/Stack";
import { CoverMark, TurnNextMark, TurnPrevMark } from "@/components/paper-icons";

function TurnLink({
  href,
  label,
  icon,
}: {
  href?: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}) {
  if (href == null) {
    return null;
  }
  return (
    <Link
      href={href}
      className="paper-mark-action"
      color="secondary"
      type="supporting"
      label={label}
    >
      <Icon icon={icon} size="sm" color="secondary" />
    </Link>
  );
}

export function NoteTurn({
  coverHref,
  previousHref,
  nextHref,
}: {
  coverHref?: string;
  previousHref?: string;
  nextHref?: string;
}) {
  const router = useRouter();

  // Left and right arrows turn the page, like a book.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (
        event.defaultPrevented ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey
      ) {
        return;
      }
      const target = event.target as HTMLElement | null;
      if (
        target?.closest("input, textarea, select, [contenteditable], pre, .md-table") != null
      ) {
        return;
      }
      const href =
        event.key === "ArrowLeft"
          ? previousHref
          : event.key === "ArrowRight"
            ? nextHref
            : undefined;
      if (href != null) {
        event.preventDefault();
        router.push(href);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router, previousHref, nextHref]);

  if (coverHref == null && previousHref == null && nextHref == null) {
    return null;
  }
  return (
    <nav aria-label="Turn the note">
      <HStack align="center" gap={1}>
        <TurnLink href={coverHref} label="Start of this note" icon={CoverMark} />
        <TurnLink href={previousHref} label="Previous page" icon={TurnPrevMark} />
        <TurnLink href={nextHref} label="Next page" icon={TurnNextMark} />
      </HStack>
    </nav>
  );
}
