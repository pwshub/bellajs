# Store Utilities

In-memory key-value store with TTL support.

## Installation

```typescript
import { memstore } from "jsr:@pwshub/bellajs";
```

## Function

### `memstore(defaultTtl)`

Create an in-memory key-value store with optional TTL support.

- Default TTL: `-1` (no expiration)
- TTL in seconds

```typescript
const cache = memstore(300); // 5-minute default TTL

cache.set("user:1", { name: "John" });
cache.get("user:1"); // { name: "John" }

cache.set("session:abc", data, 3600); // custom TTL: 1 hour
cache.has("user:1"); // true
cache.del("user:1");
cache.clear();
cache.size(); // count of valid (non-expired) entries
cache.entries(); // iterate [key, value] pairs
```

## Store Methods

| Method                  | Description                                                |
| ----------------------- | ---------------------------------------------------------- |
| `.set(key, value, ttl)` | Store value with optional TTL. Returns store for chaining. |
| `.get(key)`             | Retrieve value. Returns `null` if not found or expired.    |
| `.has(key)`             | Check if key exists and is not expired.                    |
| `.del(key)`             | Delete key. Returns `true` if deleted.                     |
| `.clear()`              | Remove all entries.                                        |
| `.size()`               | Get count of valid (non-expired) entries.                  |
| `.entries()`            | Iterate over valid `[key, value]` pairs.                   |

### Aliases

- `save()` → `set()`
- `load()` → `get()`

## TTL Behavior

- Default TTL used if no per-key TTL specified
- TTL in seconds
- `-1` = never expires
