import type { EventRow } from "@/types/database";

/** Lagos is UTC+1 all year (no daylight saving). */
const LAGOS_OFFSET_HOURS = 1;

function utcStamp(date: string, time: string) {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  const utc = new Date(Date.UTC(y, m - 1, d, hh - LAGOS_OFFSET_HOURS, mm));
  return utc.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function escape(text: string) {
  return text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

/** Fold lines longer than 75 octets as RFC 5545 requires. */
function fold(line: string) {
  const out: string[] = [];
  let rest = line;
  while (rest.length > 74) {
    out.push(rest.slice(0, 74));
    rest = ` ${rest.slice(74)}`;
  }
  out.push(rest);
  return out.join("\r\n");
}

function addDays(date: string, days: number) {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10).replace(/-/g, "");
}

export function buildIcs(event: EventRow, url: string) {
  const plain = (event.excerpt ?? "").trim();
  const location = [event.venue, event.address].filter(Boolean).join(", ");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Mubil Foundation//Events//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.id}@mubilfoundation`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`,
  ];

  if (event.start_time) {
    lines.push(`DTSTART:${utcStamp(event.event_date, event.start_time)}`);
    const end = event.end_time ?? `${String(Number(event.start_time.slice(0, 2)) + 2).padStart(2, "0")}${event.start_time.slice(2)}`;
    lines.push(`DTEND:${utcStamp(event.event_date, end)}`);
  } else {
    lines.push(`DTSTART;VALUE=DATE:${event.event_date.replace(/-/g, "")}`);
    lines.push(`DTEND;VALUE=DATE:${addDays(event.event_date, 1)}`);
  }

  lines.push(`SUMMARY:${escape(event.title)}`);
  if (plain) lines.push(`DESCRIPTION:${escape(`${plain}\n\n${url}`)}`);
  if (location) lines.push(`LOCATION:${escape(location)}`);
  lines.push(`URL:${url}`, "END:VEVENT", "END:VCALENDAR");

  return lines.map(fold).join("\r\n") + "\r\n";
}
