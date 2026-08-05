import {
  assertEquals,
  assertMatch,
  assertThrows,
} from "https://deno.land/std/assert/mod.ts";

import { genid, randomInt } from "../src/random.ts";

Deno.test("genid - default length 32", () => {
  assertEquals(genid().length, 32);
});

Deno.test("genid - specified length", () => {
  assertEquals(genid(16).length, 16);
});

Deno.test("genid - with prefix", () => {
  const id = genid(16, "user_");
  assertEquals(id.length, 16);
  assertEquals(id.startsWith("user_"), true);
});

Deno.test("genid - prefix longer than length", () => {
  const id = genid(5, "prefix_is_longer");
  assertEquals(id.length, 5);
  assertEquals(id, "prefi");
});

Deno.test("genid - generates unique IDs", () => {
  const ids = new Set<string>();
  for (let i = 0; i < 100; i++) {
    ids.add(genid());
  }
  assertEquals(ids.size, 100);
});

Deno.test("genid - alphanumeric only", () => {
  const id = genid(100);
  assertMatch(id, /^[A-Za-z0-9]+$/);
});

Deno.test("genid - length of 1", () => {
  assertEquals(genid(1).length, 1);
});

Deno.test("genid - length equal to prefix", () => {
  assertEquals(genid(4, "test"), "test");
});

Deno.test("randomInt - between 0 and max", () => {
  for (let i = 0; i < 100; i++) {
    const result = randomInt(100);
    assertEquals(result >= 0, true);
    assertEquals(result <= 100, true);
  }
});

Deno.test("randomInt - max 0 returns 0", () => {
  assertEquals(randomInt(0), 0);
});

Deno.test("randomInt - max 1 returns 0 or 1", () => {
  const results = new Set<number>();
  for (let i = 0; i < 100; i++) {
    results.add(randomInt(1));
  }
  assertEquals(results.size, 2);
  assertEquals(results.has(0), true);
  assertEquals(results.has(1), true);
});

Deno.test("randomInt - large max values", () => {
  const result = randomInt(1000000);
  assertEquals(result >= 0, true);
  assertEquals(result <= 1000000, true);
});

Deno.test("randomInt - throws for negative max", () => {
  assertThrows(
    () => {
      randomInt(-1);
    },
    Error,
    "max must be a non-negative integer",
  );
});

Deno.test("randomInt - throws for non-integer max", () => {
  assertThrows(
    () => {
      randomInt(1.5);
    },
    Error,
    "max must be a non-negative integer",
  );
});

Deno.test("randomInt - all values in range over many iterations", () => {
  const results = new Set<number>();
  for (let i = 0; i < 1000; i++) {
    results.add(randomInt(5));
  }
  assertEquals(results.size, 6);
  for (let i = 0; i <= 5; i++) {
    assertEquals(results.has(i), true);
  }
});
