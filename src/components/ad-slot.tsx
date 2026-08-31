"use client";

import { useEffect, useRef } from "react";
import { Card } from "@astryxdesign/core/Card";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/Stack";
import { getAdSenseConfig, type AdPlacement } from "@/lib/ads";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const PLACEHOLDER_COPY: Record<AdPlacement, string> = {
  infeed: "In-feed unit",
  article: "In-article unit",
};

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
    return (
      <Card variant="muted" padding={4}>
        <VStack gap={1}>
          <Text type="label" color="secondary">
            {label}
          </Text>
          <Text>
            {PLACEHOLDER_COPY[placement]}. Set{" "}
            <Text type="code">NEXT_PUBLIC_ADSENSE_CLIENT</Text> and a slot ID in{" "}
            <Text type="code">.env.local</Text> to replace this placeholder.
          </Text>
        </VStack>
      </Card>
    );
  }

  return (
    <Card variant="muted" padding={2}>
      <VStack gap={2}>
        <Text type="label" color="secondary">
          {label}
        </Text>
        <ins
          className="adsbygoogle"
          data-ad-client={ads.client}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </VStack>
    </Card>
  );
}
