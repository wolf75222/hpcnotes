export type AdPlacement = "infeed" | "article";

export interface AdSenseConfig {
  client: string | undefined;
  slots: Record<AdPlacement, string | undefined>;
  isConfigured: boolean;
}

const CLIENT = /^ca-pub-\d{8,22}$/;
const SLOT = /^\d{6,22}$/;

function cleanClient(value: string | undefined) {
  const trimmed = value?.trim() ?? "";
  return CLIENT.test(trimmed) ? trimmed : undefined;
}

function cleanSlot(value: string | undefined) {
  const trimmed = value?.trim() ?? "";
  return SLOT.test(trimmed) ? trimmed : undefined;
}

export function getAdSenseConfig(): AdSenseConfig {
  const client = cleanClient(process.env.NEXT_PUBLIC_ADSENSE_CLIENT);
  const slots: Record<AdPlacement, string | undefined> = {
    infeed: cleanSlot(process.env.NEXT_PUBLIC_ADSENSE_SLOT_INFEED),
    article: cleanSlot(process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE),
  };
  return {
    client,
    slots,
    isConfigured: Boolean(client),
  };
}
