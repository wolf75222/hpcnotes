"use client";

import { FaultPage } from "@/components/fault-page";
import { PaperFrame } from "@/components/paper-frame";
import { Providers } from "./providers";
import { sans } from "./sans";
import "./globals.css";

export default function GlobalError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  return (
    <html lang="en" data-theme="light" className={sans.variable}>
      <body>
        <title>This page failed · hpcnotes.eu</title>
        <Providers>
          <PaperFrame notes={[]}>
            <FaultPage error={error} retry={retry} />
          </PaperFrame>
        </Providers>
      </body>
    </html>
  );
}
