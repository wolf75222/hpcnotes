"use client";

import { useEffect, useRef } from "react";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/Stack";
import { getAdSenseConfig, type AdPlacement } from "@/lib/ads";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export function AdSlot({
  placement,
  label = "Advertisement",
}: {
  placement: AdPlacement;
  label?: string;
}) {
  const pushed = useRef(false);
  const ads = getAdSenseConfig();
  const slot = ads.slots[placement];
  const canRender = Boolean(ads.client && slot);

  useEffect(() => {
    if (!canRender || pushed.current) {
      return;
    }
    pushed.current = true;
    try {
      window.adsbygoogle = window.adsbygoogle ?? [];
      window.adsbygoogle.push({});
    } catch {
      pushed.current = false;
    }
  }, [canRender]);

  if (!canRender) {
    return null;
  }

  return (
    <VStack gap={2}>
      <Text color="secondary">{label}</Text>
      <ins
        className="adsbygoogle"
        data-ad-client={ads.client}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </VStack>
  );
}
