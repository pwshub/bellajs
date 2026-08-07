# BellaJS

A lightweight, functional utility library for Deno, Node.js, and Bun.

[![JSR](https://jsr.io/badges/@pwshub/bellajs)](https://jsr.io/@pwshub/bellajs)
[![npm version](https://badge.fury.io/js/@pwshub%2Fbellajs.svg)](https://badge.fury.io/js/@pwshub%2Fbellajs)
![CI test](https://github.com/pwshub/bellajs/workflows/ci-test/badge.svg)

## Features

- Type checking and validation
- String processing and similarity
- Array, object, and functional utilities
- Date, number, and secure random utilities
- TTL cache, helper utilities, and ranking algorithms

## Installation

### Deno

```bash
deno add jsr:@pwshub/bellajs
```

### Node.js / Bun

```bash
pnpm i jsr:@pwshub/bellajs
# or
vlt install jsr:@pwshub/bellajs
# or
bunx jsr add @pwshub/bellajs
# or
npx jsr add @pwshub/bellajs
```

Alternatively, install from npm:

```bash
pnpm i @pwshub/bellajs
# or
bun add @pwshub/bellajs
# or
vlt add @pwshub/bellajs
# or
npm install @pwshub/bellajs
```

### Browser

```html
<script type="module">
import { genid } from "https://esm.sh/@pwshub/bellajs";
</script>
```

## Quick Start

```ts
import {
  clone,
  formatDate,
  formatRelativeTime,
  genid,
  maybe,
  pipe,
} from "@pwshub/bellajs";

// Safe null handling with Maybe
const email = maybe(user)
  .map((u) => u.profile)
  .map((p) => p.email)
  .orElse(() => "default@example.com")
  .value();

// Function composition
const process = pipe(
  (data: string[]) => data.filter((x) => x.length > 3),
  (data) => data.map((x) => x.toUpperCase()),
  (names) => names.join(", "),
);

// Generate secure random IDs
const id = genid(16, "user_"); // 'user_aB3xY9kL2mN5pQ7r'

// Format dates with multi-language support
formatDate(new Date(), "vi"); // "20:34:28, 3 thg 1, 2026"
formatRelativeTime(Date.now() - 300000, "ja"); // "5 分前"
```

## Documentation

### Core Modules

| Module                               | Functions    | Description                                        |
| ------------------------------------ | ------------ | -------------------------------------------------- |
| **[Detection](docs/detection.md)**   | 15 functions | Type checking utilities                            |
| **[String](docs/string.md)**         | 20 functions | Text manipulation and analysis                     |
| **[Random](docs/random.md)**         | 2 functions  | Cryptographically secure random generation         |
| **[Date](docs/date.md)**             | 7 functions  | Date formatting and time calculations              |
| **[Array](docs/array.md)**           | 15 functions | Array utilities and transformations                |
| **[Object](docs/object.md)**         | 2 functions  | Deep cloning and property copying                  |
| **[Functional](docs/functional.md)** | 4 functions  | compose, pipe, curry, maybe                        |
| **[Number](docs/number.md)**         | 2 functions  | Number formatting utilities                        |
| **[Similarity](docs/similarity.md)** | 5 functions  | String comparison and similarity                   |
| **[Store](docs/store.md)**           | 1 function   | In-memory key-value store with TTL                 |
| **[Utility](docs/utility.md)**       | 1 function   | Property definition helper                         |
| **[Rating](docs/rating.md)**         | 6 functions  | Wilson Score, Bayesian Average, time-decay ratings |

**75 functions total.**

## Examples by Use Case

### Safe Property Access

```ts
import { maybe } from "@pwshub/bellajs";

const email = maybe(user)
  .map((u) => u.profile)
  .map((p) => p.contact)
  .map((c) => c.email)
  .orElse(() => "default@example.com")
  .value();
```

### Multi-language Text Processing

```ts
import {
  formatDate,
  formatRelativeTime,
  getWordCount,
  truncateByChar,
  truncateByWord,
} from "@pwshub/bellajs";

formatDate(new Date(), "en"); // "Jan 3, 2026, 8:34:28 PM"
formatDate(new Date(), "vi"); // "20:34:28, 3 thg 1, 2026"
formatDate(new Date(), "ja"); // "2026/1/3 20:34:28"

formatRelativeTime(Date.now() - 3600000, "en"); // "1 hour ago"
formatRelativeTime(Date.now() - 3600000, "vi"); // "1 giờ trước"

getWordCount("Hello world"); // 2
getWordCount("こんにちは世界"); // 2

truncateByWord("Hello world this is a test", 3); // "Hello world this..."
truncateByChar("👨‍👩‍👧‍👦abc", 3); // "👨‍👩‍👧‍👦ab..."
```

### Secure Random Generation

```ts
import { genid, randomInt } from "@pwshub/bellajs";

genid(); // 'aB3xY9kL2mN5pQ7rS8tU0vW1xY2zA3bC' (32 chars)
genid(16); // 'kL2mN5pQ7rS8tU0v' (16 chars)
genid(16, "user_"); // 'user_aB3xY9kL2mN5p'

randomInt(100); // 0–100
```

### Caching Without Redis

```ts
import { memstore } from "@pwshub/bellajs";

const cache = memstore(300); // 5-minute default TTL

cache.set("user:1", { name: "John", email: "john@example.com" });
const user = cache.get("user:1");

cache.set("session:abc", { userId: 1 }, 3600); // custom TTL: 1 hour

for (const [key, value] of cache.entries()) {
  console.log(key, value);
}
```

### Function Pipelines

```ts
import { compose, curry, pipe } from "@pwshub/bellajs";

const processUser = pipe(
  (user: { profile: { settings: { theme: string } } }) => user.profile,
  (profile) => profile.settings,
  (settings) => settings.theme,
);

const analyze = compose(
  (result: string) => result.toUpperCase(),
  (data: string[]) => data.join("-"),
  (items: string[]) => items.filter((x) => x.length > 0),
);

const add = (a: number, b: number) => a + b;
const curriedAdd = curry(add);
curriedAdd(5)(3); // 8
```

### Array Transformations

```ts
import {
  chunk,
  difference,
  flatten,
  groupBy,
  intersection,
  zip,
} from "@pwshub/bellajs";

chunk([1, 2, 3, 4, 5], 2); // [[1,2], [3,4], [5]]
flatten([1, [2, [3, [4]]]], 2); // [1, 2, 3, [4]]
difference([1, 2, 3, 4], [2, 3]); // [1, 4]
intersection([1, 2, 3], [2, 3, 4]); // [2, 3]
zip([1, 2], ["a", "b"]); // [[1,'a'], [2,'b']]
```

### Number Formatting

```ts
import { formatBytes, formatNumber } from "@pwshub/bellajs";

formatBytes(1024); // '1 KiB'
formatBytes(1234567890); // '1.15 GiB'
formatNumber(123.456); // '123.46'
formatNumber(99.9, 0); // '100'
```

## Platform Support

| Platform | Version      | Support    |
| -------- | ------------ | ---------- |
| Deno     | 2.0+         | ✅ Primary |
| Node.js  | 22+          | ✅ Full    |
| Bun      | 1.0+         | ✅ Full    |
| Browsers | Modern (ESM) | ✅ Full    |

## Development

```bash
# Run tests
deno test

# Run linter
deno lint

# Build npm package (via DNT)
deno task build

# Publish to JSR
deno publish

# Publish to npm (after building)
cd npm && npm publish
```

## License

MIT
