# Object Utilities

Deep cloning and property copying functions.

## Installation

```typescript
import { clone, copies } from "jsr:@pwshub/bellajs";
```

### `clone(val)`

Create a deep copy using `structuredClone`.

Preserves:

- Plain objects
- Arrays
- Date objects
- Circular references
- RegExp, Error, Map, Set

```typescript
clone({ a: 1, b: { c: 2 } }); // { a: 1, b: { c: 2 } }
clone([1, [2, [3]]]); // [1, [2, [3]]]
clone(new Date("2026-01-01")); // Date object (independent copy)
```

### `copies(source, dest, matched, excepts)`

Copy properties from source to destination object. Nested objects/arrays are
deep copied.

```typescript
copies({ a: 1, b: 2 }, {}); // { a: 1, b: 2 }
copies({ a: 1, b: 2 }, { a: 10 }, true); // { a: 1 } (only matching keys)
copies({ a: 1, b: 2 }, {}, false, ["b"]); // { a: 1 } (except b)
```

Parameters:

- `matched` (default: `false`) — If true, only copy properties that exist in
  dest
- `excepts` (default: `[]`) — Array of property names to exclude
