import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std/assert/mod.ts";

import {
  formatDate,
  formatDateISO,
  formatRelativeTime,
  getDuration,
  getIsoDateTime,
  getTime,
  sec2dur,
} from "../src/date.ts";

Deno.test("getTime - returns current timestamp", () => {
  const result = getTime();
  assertEquals(typeof result, "number");
  assertEquals(result > 0, true);
});

Deno.test("getTime - with date string", () => {
  const result = getTime("2026-01-01");
  assertEquals(result, new Date("2026-01-01").getTime());
});

Deno.test("getTime - with Date object", () => {
  const d = new Date("2026-06-15");
  assertEquals(getTime(d), d.getTime());
});

Deno.test("getIsoDateTime - returns ISO string", () => {
  const result = getIsoDateTime();
  assertEquals(typeof result, "string");
  assertEquals(result.includes("T"), true);
  assertEquals(result.endsWith("Z"), true);
});

Deno.test("getIsoDateTime - with date string", () => {
  assertEquals(getIsoDateTime("2026-01-15"), "2026-01-15T00:00:00.000Z");
});

Deno.test("formatDateISO - YYYY-MM-DD format", () => {
  assertEquals(formatDateISO(new Date("2026-01-16")), "2026-01-16");
  assertEquals(formatDateISO("2026-01-16T10:30:00"), "2026-01-16");
  const d = new Date("2026-06-15");
  assertEquals(formatDateISO(d.getTime()), "2026-06-15");
});

Deno.test("formatDate - default options", () => {
  const d = new Date();
  const result = formatDate(d);
  const reg = /^\w+\s\d+,\s+\d{4},\s\d+:\d+:\d+\s(AM|PM)+/;
  assertEquals(reg.test(result), true);
});

Deno.test("formatDate - custom options", () => {
  const d = new Date();
  const result = formatDate(d, "en", {
    dateStyle: "full",
    timeStyle: "medium",
    hour12: true,
  });
  const reg = /^\w+,\s\w+\s\d+,\s+\d{4}\sat\s\d+:\d+:\d+\s(AM|PM)$/;
  assertEquals(reg.test(result), true);
});

Deno.test("formatDate - Vietnamese locale", () => {
  const d = new Date();
  const result = formatDate(d, "vi");
  assertEquals(typeof result, "string");
  assertEquals(result.length > 0, true);
});

Deno.test("formatDate - throws for invalid date", () => {
  assertThrows(
    () => {
      formatDate({} as any);
    },
    Error,
    "InvalidInput",
  );
});

Deno.test("sec2dur", () => {
  assertEquals(sec2dur(3661), "01:01:01");
  assertEquals(sec2dur(90), "00:01:30");
  assertEquals(sec2dur(5), "00:00:05");
  assertEquals(sec2dur(0), "00:00:00");
  assertEquals(sec2dur(25 * 3600), "25:00:00");
});

Deno.test("getDuration", () => {
  const start = Date.now() - 5000;
  const result = getDuration(start);
  assertEquals(result.length, 8);
  assertEquals(result.includes(":"), true);
  assertEquals(getDuration(0, 3661000), "01:01:01");
});

Deno.test("formatRelativeTime", () => {
  assertEquals(formatRelativeTime(new Date()), "just now");
  assertEquals(
    formatRelativeTime(new Date(Date.now() - 5000)),
    "5 seconds ago",
  );
  assertEquals(
    formatRelativeTime(new Date(Date.now() - 6e4 * 5)),
    "5 minutes ago",
  );
  assertEquals(
    formatRelativeTime(new Date(Date.now() - 6e4 * 60 * 5)),
    "5 hours ago",
  );
  assertEquals(
    formatRelativeTime(new Date(Date.now() - 6e4 * 60 * 24 * 5)),
    "5 days ago",
  );
});

Deno.test("formatRelativeTime - Vietnamese locale", () => {
  const result = formatRelativeTime(new Date(Date.now() - 6e4 * 5), "vi");
  assertEquals(result.includes("phút"), true);
});

Deno.test("formatRelativeTime - throws for invalid date", () => {
  assertThrows(
    () => {
      formatRelativeTime({} as any);
    },
    Error,
    "InvalidInput",
  );
});
