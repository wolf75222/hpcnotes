"use client";

import { useCallback, useRef, useState, type MouseEvent } from "react";
import { Lightbox, type LightboxMedia } from "@astryxdesign/core/Lightbox";

const OPEN_DELAY_MS = 80;
const IGNORE_CLOSE_MS = 220;

export function useDeferredLightbox(
  media: LightboxMedia,
  hasZoom: boolean,
) {
  const [open, setOpen] = useState(false);
  const pending = useRef(false);
  const ignoreUntil = useRef(0);

  const openLightbox = useCallback((event?: MouseEvent) => {
    event?.preventDefault();
    event?.stopPropagation();
    event?.nativeEvent.stopImmediatePropagation();
    if (pending.current || open) {
      return;
    }
    pending.current = true;
    ignoreUntil.current = Date.now() + IGNORE_CLOSE_MS;

    const swallow = (click: Event) => {
      click.stopPropagation();
    };
    document.addEventListener("click", swallow, true);

    window.setTimeout(() => {
      document.removeEventListener("click", swallow, true);
      pending.current = false;
      ignoreUntil.current = Date.now() + IGNORE_CLOSE_MS;
      setOpen(true);
    }, OPEN_DELAY_MS);
  }, [open]);

  const onOpenChange = useCallback((next: boolean) => {
    if (!next && Date.now() < ignoreUntil.current) {
      return;
    }
    setOpen(next);
  }, []);

  const element = (
    <Lightbox
      isOpen={open}
      onOpenChange={onOpenChange}
      media={media}
      hasZoom={hasZoom}
    />
  );

  return { openLightbox, element, isOpen: open };
}
