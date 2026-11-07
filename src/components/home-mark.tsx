/**
 * The site icon as four ranks on a mesh. A message walks round the ring
 * (0 -> 1 -> 3 -> 2): each square lights up in turn, and the link it is
 * sent along draws itself. Pure CSS; still under reduced motion.
 */
export function HomeMark() {
  return (
    <svg
      className="home-mark"
      viewBox="0 0 64 64"
      width="56"
      height="56"
      aria-hidden="true"
      focusable="false"
    >
      <line className="home-mark-link" data-step="0" x1="25" y1="18" x2="39" y2="18" />
      <line className="home-mark-link" data-step="1" x1="46" y1="25" x2="46" y2="39" />
      <line className="home-mark-link" data-step="2" x1="39" y1="46" x2="25" y2="46" />
      <line className="home-mark-link" data-step="3" x1="18" y1="39" x2="18" y2="25" />
      <rect className="home-mark-rank" data-step="0" x="11" y="11" width="14" height="14" rx="2.5" />
      <rect className="home-mark-rank" data-step="1" x="39" y="11" width="14" height="14" rx="2.5" />
      <rect className="home-mark-rank" data-step="2" x="39" y="39" width="14" height="14" rx="2.5" />
      <rect className="home-mark-rank" data-step="3" x="11" y="39" width="14" height="14" rx="2.5" />
    </svg>
  );
}
