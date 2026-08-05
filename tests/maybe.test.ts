import { assertEquals } from "https://deno.land/std/assert/mod.ts";

import { maybe } from "../src/maybe.ts";

Deno.test("maybe - basic operations", () => {
  assertEquals(maybe(5).value(), 5);
  assertEquals(maybe("hello").value(), "hello");
  assertEquals(maybe(null).value(), null);
  assertEquals(maybe(undefined).value(), undefined);
  assertEquals(maybe(5).isNil(), false);
  assertEquals(maybe(0).isNil(), false);
  assertEquals(maybe("").isNil(), false);
  assertEquals(maybe(null).isNil(), true);
  assertEquals(maybe(undefined).isNil(), true);
});

Deno.test("maybe - inspect and toArray", () => {
  assertEquals(maybe(5).inspect(), "Maybe(5)");
  assertEquals(maybe("hello").inspect(), "Maybe(hello)");
  assertEquals(maybe(null).inspect(), "Maybe(null)");
  assertEquals(maybe(5).toArray(), [5]);
  assertEquals(maybe(null).toArray(), []);
});

Deno.test("maybe - map", () => {
  assertEquals(maybe(5).map((x: number) => x * 2).value(), 10);
  assertEquals(maybe<number>(null).map((x: number) => x * 2).value(), null);
  assertEquals(
    maybe(5).map((x: number) => x + 5).map((x: number) => x * 2).map((
      x: number,
    ) => x - 3).value(),
    17,
  );
  assertEquals(
    maybe(5).map((x: number) => x + 5).map((): any => null).map((x: number) =>
      x * 2
    ).value(),
    null,
  );
});

Deno.test("maybe - filter", () => {
  assertEquals(maybe(5).filter((x: number) => x > 3).value(), 5);
  assertEquals(maybe(5).filter((x: number) => x > 10).value(), null);
  assertEquals(maybe<number>(null).filter((x: number) => x > 3).value(), null);
  assertEquals(maybe(5).when((x: number) => x > 3).value(), 5);
});

Deno.test("maybe - orElse", () => {
  assertEquals(maybe(5).orElse(() => 0).value(), 5);
  assertEquals(maybe<number>(null).orElse(() => 0).value(), 0);
  assertEquals(
    maybe<string>(null).getOrElse(() => "default").value(),
    "default",
  );
});

Deno.test("maybe - tap", () => {
  let tappedValue: number | null = null;
  maybe(5).tap((x: number) => {
    tappedValue = x;
  }).value();
  assertEquals(tappedValue, 5);

  let tapped = false;
  maybe<number>(null).tap(() => {
    tapped = true;
  }).value();
  assertEquals(tapped, false);
});

Deno.test("maybe - complex chains", () => {
  const plus5 = (x: number) => x + 5;
  const minus2 = (x: number) => x - 2;
  const isNumber = (x: any) => Number(x) === x;
  const toString = (x: number) => "The value is " + String(x);
  const getDefault = () => "This is default value";

  const x1 = maybe(5)
    .filter(isNumber)
    .map(plus5)
    .map(minus2)
    .map(toString)
    .orElse(getDefault)
    .value();
  assertEquals(x1, "The value is 8");

  const x2 = maybe("nothing" as any)
    .filter(isNumber)
    .map(plus5)
    .map(minus2)
    .map(toString)
    .orElse(getDefault)
    .value();
  assertEquals(x2, "This is default value");
});

Deno.test("maybe - edge cases", () => {
  assertEquals(maybe(0).value(), 0);
  assertEquals(maybe("").value(), "");
  assertEquals(maybe(false).value(), false);
  assertEquals(maybe(0).isNil(), false);
  assertEquals(maybe("").isNil(), false);
  assertEquals(maybe(false).isNil(), false);
});
