import { assertEquals } from "https://deno.land/std/assert/mod.ts";

import {
  hasProperty,
  isAbsoluteUrl,
  isArray,
  isBoolean,
  isDate,
  isEmail,
  isEmpty,
  isFunction,
  isInteger,
  isNil,
  isNull,
  isNumber,
  isObject,
  isString,
  isUndefined,
  isValidUrl,
} from "../src/detection.ts";

Deno.test("isNumber", () => {
  const positives = [1, 1.5, 0, 9999, -2];
  for (const val of positives) {
    assertEquals(isNumber(val), true);
  }
  const negatives = [{}, [], "", null, undefined];
  for (const val of negatives) {
    assertEquals(isNumber(val), false);
  }
});

Deno.test("isInteger", () => {
  const positives = [1, 1000, 9999, 0, -3];
  for (const val of positives) {
    assertEquals(isInteger(val), true);
  }
  const negatives = [1.5, -3.2, "", undefined];
  for (const val of negatives) {
    assertEquals(isInteger(val), false);
  }
});

Deno.test("isArray", () => {
  const positives = [[], [1, 2, 3], Array.from(new Set())];
  for (const val of positives) {
    assertEquals(isArray(val), true);
  }
  const negatives = [1.5, "", undefined];
  for (const val of negatives) {
    assertEquals(isArray(val), false);
  }
});

Deno.test("isString", () => {
  const positives = ["", "abc xyz", "10000"];
  for (const val of positives) {
    assertEquals(isString(val), true);
  }
  const negatives = [{}, [], 30, 1.5, null, undefined];
  for (const val of negatives) {
    assertEquals(isString(val), false);
  }
});

Deno.test("isBoolean", () => {
  const positives = [true, false];
  for (const val of positives) {
    assertEquals(isBoolean(val), true);
  }
  const negatives = [{}, [], "", 1, 0, null, undefined];
  for (const val of negatives) {
    assertEquals(isBoolean(val), false);
  }
});

Deno.test("isNull", () => {
  assertEquals(isNull(null), true);
  const negatives = [{}, [], "", 0, undefined];
  for (const val of negatives) {
    assertEquals(isNull(val), false);
  }
});

Deno.test("isUndefined", () => {
  assertEquals(isUndefined(undefined), true);
  assertEquals(isUndefined(undefined), true);
  const negatives = [{}, [], "", 0, null];
  for (const val of negatives) {
    assertEquals(isUndefined(val), false);
  }
});

Deno.test("isNil", () => {
  assertEquals(isNil(undefined), true);
  assertEquals(isNil(null), true);
  const negatives = [{}, [], "", 0];
  for (const val of negatives) {
    assertEquals(isNil(val), false);
  }
});

Deno.test("isFunction", () => {
  const positives = [function () {}, () => {}];
  for (const val of positives) {
    assertEquals(isFunction(val), true);
  }
  const negatives = [{}, [], "", 0, null];
  for (const val of negatives) {
    assertEquals(isFunction(val), false);
  }
});

Deno.test("isObject", () => {
  const ob = new Object();
  const positives = [{}, ob, Object.create({})];
  for (const val of positives) {
    assertEquals(isObject(val), true);
  }
  const negatives = [17, [], "", 0, null, () => {}, true];
  for (const val of negatives) {
    assertEquals(isObject(val), false);
  }
});

Deno.test("isDate", () => {
  const dt = new Date();
  assertEquals(isDate(dt), true);
  const negatives = [
    17,
    [],
    "",
    0,
    null,
    () => {},
    true,
    {},
    new Date().toUTCString(),
  ];
  for (const val of negatives) {
    assertEquals(isDate(val), false);
  }
});

Deno.test("isEmail", () => {
  const positives = ["admin@pwshub.com", "abc@qtest.com"];
  for (const val of positives) {
    assertEquals(isEmail(val), true);
  }
  const negatives = [{}, [], "", 0, undefined, "a23b@qtest@com"];
  for (const val of negatives) {
    assertEquals(isEmail(val), false);
  }
});

Deno.test("isEmpty", () => {
  const positives = ["", 0, {}, [], undefined, null];
  for (const val of positives) {
    assertEquals(isEmpty(val), true);
  }
  const negatives = [{ a: 1 }, "12", 9, [7, 1]];
  for (const val of negatives) {
    assertEquals(isEmpty(val), false);
  }
});

Deno.test("hasProperty", () => {
  const obj = { name: "alice", age: 17 };
  assertEquals(hasProperty(obj, "name"), true);
  assertEquals(hasProperty(obj, "age"), true);
  assertEquals(hasProperty(obj, "email"), false);
  assertEquals(hasProperty(obj, "__proto__"), false);
});

Deno.test("isValidUrl", () => {
  const validUrls = [
    "https://example.com",
    "http://example.com",
    "https://example.com/path?query=1",
    "http://localhost:3000",
    "https://sub.example.com/path",
  ];
  for (const url of validUrls) {
    assertEquals(isValidUrl(url), true);
  }
  const invalidUrls = [
    "ftp://example.com",
    "not-a-url",
    "",
    "javascript:alert(1)",
    "mailto:test@example.com",
  ];
  for (const url of invalidUrls) {
    assertEquals(isValidUrl(url), false);
  }
});

Deno.test("isAbsoluteUrl", () => {
  const absoluteUrls = [
    "https://example.com",
    "http://example.com",
    "//example.com/path",
    "//cdn.example.com/lib.js",
  ];
  for (const url of absoluteUrls) {
    assertEquals(isAbsoluteUrl(url), true);
  }
  const relativeUrls = [
    "/path/to/resource",
    "relative/path",
    "../parent/path",
    "path/to/file",
    "",
    "ftp://example.com",
  ];
  for (const url of relativeUrls) {
    assertEquals(isAbsoluteUrl(url), false);
  }
});
