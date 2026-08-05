import { assertEquals } from "https://deno.land/std/assert/mod.ts";

import {
  chunk,
  compact,
  difference,
  first,
  flatten,
  groupBy,
  intersection,
  last,
  pick,
  shuffle,
  sort,
  sortBy,
  unique,
  zip,
} from "../src/array.ts";

Deno.test("unique", () => {
  assertEquals(unique([1, 2, 2, 3, 3, 4]), [1, 2, 3, 4]);
  assertEquals(unique([]), []);
  assertEquals(unique([5, 5, 5, 5]), [5]);
});

Deno.test("sort", () => {
  assertEquals(sort([3, 1, 4, 1, 5]), [1, 1, 3, 4, 5]);
  assertEquals(sort(["banana", "apple", "cherry"]), [
    "apple",
    "banana",
    "cherry",
  ]);
  assertEquals(sort([3, 1, 4], (a, b) => b - a), [4, 3, 1]);
  const original = [3, 1, 2];
  sort(original);
  assertEquals(original, [3, 1, 2]);
  assertEquals(sort([]), []);
});

Deno.test("sortBy", () => {
  const arr = [{ age: 3 }, { age: 1 }, { age: 2 }];
  assertEquals(sortBy(arr, 1, "age"), [{ age: 1 }, { age: 2 }, { age: 3 }]);
  assertEquals(sortBy(arr, -1, "age"), [{ age: 3 }, { age: 2 }, { age: 1 }]);
  assertEquals(sortBy([], 1, "age"), []);
  assertEquals(sortBy([{ age: 3 }], 1, "name"), [{ age: 3 }]);
});

Deno.test("shuffle", () => {
  const original = [1, 2, 3, 4, 5];
  const result = shuffle(original);
  assertEquals(result.length, original.length);
  assertEquals(result.sort((a, b) => a - b), original);
  const orig = [1, 2, 3];
  shuffle(orig);
  assertEquals(orig, [1, 2, 3]);
  assertEquals(shuffle([]), []);
  assertEquals(shuffle([42]), [42]);
});

Deno.test("pick", () => {
  assertEquals(pick([1, 2, 3, 4, 5], 2).length, 2);
  assertEquals(pick([1, 2, 3], 5).length, 3);
  assertEquals(pick([1, 2, 3]).length, 1);
  assertEquals(pick([1, 2, 3], 0), []);
  assertEquals(pick([], 3), []);
});

Deno.test("chunk", () => {
  assertEquals(chunk([1, 2, 3, 4, 5], 2), [[1, 2], [3, 4], [5]]);
  assertEquals(chunk([1, 2, 3, 4], 2), [[1, 2], [3, 4]]);
  assertEquals(chunk([1, 2, 3], 5), [[1, 2, 3]]);
  assertEquals(chunk([], 3), []);
  assertEquals(chunk([1, 2, 3], 1), [[1], [2], [3]]);
});

Deno.test("flatten", () => {
  assertEquals(flatten([1, [2, [3, 4]]]), [1, 2, [3, 4]]);
  assertEquals(flatten([1, [2, [3, 4]]], 2), [1, 2, 3, 4]);
  assertEquals(flatten([1, [2, [3, [4]]]], 3), [1, 2, 3, 4]);
  assertEquals(flatten([1, 2, 3]), [1, 2, 3]);
  assertEquals(flatten([]), []);
});

Deno.test("groupBy", () => {
  const arr = [
    { role: "admin", name: "Alice" },
    { role: "user", name: "Bob" },
    { role: "admin", name: "Charlie" },
  ];
  const result = groupBy(arr, "role");
  assertEquals(result.admin.length, 2);
  assertEquals(result.user.length, 1);

  const nums = [1, 2, 3, 4, 5, 6];
  const grouped = groupBy(nums, (n: number) => n % 2 === 0 ? "even" : "odd");
  assertEquals(grouped.even, [2, 4, 6]);
  assertEquals(grouped.odd, [1, 3, 5]);
  assertEquals(groupBy([], "role"), {});
});

Deno.test("first", () => {
  assertEquals(first([1, 2, 3, 4, 5], 2), [1, 2]);
  assertEquals(first([1, 2, 3]), [1]);
  assertEquals(first([1, 2, 3], 10), [1, 2, 3]);
  assertEquals(first([], 3), []);
});

Deno.test("last", () => {
  assertEquals(last([1, 2, 3, 4, 5], 2), [4, 5]);
  assertEquals(last([1, 2, 3]), [3]);
  assertEquals(last([1, 2, 3], 10), [1, 2, 3]);
  assertEquals(last([], 3), []);
});

Deno.test("compact", () => {
  assertEquals(compact([0, 1, false, 2, "", 3, null, undefined]), [1, 2, 3]);
  assertEquals(compact([1, "hello", {}, []]), [1, "hello", {}, []]);
  assertEquals(compact([0, false, null, undefined, ""]), []);
  assertEquals(compact([]), []);
});

Deno.test("difference", () => {
  assertEquals(difference([1, 2, 3, 4], [2, 3]), [1, 4]);
  assertEquals(difference([1, 2, 3], [1, 2, 3]), []);
  assertEquals(difference([1, 2, 3], [4, 5, 6]), [1, 2, 3]);
  assertEquals(difference([1, 2, 3], []), [1, 2, 3]);
  assertEquals(difference([], [1, 2, 3]), []);
});

Deno.test("intersection", () => {
  assertEquals(intersection([1, 2, 3], [2, 3, 4]), [2, 3]);
  assertEquals(intersection([1, 2, 3], [4, 5, 6]), []);
  assertEquals(intersection([1, 2, 3], [1, 2, 3]), [1, 2, 3]);
  assertEquals(intersection([], [1, 2, 3]), []);
});

Deno.test("zip", () => {
  assertEquals(zip([1, 2, 3], ["a", "b", "c"]), [[1, "a"], [2, "b"], [3, "c"]]);
  assertEquals(zip([1, 2], ["a", "b", "c"]), [[1, "a"], [2, "b"]]);
  assertEquals(zip([], [1, 2, 3]), []);
});
