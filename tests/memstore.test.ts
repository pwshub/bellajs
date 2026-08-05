import { assertEquals } from "https://deno.land/std/assert/mod.ts";

import { memstore } from "../src/memstore.ts";

Deno.test("memstore - basic operations", () => {
  const store = memstore();
  store.set("key1", "value1");
  assertEquals(store.get("key1"), "value1");
  assertEquals(store.get("nonexistent"), null);
  assertEquals(store.has("key1"), true);
  assertEquals(store.has("nonexistent"), false);
  assertEquals(store.del("key1"), true);
  assertEquals(store.get("key1"), null);
  assertEquals(store.del("key1"), false);
});

Deno.test("memstore - clear and size", () => {
  const store = memstore();
  store.set("key1", "value1");
  store.set("key2", "value2");
  assertEquals(store.size(), 2);
  store.clear();
  assertEquals(store.size(), 0);
});

Deno.test("memstore - stores any type", () => {
  const store = memstore();
  store.set("string", "hello");
  store.set("number", 42);
  store.set("boolean", true);
  store.set("object", { a: 1 });
  store.set("array", [1, 2, 3]);
  store.set("null", null);
  store.set("undefined", undefined);

  assertEquals(store.get("string"), "hello");
  assertEquals(store.get("number"), 42);
  assertEquals(store.get("boolean"), true);
  assertEquals(store.get("object"), { a: 1 });
  assertEquals(store.get("array"), [1, 2, 3]);
  assertEquals(store.get("null"), null);
  assertEquals(store.get("undefined"), undefined);
});

Deno.test("memstore - method chaining", () => {
  const store = memstore();
  store.set("key1", "value1").set("key2", "value2");
  assertEquals(store.get("key1"), "value1");
  assertEquals(store.get("key2"), "value2");
  const result = store.clear();
  assertEquals(typeof result.set, "function");
});

Deno.test("memstore - entries", () => {
  const store = memstore();
  store.set("key1", "value1");
  store.set("key2", "value2");
  const entries = [...store.entries()];
  assertEquals(entries.length, 2);
  assertEquals(entries.some(([k, v]) => k === "key1" && v === "value1"), true);
  assertEquals(entries.some(([k, v]) => k === "key2" && v === "value2"), true);
});

Deno.test("memstore - entries empty store", () => {
  const store = memstore();
  assertEquals([...store.entries()], []);
});

Deno.test("memstore - aliases", () => {
  const store = memstore();
  store.save("key1", "value1");
  assertEquals(store.get("key1"), "value1");
  assertEquals(store.load("key1"), "value1");
});
