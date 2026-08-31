export type AdPlacement = "infeed" | "article";

export interface AdSenseConfig {
  client: string | undefined;
  slots: Record<AdPlacement, string | undefined>;
  isConfigured: boolean;
}

export function getAdSenseConfig(): AdSenseConfig {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() || undefined;
  const slots: Record<AdPlacement, string | undefined> = {
    infeed: process.env.NEXT_PUBLIC_ADSENSE_SLOT_INFEED?.trim() || undefined,
    article: process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE?.trim() || undefined,
  };
  return {
    client,
    slots,
    isConfigured: Boolean(client),
  };
}
