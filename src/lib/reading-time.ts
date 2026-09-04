const WORDS_PER_MINUTE = 220;

export function readingMinutes(body: string) {
  const words = body
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export function formatReadingTime(body: string) {
  return `${readingMinutes(body)} min`;
}
