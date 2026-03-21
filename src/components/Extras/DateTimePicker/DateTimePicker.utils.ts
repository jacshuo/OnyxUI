import type { DateTimeMode, OffsetUnit, OffsetDirection } from "./types";

// ─── Month / weekday helpers ────────────────────────────────────────────────

export function getMonthNames(locale = "en-US", format: "long" | "short" = "long"): string[] {
  return Array.from({ length: 12 }, (_, i) =>
    new Intl.DateTimeFormat(locale, { month: format }).format(new Date(2000, i, 1)),
  );
}

export function getWeekdayNames(
  locale = "en-US",
  format: "long" | "narrow" | "short" = "narrow",
): string[] {
  // Sunday = Jan 2, 2000
  const ref = new Date(2000, 0, 2);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(ref);
    d.setDate(ref.getDate() + i);
    return new Intl.DateTimeFormat(locale, { weekday: format }).format(d);
  });
}

// ─── Format ─────────────────────────────────────────────────────────────────

export function getDefaultFormat(mode: DateTimeMode, use24Hour = true, showSeconds = true): string {
  if (mode === "date") return "YYYY-MM-DD";
  if (mode === "time") {
    if (use24Hour) return showSeconds ? "HH:mm:ss" : "HH:mm";
    return showSeconds ? "hh:mm:ss A" : "hh:mm A";
  }
  // datetime
  if (use24Hour) return showSeconds ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD HH:mm";
  return showSeconds ? "YYYY-MM-DD hh:mm:ss A" : "YYYY-MM-DD hh:mm A";
}

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function formatDate(date: Date, format: string, locale = "en-US"): string {
  const h = date.getHours();
  const monthNames = getMonthNames(locale, "long");
  const shortMonths = getMonthNames(locale, "short");

  const tokenMap: Record<string, string> = {
    YYYY: String(date.getFullYear()),
    YY: String(date.getFullYear()).slice(-2),
    MMMM: monthNames[date.getMonth()],
    MMM: shortMonths[date.getMonth()],
    MM: String(date.getMonth() + 1).padStart(2, "0"),
    M: String(date.getMonth() + 1),
    DD: String(date.getDate()).padStart(2, "0"),
    D: String(date.getDate()),
    HH: String(h).padStart(2, "0"),
    H: String(h),
    hh: String(h % 12 || 12).padStart(2, "0"),
    h: String(h % 12 || 12),
    mm: String(date.getMinutes()).padStart(2, "0"),
    ss: String(date.getSeconds()).padStart(2, "0"),
    A: h < 12 ? "AM" : "PM",
    a: h < 12 ? "am" : "pm",
  };

  // Match longest token first to avoid substring conflicts (e.g. YYYY before YY)
  const sorted = Object.keys(tokenMap).sort((a, b) => b.length - a.length);
  const re = new RegExp(sorted.map(escapeRe).join("|"), "g");
  return format.replace(re, (m) => tokenMap[m] ?? m);
}

// ─── Calendar grid ───────────────────────────────────────────────────────────

export interface CalendarDay {
  date: Date;
  thisMonth: boolean;
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getCalendarDays(year: number, month: number): CalendarDay[] {
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = getDaysInMonth(year, month);
  const prevDays = getDaysInMonth(year, month - 1);
  const days: CalendarDay[] = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({ date: new Date(year, month - 1, prevDays - i), thisMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push({ date: new Date(year, month, d), thisMonth: true });
  }
  const remaining = 42 - days.length;
  for (let d = 1; d <= remaining; d++) {
    days.push({ date: new Date(year, month + 1, d), thisMonth: false });
  }
  return days;
}

// ─── Date comparison ─────────────────────────────────────────────────────────

function ymd(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function isSameDay(a: Date, b: Date): boolean {
  return ymd(a).getTime() === ymd(b).getTime();
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

export function isBeforeDay(a: Date, b: Date): boolean {
  return ymd(a) < ymd(b);
}

export function isAfterDay(a: Date, b: Date): boolean {
  return ymd(a) > ymd(b);
}

// ─── Constraints / offsets ───────────────────────────────────────────────────

export function clampDate(date: Date, min?: Date, max?: Date): Date {
  if (min && date < min) return new Date(min);
  if (max && date > max) return new Date(max);
  return date;
}

export function applyOffset(
  base: Date,
  amount: number,
  unit: OffsetUnit,
  direction: OffsetDirection,
): Date {
  const result = new Date(base);
  const sign = direction === "future" ? 1 : -1;
  const delta = amount * sign;
  switch (unit) {
    case "day":
      result.setDate(result.getDate() + delta);
      break;
    case "week":
      result.setDate(result.getDate() + delta * 7);
      break;
    case "month":
      result.setMonth(result.getMonth() + delta);
      break;
    case "year":
      result.setFullYear(result.getFullYear() + delta);
      break;
  }
  return result;
}

// ─── Year range list ─────────────────────────────────────────────────────────

export function getYearRange(center: number, span = 200): number[] {
  const start = center - Math.floor(span / 2);
  return Array.from({ length: span }, (_, i) => start + i);
}
