"use client";

import { useEffect } from "react";

export function HomeAtmosphere() {
  useEffect(() => {
    document.body.classList.add("paper-home");
    return () => document.body.classList.remove("paper-home");
  }, []);

  return null;
}
