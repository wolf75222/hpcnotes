const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

export function isIsoDate(value: string) {
  const match = ISO_DATE.exec(value);
  if (match == null) {
    return false;
  }
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function formatDotDate(iso: string) {
  if (!isIsoDate(iso)) {
    return "—";
  }
  const date = new Date(`${iso}T00:00:00.000Z`);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

export function noteYear(iso: string) {
  return isIsoDate(iso) ? iso.slice(0, 4) : "—";
}
