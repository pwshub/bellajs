# Functional Utilities

Function composition, piping, currying, and safe null handling.

## Installation

```typescript
import { compose, curry, maybe, pipe } from "jsr:@pwshub/bellajs";
```

## Function Composition

### `compose(...fns)`

Compose functions from right to left.

```typescript
compose(f, g, h)(x) === f(g(h(x)));
```

### `pipe(...fns)`

Pipe functions from left to right.

```typescript
pipe(f, g, h)(x) === h(g(f(x)));
```

## Currying

### `curry(fn)`

Transform a function into a curried version that can be called with partial
arguments.

```typescript
const add = (a: number, b: number, c: number) => a + b + c;
const curriedAdd = curry(add);

curriedAdd(1, 2, 3); // 6
curriedAdd(1)(2)(3); // 6
curriedAdd(1, 2)(3); // 6
```

## Safe Null Handling

### `maybe(val)`

Create a Maybe instance for safe null/undefined handling with method chaining.

```typescript
maybe(5)
  .map((x) => x + 5)
  .map((x) => x * 2)
  .value(); // 20

maybe<number>(null)
  .map((x) => x + 5) // skipped
  .orElse(() => 0)
  .value(); // 0
```

### Maybe Methods

| Method                           | Description                          |
| -------------------------------- | ------------------------------------ |
| `.isNil()`                       | Check if value is null/undefined     |
| `.value()`                       | Extract the wrapped value            |
| `.map(fn)`                       | Transform value if not nil           |
| `.filter(fn)` / `.when(fn)`      | Keep value only if predicate is true |
| `.orElse(fn)` / `.getOrElse(fn)` | Provide default if nil               |
| `.tap(fn)`                       | Side effect without transformation   |
| `.toArray()`                     | Convert to array (empty if nil)      |
| `.inspect()`                     | Debug string representation          |
