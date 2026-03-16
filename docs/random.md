# Random Utilities

Cryptographically secure random number and ID generation.

## Installation

```bash
npm install @pwshub/bellajs
```

## Usage

```javascript
import { genid, randomInt } from '@pwshub/bellajs'
```

## Functions

### `genid(len, prefix)`

Generate a cryptographically secure random unique ID.

**Parameters:**
- `len` (number, default: 32) - Total length including prefix
- `prefix` (string, default: '') - Optional prefix

**Returns:** string

**Security:** Uses `crypto.getRandomValues()` - safe for session IDs, tokens, etc.

```javascript
// Generate 32-character ID
genid()
// 'aB3xY9kL2mN5pQ7rS8tU0vW1xY2zA3bC'

// Generate 16-character ID
genid(16)
// 'kL2mN5pQ7rS8tU0v'

// Generate ID with prefix (length includes prefix)
genid(16, 'user_')
// 'user_aB3xY9kL2mN5p' (5 prefix + 11 random)

// Generate short ID
genid(8)
// 'xY2zA3bC'
```

**Character set:** A-Z, a-z, 0-9 (62 characters, no special chars)

### `randomInt(max)`

Generate a cryptographically secure random integer from 0 to max (inclusive).

**Parameters:**
- `max` (number) - Maximum value (inclusive, must be non-negative integer)

**Returns:** number

**Security:** Uses `crypto.getRandomValues()` with rejection sampling - no bias.

```javascript
// Random number 0-100
randomInt(100)
// 42

// Random binary (0 or 1)
randomInt(1)
// 0 or 1

// Large range
randomInt(1000000)
// 537821
```

**Throws:** Error if max is negative or not an integer

```javascript
randomInt(-1)    // Error: max must be a non-negative integer
randomInt(1.5)   // Error: max must be a non-negative integer
```

## Security Notes

### ✅ Safe For

- Session IDs
- CSRF tokens  
- Random identifiers
- Nonces
- Password reset tokens
- API keys (non-critical)

### ⚠️ Not For

- Password hashing (use bcrypt, argon2)
- Encryption keys (use crypto module directly)
- Gambling/betting (consider dedicated RNG)

## Examples

### Generate User Session ID

```javascript
import { genid } from '@pwshub/bellajs'

const sessionId = genid(32, 'sess_')
// 'sess_aB3xY9kL2mN5pQ7rS8tU0vW1x'
```

### Random Sampling

```javascript
import { randomInt } from '@pwshub/bellajs'

// Pick random item from array
const items = ['apple', 'banana', 'cherry', 'date']
const randomItem = items[randomInt(items.length - 1)]
```

### Generate Multiple Unique IDs

```javascript
import { genid } from '@pwshub/bellajs'

const ids = new Set()
while (ids.size < 100) {
  ids.add(genid())
}
// All 100 IDs are unique
```

## See Also

- [Hash utilities](hash.md) - MD5 hashing for identifiers
- [Store utilities](store.md) - memstore for caching
