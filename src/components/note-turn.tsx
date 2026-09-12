"use client";

import type { ComponentType, SVGProps } from "react";
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
