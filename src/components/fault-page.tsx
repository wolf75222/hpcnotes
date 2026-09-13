"use client";

import { useEffect } from "react";
import { Link } from "@astryxdesign/core/Link";
import { EmptyNotes } from "@/components/empty-notes";

export function FaultPage({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
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
