import { assertEquals } from "https://deno.land/std/assert/mod.ts";

import { clone, copies } from "../src/object.ts";

Deno.test("clone - primitives", () => {
  assertEquals(clone(42), 42);
  assertEquals(clone("hello"), "hello");
  assertEquals(clone(true), true);
  assertEquals(clone(null), null);
  assertEquals(clone(undefined), undefined);
  assertEquals(Number.isNaN(clone(NaN)), true);
});

Deno.test("clone - simple object", () => {
  const original = { a: 1, b: 2 };
  const cloned = clone(original);
  assertEquals(cloned, original);
  cloned.a = 99;
  assertEquals(original.a, 1);
});

Deno.test("clone - nested object", () => {
  const original = { a: 1, b: { c: 2, d: { e: 3 } } };
  const cloned = clone(original);
  assertEquals(cloned, original);
  cloned.b.c = 99;
  assertEquals(original.b.c, 2);
  cloned.b.d.e = 99;
  assertEquals(original.b.d.e, 3);
});

Deno.test("clone - object immutability", () => {
  const original = { a: 1, b: { c: 2 } };
  const cloned = clone(original);
  cloned.a = 100;
  cloned.b.c = 200;
  assertEquals(original.a, 1);
  assertEquals(original.b.c, 2);
});

Deno.test("clone - simple array", () => {
  const original = [1, 2, 3];
  const cloned = clone(original);
  assertEquals(cloned, original);
  cloned[0] = 99;
  assertEquals(original[0], 1);
});

Deno.test("clone - nested array", () => {
  const original = [1, [2, [3, [4]]]];
  const cloned = clone(original);
  assertEquals(cloned, original);
  (cloned[1] as any[])[0] = 99;
  assertEquals((original[1] as any[])[0], 2);
});

Deno.test("clone - array immutability", () => {
  const original: any[] = [1, { a: 2 }, [3]];
  const cloned = clone(original) as any[];
  cloned[0] = 100;
  cloned[1].a = 200;
  cloned[2][0] = 300;
  assertEquals(original[0], 1);
  assertEquals(original[1].a, 2);
  assertEquals(original[2][0], 3);
});

Deno.test("clone - Date object", () => {
  const original = new Date("2026-01-16T10:30:00Z");
  const cloned = clone(original);
  assertEquals(cloned.getTime(), original.getTime());
  cloned.setFullYear(2027);
  assertEquals(original.getFullYear(), 2026);
});

Deno.test("clone - circular reference", () => {
  const original: any = { a: 1 };
  original.self = original;
  const cloned = clone(original);
  assertEquals(cloned.a, 1);
  assertEquals(cloned.self, cloned);
});

Deno.test("clone - Map and Set", () => {
  const map = new Map([["a", 1], ["b", 2]]);
  const clonedMap = clone(map);
  assertEquals(clonedMap.get("a"), 1);
  clonedMap.set("a", 99);
  assertEquals(map.get("a"), 1);

  const set = new Set([1, 2, 3]);
  const clonedSet = clone(set);
  assertEquals(clonedSet.has(1), true);
  clonedSet.add(4);
  assertEquals(set.has(4), false);
});

Deno.test("copies - basic", () => {
  const source = { a: 1, b: 2, c: 3 };
  const dest: any = { a: 10, b: 20, d: 40 };
  const result = copies(source, dest);
  assertEquals(result, { a: 1, b: 2, c: 3, d: 40 });
});

Deno.test("copies - nested objects", () => {
  const source = { a: 1, b: { c: 2, d: 3 } };
  const dest: any = { a: 10, b: { c: 20, e: 30 } };
  const result = copies(source, dest);
  assertEquals(result, { a: 1, b: { c: 2, d: 3, e: 30 } });
});

Deno.test("copies - matched=true", () => {
  const source = { a: 1, b: 2, c: 3 };
  const dest: any = { a: 10, b: 20, d: 40 };
  const result = copies(source, dest, true);
  assertEquals(result, { a: 1, b: 2, d: 40 });
});

Deno.test("copies - excepts", () => {
  const source = { a: 1, b: 2, c: 3 };
  const dest: any = { a: 10 };
  const result = copies(source, dest, false, ["b", "c"]);
  assertEquals(result, { a: 1 });
});

Deno.test("copies - edge cases", () => {
  assertEquals(copies({}, { a: 1 }), { a: 1 });
  assertEquals(copies({ a: 1 }, {}), { a: 1 });
  assertEquals(copies({ a: null, b: 1 }, { a: 10 }), { a: null, b: 1 });
  assertEquals(copies({ a: undefined, b: 1 }, { a: 10 }), {
    a: undefined,
    b: 1,
  });
});
