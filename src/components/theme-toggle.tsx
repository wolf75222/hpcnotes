"use client";

import { IconButton } from "@astryxdesign/core/IconButton";
import { Icon } from "@astryxdesign/core/Icon";
import { Monitor, Moon, Sun } from "lucide-react";
import { useColorMode, type ColorMode } from "@/app/providers";

const ICONS: Record<ColorMode, typeof Sun> = {
  system: Monitor,
  light: Sun,
  dark: Moon,
};

const LABELS: Record<ColorMode, string> = {
  system: "Using system colors. Switch to light.",
  light: "Using light mode. Switch to dark.",
  dark: "Using dark mode. Switch to system.",
};

export function ThemeToggle() {
  const { mode, cycleMode } = useColorMode();
  return (
    <IconButton
      label={LABELS[mode]}
      tooltip={LABELS[mode]}
      variant="ghost"
      icon={<Icon icon={ICONS[mode]} />}
      onClick={cycleMode}
    />
  );
}
