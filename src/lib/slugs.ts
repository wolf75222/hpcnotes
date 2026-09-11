const NOTE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const TAG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/i;

export function isNoteSlug(value: string) {
  return value.length > 0 && value.length <= 96 && NOTE_SLUG.test(value);
}

export function isSafeTag(value: string) {
  return value.length > 0 && value.length <= 48 && TAG.test(value);
}

export function normalizeTag(value: string) {
  return value.trim().toLowerCase();
}

export function safeDecodeParam(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
