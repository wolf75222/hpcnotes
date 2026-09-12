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

/** A thin compass, paired with the search lens in the paper chrome. */
export function ExploreMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle
        cx="12"
        cy="12"
        r="8.1"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M14.85 9.15 11.2 11.2 9.15 14.85 12.8 12.8 14.85 9.15Z"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="0.85" fill="currentColor" />
      <path
        d="M12 4.9v1.45"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        opacity="0.45"
      />
    </svg>
  );
}

/** A hairline caret, meant to sit in a contents row without looking like a toolbar. */
export function DiscloseMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M10 7.75 14.4 12 10 16.25"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DiscloseOpenMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M7.75 10 12 14.4 16.25 10"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Three thin lines: the note that holds the whole contents. */
export function CoverMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M6 8h12"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
      <path
        d="M6 12h8.5"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M6 16h5"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        opacity="0.45"
      />
    </svg>
  );
}

export function TurnPrevMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M14.25 7.75 9.6 12 14.25 16.25"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TurnNextMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M9.75 7.75 14.4 12 9.75 16.25"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
