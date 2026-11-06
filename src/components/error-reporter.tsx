"use client";

import { useEffect } from "react";

const MAX_REPORTS = 5;

/** Sends uncaught JS errors to /api/report (production only, 5 per page). */
export function ErrorReporter() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !navigator.sendBeacon) {
      return;
    }
    let sent = 0;
    const send = (message: string, source?: string, line?: number) => {
      if (sent >= MAX_REPORTS) {
        return;
      }
      sent += 1;
      const payload = JSON.stringify({
        kind: "js-error",
        page: location.pathname,
        message: message.slice(0, 500),
        source: source?.slice(0, 300),
        line,
      });
      navigator.sendBeacon(
        "/api/report",
        new Blob([payload], { type: "application/json" }),
      );
    };
    const onError = (event: ErrorEvent) =>
      send(event.message || "error", event.filename, event.lineno);
    const onRejection = (event: PromiseRejectionEvent) =>
      send(`unhandled rejection: ${String(event.reason).slice(0, 400)}`);
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);
  return null;
}
