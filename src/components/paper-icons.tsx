import type { SVGProps } from "react";

/** A small lens with a glass ring, instead of the default fat loupe. */
export function SearchMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle
        cx="10.2"
        cy="10.2"
        r="6.15"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle
        cx="10.2"
        cy="10.2"
        r="3.35"
        stroke="currentColor"
        strokeWidth="1.15"
        opacity="0.38"
      />
      <path
        d="M8.05 8.15c.7-.85 1.75-1.4 2.95-1.5"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        opacity="0.45"
      />
      <path
        d="m14.85 14.85 5.35 5.35"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}
