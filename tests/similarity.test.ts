import { assertEquals } from "https://deno.land/std/assert/mod.ts";

import {
  compareTwoStrings,
  cosineSimilarity,
  isSimilar,
  toBow,
  tokenize,
} from "../src/similarity.ts";

Deno.test("tokenize", () => {
  assertEquals(tokenize("hello world"), ["hello", "world"]);
  assertEquals(tokenize("https://example.com/path/to/page"), [
    "https:",
    "example",
    "com",
    "path",
    "to",
    "page",
  ]);
  assertEquals(tokenize("some_variable_name"), ["some", "variable", "name"]);
  assertEquals(tokenize("some-kebab-case-text"), [
    "some",
    "kebab",
    "case",
    "text",
  ]);
  assertEquals(tokenize("some/url_path-file.name"), [
    "some",
    "url",
    "path",
    "file",
    "name",
  ]);
  assertEquals(tokenize("Hello WORLD"), ["hello", "world"]);
  assertEquals(tokenize("hello  world"), ["hello", "world"]);
  assertEquals(tokenize(""), []);
  assertEquals(tokenize(null as any), []);
  assertEquals(tokenize(undefined as any), []);
});

Deno.test("toBow", () => {
  assertEquals(toBow(["hello", "world", "hello"]), { hello: 2, world: 1 });
  assertEquals(toBow([]), {});
  assertEquals(toBow(["test"]), { test: 1 });
  assertEquals(toBow(["a", "a", "a", "a"]), { a: 4 });
});

Deno.test("cosineSimilarity", () => {
  assertEquals(cosineSimilarity({ a: 1, b: 2 }, { a: 1, b: 2 }) > 0.99, true);
  assertEquals(cosineSimilarity({ a: 1 }, { b: 1 }), 0);
  const partial = cosineSimilarity({ a: 1, b: 1 }, { a: 1, c: 1 });
  assertEquals(partial > 0, true);
  assertEquals(partial < 1, true);
  assertEquals(cosineSimilarity({}, {}), 0);
  assertEquals(cosineSimilarity({ a: 2 }, { a: 4 }), 1);
});

Deno.test("compareTwoStrings", () => {
  assertEquals(compareTwoStrings("hello world", "hello world") > 0.99, true);
  assertEquals(compareTwoStrings("foo bar", "baz qux"), 0);
  assertEquals(compareTwoStrings("hello world", "hello there") > 0.4, true);
  assertEquals(compareTwoStrings("Hello World", "hello WORLD") > 0.99, true);
  assertEquals(compareTwoStrings("hello-world", "hello_world") > 0.99, true);
  assertEquals(compareTwoStrings("", ""), 0);
  assertEquals(compareTwoStrings("hello", ""), 0);
});

Deno.test("isSimilar", () => {
  assertEquals(isSimilar("hello world", "hello world", 0.9), true);
  assertEquals(isSimilar("hello world", "hello there", 0.9), false);
  assertEquals(isSimilar("hello world", "hello there", 0.4), true);
  assertEquals(isSimilar("foo bar", "foo"), true);
  assertEquals(isSimilar("foo bar", "completely different"), false);
  assertEquals(isSimilar("", "", 0), true);
  assertEquals(isSimilar("test", "", 0), true);
});
