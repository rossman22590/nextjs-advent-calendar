import { START_DATE_ISO, TOTAL_DAYS } from "@/config/settings";

export function getDebugDate() {
  const debug = process.env.NEXT_PUBLIC_DEBUG_DATE;
  if (!debug) return null;
  const parsed = new Date(debug);
  return isNaN(parsed.getTime()) ? null : parsed;
}

function getStartDate() {
  return new Date(START_DATE_ISO);
}

export function getTodayDay() {
  const date = getDebugDate() ?? new Date();
  const start = getStartDate();
  const diffMs = date.getTime() - start.getTime();
  if (diffMs < 0) return 0;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return diffDays + 1;
}

export function isDayToday(day: number) {
  return isCalendarPeriod() && day === getTodayDay();
}

function getEndDate() {
  const end = getStartDate();
  end.setDate(end.getDate() + TOTAL_DAYS - 1);
  return end;
}

export function isCalendarPeriod() {
  const date = getDebugDate() ?? new Date();
  return date >= getStartDate();
}

export function isOpen(day: number | string) {
  if (typeof day === "string") {
    day = parseInt(day);
  }
  const today = Math.min(getTodayDay(), TOTAL_DAYS);
  return isCalendarPeriod() && day <= today && day >= 1;
}
