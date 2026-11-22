// Upcoming events, read live from the "Frassati Website — Upcoming Events" Google Sheet.
//
// The sheet must be shared as "Anyone with the link: Viewer". Leaders edit the sheet; the
// site picks up changes within REFRESH_SECONDS. Columns (first row is the header):
//   Gathering | Date | Time | Title | Location | Summary | RSVP link
// Gathering is Dinner, Hike, Service or Formation. Date is M/D/YYYY (or YYYY-MM-DD). For each gathering
// the site shows the soonest row dated today or later; past rows are simply ignored.

export type Gathering = "dinner" | "hike" | "service" | "formation";

/** Each gathering's standing Google Form. A sheet row's RSVP link overrides it for that event. */
export const DEFAULT_RSVP: Record<Gathering, string> = {
  dinner: "https://forms.gle/cscCKP3XbaPE68Mn7",
  hike: "https://forms.gle/j3ASM1pjCYMMDyoE8",
  service: "https://forms.gle/ss8sYbNeeXBUp4856",
  formation: "https://forms.gle/1AWuGAqnuJqmSSU87"
};

export type UpcomingEvent = {
  gathering: Gathering;
  date: string; // YYYY-MM-DD
  time: string;
  title: string;
  location: string;
  summary: string;
  rsvpUrl: string | null;
};

export const REFRESH_SECONDS = 300;

const SHEET_ID =
  process.env.EVENTS_SHEET_ID || "1ULi_5pe_iJJme9_5_LF0aEFERsUoCZPb2l50sgR9Kr4";
export const EVENTS_SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}`;
const CSV_URL = process.env.EVENTS_CSV_URL || `${EVENTS_SHEET_URL}/export?format=csv`;
const TIME_ZONE = "America/New_York";

/** Minimal RFC 4180 CSV parser (quoted fields, escaped quotes, newlines inside quotes). */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else quoted = false;
      } else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += c;
  }
  if (field !== "" || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

/** Accepts M/D/YYYY, YYYY-MM-DD, or a written date ("Dec 13, 2026"); returns YYYY-MM-DD. */
export function toIsoDate(value: string): string | null {
  const v = value.trim();
  let m = v.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) return iso(+m[1], +m[2], +m[3]);
  m = v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (m) return iso(m[3].length === 2 ? 2000 + +m[3] : +m[3], +m[1], +m[2]);
  const t = Date.parse(v);
  if (!v || Number.isNaN(t)) return null;
  const d = new Date(t);
  return iso(d.getFullYear(), d.getMonth() + 1, d.getDate());
}

function iso(y: number, mo: number, d: number): string | null {
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  return `${y}-${String(mo).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function toGathering(value: string): Gathering | null {
  const v = value.trim().toLowerCase();
  if (v.startsWith("dinner") || v.includes("holy hour")) return "dinner";
  if (v.startsWith("hike")) return "hike";
  if (v.startsWith("service")) return "service";
  if (v.startsWith("spiritual") || v.includes("formation")) return "formation";
  return null;
}

function safeUrl(value: string): string | null {
  try {
    const u = new URL(value.trim());
    return u.protocol === "https:" || u.protocol === "http:" ? u.toString() : null;
  } catch {
    return null;
  }
}

export function todayInNewJersey(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE }).format(now);
}

/** Soonest upcoming event per gathering, from the sheet's CSV text. */
export function nextEvents(csv: string, today: string): Partial<Record<Gathering, UpcomingEvent>> {
  const [header, ...rows] = parseCsv(csv);
  if (!header) return {};
  const col = (name: string) =>
    header.findIndex((h) => h.trim().toLowerCase() === name.toLowerCase());
  const idx = {
    gathering: col("Gathering"),
    date: col("Date"),
    time: col("Time"),
    title: col("Title"),
    location: col("Location"),
    summary: col("Summary"),
    rsvp: col("RSVP link")
  };
  const get = (r: string[], i: number) => (i >= 0 ? (r[i] ?? "").trim() : "");

  const next: Partial<Record<Gathering, UpcomingEvent>> = {};
  for (const r of rows) {
    const gathering = toGathering(get(r, idx.gathering));
    const date = toIsoDate(get(r, idx.date));
    if (!gathering || !date || date < today) continue;
    const current = next[gathering];
    if (current && current.date <= date) continue;
    next[gathering] = {
      gathering,
      date,
      time: get(r, idx.time),
      title: get(r, idx.title),
      location: get(r, idx.location),
      summary: get(r, idx.summary),
      rsvpUrl: safeUrl(get(r, idx.rsvp)) ?? DEFAULT_RSVP[gathering]
    };
  }
  return next;
}

/** Fetches the sheet (cached for REFRESH_SECONDS). Never throws: a failure shows "coming soon". */
export async function getNextEvents(): Promise<Partial<Record<Gathering, UpcomingEvent>>> {
  try {
    const res = await fetch(CSV_URL, { next: { revalidate: REFRESH_SECONDS } });
    if (!res.ok) return {};
    const text = await res.text();
    if (text.trimStart().startsWith("<")) return {}; // sign-in page: sheet isn't shared yet
    return nextEvents(text, todayInNewJersey());
  } catch {
    return {};
  }
}

/** "Saturday, December 13" (adds the year if it isn't this year). */
export function formatEventDate(date: string, today: string): string {
  const [y, m, d] = date.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d, 12));
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    ...(date.slice(0, 4) !== today.slice(0, 4) ? { year: "numeric" } : {}),
    timeZone: "UTC"
  }).format(dt);
}
