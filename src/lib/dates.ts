export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00.000Z`));
}

export function formatDayMonth(iso: string) {
  const date = new Date(`${iso}T00:00:00.000Z`);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${day}-${month}`;
}
