# Random Utilities

Cryptographically secure random number and ID generation.

## Installation

```typescript
import { genid, randomInt } from "jsr:@pwshub/bellajs";
```

### `genid(len, prefix)`

Generate a cryptographically secure random unique ID.

```typescript
genid(); // "aB3xY9kL2mN5pQ7rS8tU0vW1xY2zA3bC" (32 chars)
genid(16); // "kL2mN5pQ7rS8tU0v" (16 chars)
genid(16, "user_"); // "user_aB3xY9kL2mN5p" (prefix included in length)
```

- Default len: 32
- Character set: `A-Z`, `a-z`, `0-9` (62 characters, no special chars)
- Uses `crypto.getRandomValues()`

### `randomInt(max)`

Generate a cryptographically secure random integer from 0 to max (inclusive).

```typescript
randomInt(100); // 0–100
randomInt(1); // 0 or 1
randomInt(1000000); // 0–1000000
```

- Uses `crypto.getRandomValues()` with rejection sampling (no bias)
- Throws `Error` if max is negative or not an integer

## Security Notes

- Safe for: session IDs, CSRF tokens, nonces, password reset tokens
- Not for: password hashing (use bcrypt/argon2), encryption keys
