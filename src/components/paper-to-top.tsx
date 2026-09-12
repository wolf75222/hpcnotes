"use client";

import { useEffect, useState } from "react";
import { Icon } from "@astryxdesign/core/Icon";
import { Link } from "@astryxdesign/core/Link";
import { ToTopMark } from "@/components/paper-icons";

export function PaperToTop({ hidden = false }: { hidden?: boolean }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY || document.documentElement.scrollTop;
      setVisible(y > window.innerHeight * 0.35);
    };
    const onScroll = () => {
      if (frame === 0) {
        frame = window.requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  if (hidden || !visible) {
    return null;
  }

  return (
    <Link
      className="paper-to-top"
      color="secondary"
      type="supporting"
      label="Back to top"
      onClick={() => {
        const reduce = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      }}
    >
      <Icon icon={ToTopMark} size="sm" color="inherit" />
    </Link>
  );
}
