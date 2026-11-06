const LOCAL_MEDIA = /^\/media\/[A-Za-z0-9._/-]+$/;
const REMOTE_RASTER = /\.(?:png|jpe?g|gif|webp|avif)$/i;
const STILL_RASTER = /\.(?:png|jpe?g|webp|avif)$/i;
const VIDEO_EXT = /\.(?:mp4|webm|ogg)$/i;

export function mediaPathname(src: string) {
  if (src.startsWith("/")) {
    return src;
  }
  try {
    return new URL(src).pathname;
  } catch {
    return src;
  }
}

/** Only local files go through next/image; remote ones render as plain <img>. */
export function isCompressibleRasterSrc(src: string) {
  return isSafeLocalMediaSrc(src) && STILL_RASTER.test(src);
}

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

const PRIVATE_V4 =
  /^(?:0|10|127)\.|^169\.254\.|^172\.(?:1[6-9]|2\d|3[01])\.|^192\.168\.|^100\.(?:6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./;

function isPrivateHost(host: string) {
  if (host.startsWith("[")) {
    // Any IPv6 literal: loopback, link-local, ULA, mapped v4… not worth it.
    return true;
  }
  if (/^\d+\.\d+\.\d+\.\d+$/.test(host)) {
    return PRIVATE_V4.test(host);
  }
  return false;
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
    if (host.endsWith(".localhost") || isPrivateHost(host)) {
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
