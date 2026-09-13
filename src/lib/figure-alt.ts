export function figureAlt(alt: string, fallback = "Figure") {
  const trimmed = alt.trim();
  return trimmed === "" ? fallback : trimmed;
}

export function hasCaption(alt: string) {
  return alt.trim() !== "";
}
