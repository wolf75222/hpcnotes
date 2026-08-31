"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import Link from "next/link";
import { Theme } from "@astryxdesign/core/theme";
import { LinkProvider } from "@astryxdesign/core/Link";
import { hpcTheme } from "@/theme/hpc";

export type ColorMode = "system" | "light" | "dark";

const STORAGE_KEY = "hpc-wiki-color-mode";
const modeListeners = new Set<() => void>();

function isColorMode(value: string | null): value is ColorMode {
  return value === "system" || value === "light" || value === "dark";
}

function readMode(): ColorMode {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return isColorMode(stored) ? stored : "system";
}

function subscribeMode(onStoreChange: () => void) {
  modeListeners.add(onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    modeListeners.delete(onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function writeMode(next: ColorMode) {
  window.localStorage.setItem(STORAGE_KEY, next);
  modeListeners.forEach((listener) => listener());
}

const ColorModeContext = createContext<{
  mode: ColorMode;
  setMode: (mode: ColorMode) => void;
  cycleMode: () => void;
}>({
  mode: "system",
  setMode: () => undefined,
  cycleMode: () => undefined,
});

export function useColorMode() {
  return useContext(ColorModeContext);
}

function nextMode(mode: ColorMode): ColorMode {
  if (mode === "system") return "light";
  if (mode === "light") return "dark";
  return "system";
}

export function Providers({ children }: { children: React.ReactNode }) {
  const mode = useSyncExternalStore<ColorMode>(
    subscribeMode,
    readMode,
    (): ColorMode => "system",
  );

  const setMode = useCallback((next: ColorMode) => {
    writeMode(next);
  }, []);

  const cycleMode = useCallback(() => {
    writeMode(nextMode(readMode()));
  }, []);

  const value = useMemo(() => ({ mode, setMode, cycleMode }), [mode, setMode, cycleMode]);

  return (
    <Theme theme={hpcTheme} mode={mode}>
      <LinkProvider component={Link}>
        <ColorModeContext.Provider value={value}>{children}</ColorModeContext.Provider>
      </LinkProvider>
    </Theme>
  );
}
