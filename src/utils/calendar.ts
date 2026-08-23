/** カレンダーとして生成する最初の月 */
export const CALENDAR_START = { year: 2023, month: 4 } as const;

/** カレンダーとして生成する最後の月 */
export const CALENDAR_END = { year: 2026, month: 5 } as const;

/** 週の開始曜日（日曜日: 0、月曜日: 1、…、土曜日: 6） */
export const WEEK_START_DAY = 0;

export const JST_TIME_ZONE = "Asia/Tokyo";

export interface CalendarMonth {
  year: number;
  month: number;
}

export interface CalendarDay {
  day: number;
  isoDate: string;
}

const jstDateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: JST_TIME_ZONE,
  year: "numeric",
  month: "numeric",
  day: "numeric",
});

export function getJstDateParts(date: Date): CalendarMonth & { day: number } {
  const parts = jstDateFormatter.formatToParts(date);
  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, Number(part.value)]),
  );

  return {
    year: values.year,
    month: values.month,
    day: values.day,
  };
}

export function formatMonth(month: number): string {
  return String(month).padStart(2, "0");
}

export function getCalendarPath({ year, month }: CalendarMonth): string {
  return `/calendar/${year}/${formatMonth(month)}`;
}

export function getCalendarMonths(): CalendarMonth[] {
  const months: CalendarMonth[] = [];
  let year: number = CALENDAR_START.year;
  let month: number = CALENDAR_START.month;

  while (
    year < CALENDAR_END.year ||
    (year === CALENDAR_END.year && month <= CALENDAR_END.month)
  ) {
    months.push({ year, month });
    month += 1;

    if (month === 13) {
      year += 1;
      month = 1;
    }
  }

  return months;
}

export function getAdjacentMonth(
  year: number,
  month: number,
  offset: -1 | 1,
): CalendarMonth | undefined {
  const date = new Date(Date.UTC(year, month - 1 + offset, 1));
  const adjacent = {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
  };
  const value = adjacent.year * 12 + adjacent.month;
  const startValue = CALENDAR_START.year * 12 + CALENDAR_START.month;
  const endValue = CALENDAR_END.year * 12 + CALENDAR_END.month;

  return value >= startValue && value <= endValue ? adjacent : undefined;
}

export function createCalendarDays(
  year: number,
  month: number,
): Array<CalendarDay | null> {
  const firstDay = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const leadingEmptyDays = (firstDay - WEEK_START_DAY + 7) % 7;
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const cells: Array<CalendarDay | null> = Array(leadingEmptyDays).fill(null);

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({
      day,
      isoDate: `${year}-${formatMonth(month)}-${String(day).padStart(2, "0")}`,
    });
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}

export function getWeekdayLabels(): string[] {
  const labels = ["日", "月", "火", "水", "木", "金", "土"];

  return Array.from(
    { length: 7 },
    (_, index) => labels[(WEEK_START_DAY + index) % 7],
  );
}
