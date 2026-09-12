const LOCAL_MEDIA = /^\/media\/[A-Za-z0-9._/-]+$/;
const REMOTE_RASTER = /\.(?:png|jpe?g|gif|webp|avif)$/i;
const VIDEO_EXT = /\.(?:mp4|webm|ogg)$/i;

function isCleanPath(src: string) {
  return (
    !src.includes("..") &&
    !src.includes("\\") &&
    !src.includes("\0")
  );
}

export function isSafeLocalMediaSrc(src: string) {
  if (src.length === 0 || src.length > 512) {
    return false;
  }
  if (!isCleanPath(src)) {
    return false;
  }
  if (
    src.includes("%") ||
    src.includes("?") ||
    src.includes("#")
  ) {
    return false;
  }
  if (!src.startsWith("/media/") || src.endsWith("/")) {
    return false;
  }
  return LOCAL_MEDIA.test(src);
}

export function isSafeRemoteMediaSrc(src: string) {
  if (src.length === 0 || src.length > 2048) {
    return false;
  }
  if (!isCleanPath(src)) {
    return false;
  }
  try {
    const url = new URL(src);
    if (url.protocol !== "https:") {
      return false;
    }
    if (url.username !== "" || url.password !== "") {
      return false;
    }
    if (url.hostname === "" || url.hostname === "localhost") {
      return false;
    }
    const host = url.hostname.toLowerCase();
    if (
      host === "127.0.0.1" ||
      host.endsWith(".localhost") ||
      host === "[::1]"
    ) {
      return false;
    }
    return REMOTE_RASTER.test(url.pathname) || VIDEO_EXT.test(url.pathname);
  } catch {
    return false;
  }
}

export function isSafeMediaSrc(src: string) {
  return isSafeLocalMediaSrc(src) || isSafeRemoteMediaSrc(src);
}
