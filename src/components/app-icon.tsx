"use client";

import { Icon } from "@astryxdesign/core/Icon";
import {
  BookOpen,
  GraduationCap,
  Newspaper,
  Search,
  type LucideIcon,
} from "lucide-react";

const ICONS = {
  book: BookOpen,
  graduation: GraduationCap,
  newspaper: Newspaper,
  search: Search,
} as const satisfies Record<string, LucideIcon>;

export type AppIconName = keyof typeof ICONS;

export function AppIcon({
  name,
  size,
  color,
}: {
  name: AppIconName;
  size?: "xsm" | "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "inherit";
}) {
  return <Icon icon={ICONS[name]} size={size} color={color} />;
}
