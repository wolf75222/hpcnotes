"use client";

import { useEffect } from "react";
import { Link } from "@astryxdesign/core/Link";
import { EmptyNotes } from "@/components/empty-notes";
import { SITE_NAME } from "@/lib/site-url";

export function FaultPage({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
    document.title = `This page failed · ${SITE_NAME}`;
    const description =
      "This page did not render. Try again, or go back to the list.";
    let meta = document.querySelector('meta[name="description"]');
    if (meta == null) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", description);
  }, [error]);

  return (
    <EmptyNotes
      title="This page failed"
      description="It did not render. Try again, or go back to the list."
      headingLevel={1}
      extra={
        <Link
          color="secondary"
          type="supporting"
          isStandalone
          onClick={() => retry()}
        >
          Try again
        </Link>
      }
    />
  );
}
