import { assertEquals } from "https://deno.land/std/assert/mod.ts";

import {
  escapeHTML,
  findWordsIn,
  findWordsInWithRegExp,
  getArrayOfWords,
  getSentences,
  getTTR,
  getWordCount,
  getWordMap,
  slugify,
  stripAccent,
  stripTags,
  truncate,
  truncateByByte,
  truncateByChar,
  truncateByCodePoint,
  truncateByGrapheme,
  truncateByWord,
  ucfirst,
  ucwords,
  unescapeHTML,
} from "../src/string.ts";

Deno.test("truncate (deprecated alias)", () => {
  assertEquals(truncate("hello world", 0), "hello world");
  assertEquals(
    truncate("hello world this is a test", 3),
    "hello world this...",
  );
  assertEquals(truncate("", 5), "");
  assertEquals(truncate("hello world", 10), "hello world");
});

Deno.test("truncateByWord", () => {
  assertEquals(truncateByWord("hello world", 0), "hello world");
  assertEquals(
    truncateByWord("hello world this is a test", 3),
    "hello world this...",
  );
  assertEquals(truncateByWord("", 5), "");
  assertEquals(truncateByWord("hello world", 10), "hello world");
});

Deno.test("truncateByChar", () => {
  assertEquals(truncateByChar("hello world", 0), "hello world");
  assertEquals(truncateByChar("hello world", 5), "hello...");
  assertEquals(truncateByChar("", 3), "");
  assertEquals(truncateByChar("hello", 10), "hello");
  assertEquals(truncateByChar("こんにちは", 3), "こんに...");
  assertEquals(truncateByChar("👨‍👩‍👧‍👦abc", 3), "👨‍👩‍👧‍👦ab...");
  assertEquals(truncateByChar("hello", 5), "hello");
});

Deno.test("truncateByGrapheme is alias for truncateByChar", () => {
  assertEquals(truncateByGrapheme, truncateByChar);
  assertEquals(truncateByGrapheme("Hello world", 5), "Hello...");
});

Deno.test("truncateByCodePoint", () => {
  assertEquals(truncateByCodePoint("Hello", 5), "Hello");
  assertEquals(truncateByCodePoint("Hello world", 5), "Hello");
  assertEquals(truncateByCodePoint("", 3), "");
  assertEquals(truncateByCodePoint("abc😀def", 4), "abc😀");
  assertEquals(truncateByCodePoint("𝄞abc", 2), "𝄞a");
});

Deno.test("truncateByByte", () => {
  assertEquals(truncateByByte("Hello", 10), "Hello");
  assertEquals(truncateByByte("Hello world", 5), "Hello");
  assertEquals(truncateByByte("", 3), "");
  assertEquals(truncateByByte("café", 4), "caf");
  assertEquals(truncateByByte("𝄞abc", 4), "𝄞");
});

Deno.test("stripTags", () => {
  assertEquals(stripTags("<p>Hello <b>world</b></p>"), "Hello world");
  assertEquals(stripTags("Hello world"), "Hello world");
  assertEquals(stripTags(""), "");
});

Deno.test("escapeHTML", () => {
  assertEquals(
    escapeHTML('<script>alert("XSS")</script>'),
    "&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;",
  );
  assertEquals(escapeHTML("Tom & Jerry"), "Tom &amp; Jerry");
  assertEquals(escapeHTML("Hello world"), "Hello world");
});

Deno.test("unescapeHTML", () => {
  assertEquals(
    unescapeHTML("&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;"),
    '<script>alert("XSS")</script>',
  );
  assertEquals(unescapeHTML("Tom &amp; Jerry"), "Tom & Jerry");
});

Deno.test("ucfirst", () => {
  assertEquals(ucfirst("hello"), "Hello");
  assertEquals(ucfirst("HELLO"), "Hello");
  assertEquals(ucfirst("a"), "A");
  assertEquals(ucfirst(""), "");
});

Deno.test("ucwords", () => {
  assertEquals(ucwords("hello world"), "Hello World");
  assertEquals(ucwords("hello  world"), "Hello  World");
  assertEquals(ucwords(""), "");
});

Deno.test("stripAccent", () => {
  assertEquals(stripAccent("café"), "cafe");
  assertEquals(stripAccent("naïve"), "naive");
  assertEquals(stripAccent("ÉÀ"), "EA");
  assertEquals(stripAccent("hello"), "hello");
});

Deno.test("slugify", () => {
  assertEquals(slugify("Hello World"), "hello-world");
  assertEquals(slugify("Café résumé"), "cafe-resume");
  assertEquals(slugify("Hello World", "_"), "hello_world");
  assertEquals(slugify("Hello! @World#"), "hello-world");
});

Deno.test("getSentences", () => {
  const result = getSentences("Hello world. How are you? I am fine.");
  assertEquals(result.length, 3);
  assertEquals(getSentences(""), []);
  assertEquals(getSentences("Hello world").length, 1);
});

Deno.test("getArrayOfWords", () => {
  const result = getArrayOfWords("Hello, world!");
  assertEquals(result.includes("Hello"), true);
  assertEquals(result.includes("world"), true);
  assertEquals(getArrayOfWords(""), []);
  assertEquals(getArrayOfWords("Hello, world!").length, 2);
});

Deno.test("getWordCount", () => {
  assertEquals(getWordCount("hello world"), 2);
  assertEquals(getWordCount("one"), 1);
  assertEquals(getWordCount(""), 0);
  assertEquals(getWordCount("hello   world"), 2);
});

Deno.test("findWordsIn", () => {
  assertEquals(findWordsIn("Hello world", ["hello", "foo"]), ["hello"]);
  assertEquals(findWordsIn("Hello World", ["HELLO"]), ["HELLO"]);
  assertEquals(findWordsIn("hello", ["foo", "bar"]), []);
  assertEquals(findWordsIn("", ["hello"]), []);
  assertEquals(findWordsIn("こんにちは 世界", ["こんにちは"]), ["こんにちは"]);
});

Deno.test("findWordsInWithRegExp", () => {
  assertEquals(findWordsInWithRegExp("Hello world", ["hello", "foo"]), [
    "hello",
  ]);
  assertEquals(findWordsInWithRegExp("Hello World", ["HELLO"]), ["HELLO"]);
  assertEquals(findWordsInWithRegExp("hello", ["foo", "bar"]), []);
  assertEquals(findWordsInWithRegExp("", ["hello"]), []);
});

Deno.test("getWordMap", () => {
  assertEquals(getWordMap("hello world hello"), { hello: 2, world: 1 });
  const result = getWordMap("I am a test");
  assertEquals("I" in result, false);
  assertEquals("am" in result, false);
  assertEquals("a" in result, false);
  assertEquals("test" in result, true);
  assertEquals(getWordMap(""), {});
});

Deno.test("getTTR", () => {
  assertEquals(getTTR("hello world") >= 1, true);
  const text = "This is a longer text that will take some time to read. "
    .repeat(10);
  assertEquals(getTTR(text, 10) > getTTR(text, 0), true);
  assertEquals(getTTR(""), 0);
});
