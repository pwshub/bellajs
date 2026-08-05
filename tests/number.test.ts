import { assertEquals } from "https://deno.land/std/assert/mod.ts";

import { formatBytes, formatNumber } from "../src/number.ts";

Deno.test("formatBytes", () => {
  assertEquals(formatBytes(0), "0 Bytes");
  assertEquals(formatBytes(1), "1 Bytes");
  assertEquals(formatBytes(512), "512 Bytes");
  assertEquals(formatBytes(1024), "1 KiB");
  assertEquals(formatBytes(1536), "1.5 KiB");
  assertEquals(formatBytes(2048), "2 KiB");
  assertEquals(formatBytes(1048576), "1 MiB");
  assertEquals(formatBytes(1073741824), "1 GiB");
  assertEquals(formatBytes(1234567890), "1.15 GiB");
  assertEquals(formatBytes(1099511627776), "1 TiB");
});

Deno.test("formatBytes - decimals", () => {
  assertEquals(formatBytes(1536, 0), "2 KiB");
  assertEquals(formatBytes(1536, 1), "1.5 KiB");
  assertEquals(formatBytes(1536, 3), "1.5 KiB");
  assertEquals(formatBytes(1234567890, 4), "1.1498 GiB");
  assertEquals(formatBytes(1536, -1), "2 KiB");
});

Deno.test("formatNumber", () => {
  assertEquals(formatNumber(123), "123.00");
  assertEquals(formatNumber(0), "0.00");
  assertEquals(formatNumber(123.456, 0), "123");
  assertEquals(formatNumber(123.456, 1), "123.5");
  assertEquals(formatNumber(123.456, 2), "123.46");
  assertEquals(formatNumber(123.456, 3), "123.456");
  assertEquals(formatNumber("45.678" as any, 2), "45.68");
  assertEquals(formatNumber(-123.456, 2), "-123.46");
  assertEquals(formatNumber(1000, 0), "1000");
  assertEquals(formatNumber(999.99, 0), "1000");
  assertEquals(formatNumber(), "0.00");
  assertEquals(formatNumber(100), "100.00");
});
