import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site-url";

export const NOT_FOUND_TITLE = "Not found";
export const NOT_FOUND_DESCRIPTION =
  "This address may have moved, or it never existed.";

export function pageMetadata({
  title,
  description,
  path,
  robots,
  absoluteTitle = false,
  alternates,
}: {
  title: string;
  description: string;
  path: string;
  robots?: Metadata["robots"];
  absoluteTitle?: boolean;
  alternates?: Metadata["alternates"];
}): Metadata {
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: path,
      ...alternates,
    },
    robots,
    openGraph: {
      type: "website",
      url: path,
      title,
      description,
      siteName: SITE_NAME,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function notFoundMetadata(): Metadata {
  return {
    title: NOT_FOUND_TITLE,
    description: NOT_FOUND_DESCRIPTION,
    robots: { index: false, follow: false },
    openGraph: {
      type: "website",
      title: NOT_FOUND_TITLE,
      description: NOT_FOUND_DESCRIPTION,
      siteName: SITE_NAME,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: NOT_FOUND_TITLE,
      description: NOT_FOUND_DESCRIPTION,
    },
  };
}
