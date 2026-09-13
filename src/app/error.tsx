"use client";

import { FaultPage } from "@/components/fault-page";

export default function ErrorPage({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  return <FaultPage error={error} retry={retry} />;
}
