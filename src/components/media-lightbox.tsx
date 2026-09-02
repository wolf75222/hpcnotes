"use client";

import { useCallback, useRef, useState, type MouseEvent } from "react";
import { Lightbox, type LightboxMedia } from "@astryxdesign/core/Lightbox";

const OPEN_DELAY_MS = 120;

export function useDeferredLightbox(
  media: LightboxMedia,
  hasZoom: boolean,
) {
  const [open, setOpen] = useState(false);
  const pending = useRef(false);

  const openLightbox = useCallback((event?: MouseEvent) => {
    event?.preventDefault();
    event?.stopPropagation();
    if (pending.current || open) {
      return;
    }
    pending.current = true;
    // Native <dialog showModal()> treats the opening pointer as a backdrop
    // dismiss if it is still in flight. Wait until that gesture is done.
    window.setTimeout(() => {
      pending.current = false;
      setOpen(true);
    }, OPEN_DELAY_MS);
  }, [open]);

  const element = (
    <Lightbox
      isOpen={open}
      onOpenChange={setOpen}
      media={media}
      hasZoom={hasZoom}
    />
  );

  return { openLightbox, element, isOpen: open };
}
