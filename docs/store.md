# Store Utilities

In-memory key-value store with TTL support.

## Installation

```bash
npm install @pwshub/bellajs
```

## Usage

```javascript
import { memstore } from '@pwshub/bellajs'
```

## Function

### `memstore(defaultTtl)`

Create an in-memory key-value store with optional TTL (time-to-live) support.

**Parameters:**
- `defaultTtl` (default: -1) - Default TTL in seconds (-1 for no expiration)

**Returns:** Store instance with methods

## Store Methods

### `set(key, value, ttl)`

Store a value with optional TTL.

```javascript
const store = memstore(60)  // 60 second default TTL

// Use default TTL
store.set('user:1', { name: 'John' })

// Override with custom TTL (5 minutes)
store.set('session:abc', { userId: 1 }, 300)

// No expiration
store.set('config', { theme: 'dark' }, -1)

// Method chaining
store
  .set('key1', 'value1')
  .set('key2', 'value2')
```

### `get(key)`

Retrieve a value. Returns `null` if not found or expired.

```javascript
const user = store.get('user:1')
if (user === null) {
  // Key not found or expired
}
```

### `has(key)`

Check if key exists and is not expired.

```javascript
if (store.has('user:1')) {
  console.log('User exists in cache')
}
```

### `del(key)`

Delete a key. Returns `true` if deleted, `false` if didn't exist.

```javascript
store.del('user:1')  // true if deleted
```

### `clear()`

Remove all entries.

```javascript
store.clear()
```

### `size()`

Get count of valid (non-expired) entries.

```javascript
console.log(`Cache has ${store.size()} entries`)
```

### `entries()`

Iterate over valid [key, value] pairs.

```javascript
// For...of loop
for (const [key, value] of store.entries()) {
  console.log(key, value)
}

// Convert to array
const allEntries = [...store.entries()]

// Destructure
const keys = [...store.entries()].map(([k, _]) => k)
```

### Aliases

- `save()` - Alias for `set()`
- `load()` - Alias for `get()`

## Examples

### Simple Caching

```javascript
import { memstore } from '@pwshub/bellajs'

// Create cache with 5-minute default TTL
const cache = memstore(300)

// Cache API response
async function getUser(id) {
  const cached = cache.get(`user:${id}`)
  if (cached) {
    return cached
  }
  
  const user = await db.users.findById(id)
  cache.set(`user:${id}`, user)
  return user
}
```

### Session Storage

```javascript
import { memstore } from '@pwshub/bellajs'

// Session store with 1-hour TTL
const sessions = memstore(3600)

// Create session
const sessionId = genid(32, 'sess_')
sessions.set(sessionId, { userId: 123, createdAt: Date.now() })

// Get session
const session = sessions.get(sessionId)
if (!session) {
  throw new Error('Invalid session')
}

// Delete on logout
sessions.del(sessionId)
```

### Rate Limiting

```javascript
import { memstore } from '@pwshub/bellajs'

// Track requests with 1-minute window
const rateLimit = memstore(60)

function checkRateLimit(ip) {
  const key = `rate:${ip}`
  const count = rateLimit.get(key) || 0
  
  if (count >= 100) {
    return false  // Rate limited
  }
  
  rateLimit.set(key, count + 1)
  return true
}
```

### Request Deduplication

```javascript
import { memstore } from '@pwshub/bellajs'

// Prevent duplicate requests
const pending = memstore(30)  // 30 second window

async function fetchWithDedup(url) {
  const key = `fetch:${url}`
  
  // Check if already pending
  if (pending.has(key)) {
    return pending.get(key)
  }
  
  // Start fetch and store promise
  const promise = fetch(url).then(r => r.json())
  pending.set(key, promise, 30)
  
  return promise
}
```

### Cache with Stats

```javascript
import { memstore } from '@pwshub/bellajs'

const cache = memstore(300)

// Store multiple items
cache
  .set('user:1', { name: 'Alice' })
  .set('user:2', { name: 'Bob' })
  .set('config', { theme: 'dark' })

// Get stats
console.log(`Cache size: ${cache.size()}`)

// Iterate and process
for (const [key, value] of cache.entries()) {
  console.log(`${key}:`, value)
}

// Clear all
cache.clear()
console.log(`Cache size after clear: ${cache.size()}`)
```

## TTL Behavior

```javascript
const store = memstore(60)  // 60 second default

// Expires in 60 seconds (default)
store.set('key1', 'value1')

// Expires in 300 seconds (override)
store.set('key2', 'value2', 300)

// Never expires
store.set('key3', 'value3', -1)

// Check expiration
store.has('key1')  // true initially
// ... wait 61 seconds ...
store.has('key1')  // false (expired)
```

## See Also

- [Random utilities](random.md) - Generate secure session IDs
- [Hash utilities](hash.md) - Generate cache keys
- [Date utilities](date.md) - Time-based operations
