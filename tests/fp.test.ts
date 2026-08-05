import { assertEquals } from "https://deno.land/std/assert/mod.ts";

import { compose, curry, pipe } from "../src/fp.ts";

Deno.test("curry - 3 arguments", () => {
  const sum = curry((a: number, b: number, c: number) => a + b + c);
  assertEquals(sum(3)(2)(1), 6);
  assertEquals(sum(1)(2)(3), 6);
  assertEquals(sum(1, 2)(3), 6);
  assertEquals(sum(1)(2, 3), 6);
  assertEquals(sum(1, 2, 3), 6);
});

Deno.test("curry - 2 arguments", () => {
  const multiply = curry((a: number, b: number) => a * b);
  const double = multiply(2);
  assertEquals(double(5), 10);
  assertEquals(double(10), 20);
});

Deno.test("curry - 4 arguments", () => {
  const add = curry((a: number, b: number, c: number, d: number) =>
    a + b + c + d
  );
  assertEquals(add(1)(2)(3)(4), 10);
  assertEquals(add(1, 2)(3, 4), 10);
  assertEquals(add(1)(2, 3, 4), 10);
});

Deno.test("compose", () => {
  const f1 = (name: string) => `f1 ${name}`;
  const f2 = (name: string) => `f2 ${name}`;
  const f3 = (name: string) => `f3 ${name}`;
  assertEquals(compose(f1, f2, f3)("Alice"), "f1 f2 f3 Alice");

  const add3 = (num: number) => num + 3;
  const mul6 = (num: number) => num * 6;
  const div2 = (num: number) => num / 2;
  const sub5 = (num: number) => num - 5;
  assertEquals(compose(sub5, div2, mul6, add3)(5), 19);
});

Deno.test("compose - two functions", () => {
  const add1 = (x: number) => x + 1;
  const mul2 = (x: number) => x * 2;
  assertEquals(compose(mul2, add1)(5), 12);
});

Deno.test("compose - string transformations", () => {
  const uppercase = (s: string) => s.toUpperCase();
  const exclaim = (s: string) => s + "!";
  assertEquals(compose(exclaim, uppercase)("hello"), "HELLO!");
});

Deno.test("pipe", () => {
  const f1 = (name: string) => `f1 ${name}`;
  const f2 = (name: string) => `f2 ${name}`;
  const f3 = (name: string) => `f3 ${name}`;
  assertEquals(pipe(f1, f2, f3)("Alice"), "f3 f2 f1 Alice");

  const add3 = (num: number) => num + 3;
  const mul6 = (num: number) => num * 6;
  const div2 = (num: number) => num / 2;
  const sub5 = (num: number) => num - 5;
  assertEquals(pipe(add3, mul6, div2, sub5)(5), 19);
});

Deno.test("pipe - two functions", () => {
  const add1 = (x: number) => x + 1;
  const mul2 = (x: number) => x * 2;
  assertEquals(pipe(add1, mul2)(5), 12);
});

Deno.test("pipe is compose in reverse order", () => {
  const add1 = (x: number) => x + 1;
  const mul2 = (x: number) => x * 2;
  assertEquals(pipe(add1, mul2)(5), compose(mul2, add1)(5));
});

Deno.test("curry + pipe integration", () => {
  const add = curry((a: number, b: number) => a + b);
  const multiply = curry((a: number, b: number) => a * b);
  const add5 = add(5);
  const double = multiply(2);
  assertEquals(pipe(add5, double)(10), 30);
});

Deno.test("complex pipeline", () => {
  const words = "hello world this is a test";
  const process = pipe(
    (text: string) => text.split(" "),
    (arr: string[]) => arr.filter((w) => w.length > 3),
    (arr: string[]) => arr.map((w) => w.toUpperCase()),
    (arr: string[]) => arr.join("-"),
  );
  assertEquals(process(words), "HELLO-WORLD-THIS-TEST");
});
