# BellaJS

A lightweight, functional utility library for Node.js, Bun, and Deno.

[![npm version](https://badge.fury.io/js/@pwshub%2Fbellajs.svg)](https://badge.fury.io/js/@pwshub%2Fbellajs)
![CodeQL](https://github.com/pwshub/bellajs/workflows/CodeQL/badge.svg)
![CI test](https://github.com/pwshub/bellajs/workflows/ci-test/badge.svg)

## Features

- **Zero runtime dependencies** - Pure JavaScript, no external libs
- **Functional programming** - Pure functions, method chaining, immutability
- **Modern JavaScript** - ESM modules, JSDocs, TypeScript definitions
- **Multi-language support** - Intl-based text processing for any language
- **Cryptographically secure** - Uses `crypto.getRandomValues()` for random generation
- **Tree-shakeable** - Import only what you need

## Installation

```bash
npm install @pwshub/bellajs
# or
pnpm install @pwshub/bellajs
# or
bun add @pwshub/bellajs
```

### Browser Usage

BellaJS works directly in browsers via CDN. Load it from [esm.sh](https://esm.sh/@pwshub/bellajs) or [unpkg.com](https://unpkg.com/@pwshub/bellajs):

```html
<script type="module">
import { genid } from "https://esm.sh/@pwshub/bellajs";
// or from unpkg.com
import { genid } from "https://unpkg.com/@pwshub/bellajs";

for (let i = 0; i < 5; i++) {
  console.log(genid());
}
</script>
```

## Quick Start

```javascript
import { 
  clone, 
  formatDate, 
  formatRelativeTime, 
  genid, 
  maybe,
  pipe 
} from '@pwshub/bellajs'

// Safe null handling with Maybe
const email = maybe(user)
  .map(u => u.profile)
  .map(p => p.email)
  .orElse(() => 'default@example.com')
  .value()

// Function composition
const process = pipe(
  data => data.filter(x => x.active),
  data => data.map(x => x.name),
  names => names.join(', ')
)

// Generate secure random IDs
const id = genid(16, 'user_') // 'user_aB3xY9kL2mN5pQ7r'

// Format dates with multi-language support
formatDate(new Date(), 'vi') // "20:34:28, 3 thg 1, 2026"
formatRelativeTime(Date.now() - 300000, 'ja') // "5 分前"
```

## Documentation

### Core Modules

| Module | Functions | Description |
|--------|-----------|-------------|
| **[Detection](docs/detection.md)** | 15 functions | Type checking utilities |
| **[String](docs/string.md)** | 15 functions | Text manipulation and analysis |
| **[Random](docs/random.md)** | 2 functions | Cryptographically secure random generation |
| **[Date](docs/date.md)** | 7 functions | Date formatting and time calculations |
| **[Array](docs/array.md)** | 15 functions | Array utilities and transformations |
| **[Object](docs/object.md)** | 2 functions | Deep cloning and property copying |
| **[Functional](docs/functional.md)** | 4 functions | compose, pipe, curry, maybe |
| **[Number](docs/number.md)** | 2 functions | Number formatting utilities |
| **[Similarity](docs/similarity.md)** | 5 functions | String comparison and similarity |
| **[Store](docs/store.md)** | 1 function | In-memory key-value store with TTL |
| **[Utility](docs/utility.md)** | 1 function | Property definition helper |
| **[Rating](docs/rating.md)** | 6 functions | Wilson Score, Bayesian Average, time-decay ratings |

### Function Count: **70 total**

## Security Notes

### Random Functions (genid, randomInt)

✅ **Safe for:**
- Session IDs
- CSRF tokens
- Random identifiers
- Nonces

Uses `crypto.getRandomValues()` - cryptographically secure!

## Examples by Use Case

### 🔐 Safe Property Access

```javascript
import { maybe } from '@pwshub/bellajs'

// Without maybe (nested if statements)
let email
if (user && user.profile && user.profile.contact) {
  email = user.profile.contact.email
} else {
  email = 'default@example.com'
}

// With maybe (clean chaining)
const email = maybe(user)
  .map(u => u.profile)
  .map(p => p.contact)
  .map(c => c.email)
  .orElse(() => 'default@example.com')
  .value()
```

### 🌍 Multi-language Text Processing

```javascript
import { 
  formatDate, 
  formatRelativeTime, 
  getWordCount,
  truncate 
} from '@pwshub/bellajs'

// Date formatting
formatDate(new Date(), 'en')     // "Jan 3, 2026, 8:34:28 PM"
formatDate(new Date(), 'vi')     // "20:34:28, 3 thg 1, 2026"
formatDate(new Date(), 'ja')     // "2026/1/3 20:34:28"
formatDate(new Date(), 'zh')     // "2026 年 1 月 3 日 GMT+7 下午8:34:28"

// Relative time
formatRelativeTime(Date.now() - 3600000, 'en')  // "1 hour ago"
formatRelativeTime(Date.now() - 3600000, 'vi')  // "1 giờ trước"
formatRelativeTime(Date.now() - 3600000, 'ko')  // "1 시간 전"

// Word counting (works with CJK, Arabic, etc.)
getWordCount('Hello world')           // 2
getWordCount('こんにちは世界')         // 2
getWordCount('مرحبا بالعالم')         // 2

// Truncate respecting word boundaries
truncate('Hello world this is a test', 3)  // "Hello world this..."
```

### 🎲 Secure Random Generation

```javascript
import { genid, randomInt } from '@pwshub/bellajs'

// Generate unique IDs
genid()              // 'aB3xY9kL2mN5pQ7rS8tU0vW1xY2zA3bC' (32 chars)
genid(16)            // 'kL2mN5pQ7rS8tU0v' (16 chars)
genid(16, 'user_')   // 'user_aB3xY9kL2mN5p' (prefix included in length)

// Random integers (cryptographically secure)
randomInt(100)       // 0-100
randomInt(1)         // 0 or 1
randomInt(1000000)   // 0-1000000
```

### 🗄️ Caching Without Redis

```javascript
import { memstore } from '@pwshub/bellajs'

// Create cache with 5-minute default TTL
const cache = memstore(300)

// Store data
cache.set('user:1', { name: 'John', email: 'john@example.com' })

// Retrieve data
const user = cache.get('user:1')

// Store with custom TTL (1 hour)
cache.set('session:abc', { userId: 1 }, 3600)

// Check existence
if (cache.has('user:1')) {
  console.log('User cached')
}

// Get cache size (excludes expired entries)
console.log(`Cache has ${cache.size()} entries`)

// Iterate over entries
for (const [key, value] of cache.entries()) {
  console.log(key, value)
}
```

### 🔗 Function Pipelines

```javascript
import { pipe, compose, curry, filter, map } from '@pwshub/bellajs'

// Left-to-right pipeline
const processUser = pipe(
  user => user.profile,
  profile => profile.settings,
  settings => settings.theme
)

// Right-to-left composition
const analyze = compose(
  result => result.toUpperCase(),
  data => data.join('-'),
  items => items.filter(x => x.active)
)

// Curried functions
const add = (a, b) => a + b
const curriedAdd = curry(add)
curriedAdd(5)(3)  // 8
curriedAdd(5, 3)  // 8
```

### 📊 Array Transformations

```javascript
import { 
  chunk, 
  flatten, 
  groupBy, 
  difference,
  intersection,
  zip 
} from '@pwshub/bellajs'

// Chunk array
chunk([1, 2, 3, 4, 5], 2)  // [[1,2], [3,4], [5]]

// Flatten nested arrays
flatten([1, [2, [3, [4]]]], 2)  // [1, 2, 3, [4]]

// Group by property
groupBy(users, 'role')  // { admin: [...], user: [...] }

// Array operations
difference([1, 2, 3, 4], [2, 3])  // [1, 4]
intersection([1, 2, 3], [2, 3, 4])  // [2, 3]
zip([1, 2], ['a', 'b'])  // [[1,'a'], [2,'b']]
```

### 🔢 Number Formatting

```javascript
import { formatBytes, formatNumber } from '@pwshub/bellajs'

// Format file sizes
formatBytes(1024)           // '1 KiB'
formatBytes(1536)           // '1.5 KiB'
formatBytes(1048576)        // '1 MiB'
formatBytes(1234567890)     // '1.15 GiB'

// Format numbers for display
formatNumber(123)           // '123.00'
formatNumber(123.456)       // '123.46'
formatNumber(99.9, 0)       // '100'
```

### 🔗 URL Validation

```javascript
import { isValidUrl, isAbsoluteUrl } from '@pwshub/bellajs'

// Validate URLs
isValidUrl('https://example.com')    // true
isValidUrl('http://example.com')     // true
isValidUrl('ftp://example.com')      // false
isValidUrl('not-a-url')              // false

// Check if URL is absolute
isAbsoluteUrl('https://example.com')     // true
isAbsoluteUrl('//cdn.example.com')       // true
isAbsoluteUrl('/path/to/resource')       // false
```

## Platform Support

| Platform | Version | Support |
|----------|---------|---------|
| Node.js | 22+ | ✅ Full |
| Bun | 1.0+ | ✅ Full |
| Deno | 2.0+ | ✅ Full |
| Browsers | Modern (ESM) | ✅ Full |

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run linter
npm run lint

# Auto-fix linting issues
npm run lint:fix
```

## AI Agents

- Qwen Code
- Google Gemini
- DeepSeek

## License

The MIT License (MIT)
