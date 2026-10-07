const TZ = "Africa/Lagos";

/** Parse a `YYYY-MM-DD` date as midday UTC so it never shifts a day. */
export function parseDate(date: string) {
  return new Date(`${date.slice(0, 10)}T12:00:00Z`);
}

export function formatDate(
  date: string,
  opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" },
) {
  const d = date.length <= 10 ? parseDate(date) : new Date(date);
  return new Intl.DateTimeFormat("en-GB", { timeZone: TZ, ...opts }).format(d);
}

export function dateParts(date: string) {
  const d = parseDate(date);
  return {
    day: new Intl.DateTimeFormat("en-GB", { timeZone: TZ, day: "numeric" }).format(d),
    month: new Intl.DateTimeFormat("en-GB", { timeZone: TZ, month: "short" }).format(d),
    weekday: new Intl.DateTimeFormat("en-GB", { timeZone: TZ, weekday: "long" }).format(d),
  };
}

/** `14:30:00` to `14:30` */
export function formatTime(time: string | null) {
  return time ? time.slice(0, 5) : null;
}

export function formatTimeRange(start: string | null, end: string | null) {
  const s = formatTime(start);
  const e = formatTime(end);
  if (s && e) return `${s} to ${e}`;
  return s ?? e ?? null;
}

/** Today's date in Lagos as `YYYY-MM-DD`. */
export function todayInLagos() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date());
}

export function readingTime(html: string | null) {
  const words = (html ?? "")
    .replace(/<[^>]+>/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
