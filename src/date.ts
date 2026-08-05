/** Date formatting and manipulation utilities. */

import { isDate } from "./detection.ts";

const TIME_CONVERSIONS: Record<string, number> = {
  millisecond: 1,
  second: 1000,
  minute: 60,
  hour: 60,
  day: 24,
  month: 30,
  year: 12,
};

/** Get timestamp in milliseconds. Returns current time if no input. */
export const getTime = (t?: Date | number | string): number => {
  return t === undefined ? Date.now() : new Date(t).getTime();
};

/** Get ISO 8601 datetime string. */
export const getIsoDateTime = (t?: Date | number | string): string => {
  const d = t === undefined ? new Date() : new Date(t);
  return d.toISOString();
};

/** Format date as YYYY-MM-DD string. */
export const formatDateISO = (date: Date | number | string): string => {
  const d = new Date(date);
  const parts = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).formatToParts(d);

  const values = parts.map((p) => p.value).filter((v) => v !== "/");
  return `${values[2]}-${values[0]}-${values[1]}`;
};

/** Format date using Intl.DateTimeFormat for multi-language support. */
export const formatDate = (
  input: Date | number | string,
  locale = "en",
  options?: Intl.DateTimeFormatOptions,
): string => {
  const date = isDate(input) ? input as Date : new Date(input);
  if (!isDate(date)) {
    throw new Error("InvalidInput: Number or Date required.");
  }

  const defaultOptions: Intl.DateTimeFormatOptions = {
    dateStyle: "medium",
    timeStyle: "long",
  };

  const formatOptions = options || defaultOptions;
  const dtf = new Intl.DateTimeFormat(locale, formatOptions);
  return dtf.format(date);
};

/** Convert seconds to duration string (HH:MM:SS). */
export const sec2dur = (seconds: number): string => {
  const format = (n: number) => {
    return (~~n).toString().padStart(2, "0");
  };
  return [
    format(seconds / 60 / 60),
    format(seconds / 60 % 60),
    format(seconds % 60),
  ].join(":");
};

/** Get duration string from a start time to now (or end time). */
export const getDuration = (begin: number, end?: number): string => {
  const t = end === undefined ? Date.now() : end;
  return sec2dur((t - begin) / 1000);
};

/** Format date as a relative time string using Intl.RelativeTimeFormat. */
export const formatRelativeTime = (
  input: Date | number | string,
  locale = "en",
  justNowText = "just now",
): string => {
  const date = isDate(input) ? input as Date : new Date(input);
  if (!isDate(date)) {
    throw new Error("InvalidInput: Number or Date required.");
  }

  let delta = Date.now() - date.getTime();
  if (delta <= 1000) {
    return justNowText;
  }

  let unit: Intl.RelativeTimeFormatUnit = "second";
  for (const key in TIME_CONVERSIONS) {
    if (delta < TIME_CONVERSIONS[key]) {
      break;
    } else {
      unit = key as Intl.RelativeTimeFormatUnit;
      delta /= TIME_CONVERSIONS[key];
    }
  }
  delta = Math.floor(delta);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  return rtf.format(-delta, unit);
};
