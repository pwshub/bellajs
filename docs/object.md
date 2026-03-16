# Object Utilities

Deep cloning and property copying functions.

## Installation

```bash
npm install @pwshub/bellajs
```

## Usage

```javascript
import { clone, copies } from '@pwshub/bellajs'
```

## Functions

### `clone(val)`

Create a deep copy of a value. Handles objects, arrays, Date, and circular references.

**Parameters:**
- `val` - Any value to clone

**Returns:** Deep copy of the value

```javascript
// Clone object
const original = { name: 'Alice', age: 30 }
const copy = clone(original)
copy.name = 'Bob'
console.log(original.name)  // 'Alice' (unchanged)

// Clone nested object
const user = {
  profile: { name: 'Alice' },
  settings: { theme: 'dark' }
}
const cloned = clone(user)
cloned.profile.name = 'Bob'
console.log(user.profile.name)  // 'Alice' (unchanged)

// Clone array
const arr = [1, { a: 2 }, [3, 4]]
const clonedArr = clone(arr)
clonedArr[1].a = 200
console.log(arr[1].a)  // 2 (unchanged)

// Clone Date
const date = new Date('2026-01-16')
const clonedDate = clone(date)
clonedDate.setFullYear(2027)
console.log(date.getFullYear())  // 2026 (unchanged)

// Handle circular references
const obj = { name: 'test' }
obj.self = obj
const cloned = clone(obj)
console.log(cloned.self === cloned)  // true
```

**Preserves:**
- Plain objects
- Arrays
- Date objects
- Circular references
- RegExp, Error, Map, Set

### `copies(source, dest, matched, excepts)`

Copy properties from source to destination object. Nested objects/arrays are deep copied.

**Parameters:**
- `source` - Source object to copy from
- `dest` - Destination object to copy to
- `matched` (default: false) - If true, only copy properties that exist in dest
- `excepts` (default: []) - Array of property names to exclude

**Returns:** Modified destination object

```javascript
// Basic copy
const source = { a: 1, b: 2, c: 3 }
const dest = { a: 10, d: 40 }
copies(source, dest)
// dest is now { a: 1, b: 2, c: 3, d: 40 }

// Only copy matching properties
const source = { a: 1, b: 2, c: 3 }
const dest = { a: 10, b: 20, d: 40 }
copies(source, dest, true)
// dest is now { a: 1, b: 2, d: 40 } (c not copied, doesn't exist in dest)

// Exclude properties
const source = { a: 1, b: 2, c: 3 }
const dest = { a: 10 }
copies(source, dest, false, ['b', 'c'])
// dest is now { a: 1 } (b and c excluded)

// Nested objects are deep copied
const source = { user: { name: 'Alice' } }
const dest = { user: { name: 'Bob', age: 30 } }
copies(source, dest)
// dest is { user: { name: 'Alice', age: 30 } }
// source.user is NOT the same reference as dest.user

// Combine matched and excepts
const source = { a: 1, b: 2, c: 3, d: 4 }
const dest = { a: 10, b: 20, e: 50 }
copies(source, dest, true, ['b'])
// dest is { a: 1, b: 20, e: 50 } (only 'a' copied, 'b' excluded)
```

## Examples

### Immutable Updates

```javascript
import { clone } from '@pwshub/bellajs'

// Create modified copy without mutating original
const user = { name: 'Alice', settings: { theme: 'dark' } }
const updated = clone(user)
updated.name = 'Bob'
updated.settings.theme = 'light'
// user is unchanged
```

### Merge Configurations

```javascript
import { copies } from '@pwshub/bellajs'

// User settings override defaults
const defaults = {
  theme: 'light',
  language: 'en',
  notifications: true
}
const userSettings = {
  theme: 'dark',
  language: 'vi'
}

const config = copies(userSettings, { ...defaults })
// { theme: 'dark', language: 'vi', notifications: true }
```

### Partial Updates

```javascript
import { copies } from '@pwshub/bellajs'

// Only update fields that exist in destination
const existing = { id: 1, name: 'Alice', email: 'alice@example.com' }
const update = { name: 'Bob', email: 'bob@example.com', role: 'admin' }

copies(update, existing, true)
// existing is now { id: 1, name: 'Bob', email: 'bob@example.com' }
// role is NOT added (didn't exist in existing)
```

### Clone API Response

```javascript
import { clone } from '@pwshub/bellajs'

// Safe to modify API response
const response = await fetch('/api/users').then(r => r.json())
const users = clone(response.data)

// Modify without affecting cache
users.forEach(u => u.selected = false)
```

## See Also

- [Detection utilities](detection.md) - Type checking
- [Array utilities](array.md) - Array operations
