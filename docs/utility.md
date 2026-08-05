# Utility Functions

Helper utilities for property definition.

## Installation

```typescript
import { defineProp } from "jsr:@pwshub/bellajs";
```

### `defineProp(ob, key, val, config)`

Define a property on an object with configurable options. Shorthand for
`Object.defineProperty()`.

Parameters:

- `ob` — The object to define property on
- `key` — Property name
- `val` — Property value
- `config` — Configuration options:
  - `writable` (default: `false`) — Whether value can be changed
  - `configurable` (default: `false`) — Whether property can be
    deleted/reconfigured
  - `enumerable` (default: `false`) — Whether shows in `for...in` loops

Returns: `void` (modifies object in place)

```typescript
const obj: Record<string, unknown> = {};
defineProp(obj, "name", "Alice", {
  writable: true,
  configurable: true,
  enumerable: true,
});
obj.name; // "Alice"
```
