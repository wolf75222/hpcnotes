const MEDIA_PATH = /^\/media\/[A-Za-z0-9._/-]+$/;

export function isSafeMediaSrc(src: string) {
  if (src.length === 0 || src.length > 512) {
    return false;
  }
  if (
    src.includes("..") ||
    src.includes("\\") ||
    src.includes("\0") ||
    src.includes("%") ||
    src.includes("?") ||
    src.includes("#")
  ) {
    return false;
  }
  if (!src.startsWith("/media/") || src.endsWith("/")) {
    return false;
  }
  return MEDIA_PATH.test(src);
}
