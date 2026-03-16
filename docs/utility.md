# Utility Functions

Helper utilities for property definition and other common tasks.

## Installation

```bash
npm install @pwshub/bellajs
```

## Usage

```javascript
import { defineProp } from '@pwshub/bellajs'
```

## Functions

### `defineProp(ob, key, val, config)`

Define a property on an object with configurable options. Shorthand for `Object.defineProperty()`.

**Parameters:**
- `ob` - The object to define property on
- `key` - Property name
- `val` - Property value
- `config` - Configuration options:
  - `writable` (default: false) - Whether value can be changed
  - `configurable` (default: false) - Whether property can be deleted/reconfigured
  - `enumerable` (default: false) - Whether shows in for...in loops

**Returns:** void (modifies object in place)

```javascript
const obj = {}

// Define non-writable, non-enumerable property
defineProp(obj, 'secret', 'hidden')
console.log(obj.secret)  // 'hidden'
obj.secret = 'changed'   // Silent failure (strict mode: TypeError)
console.log(obj.secret)  // 'hidden'

// Define enumerable property
defineProp(obj, 'name', 'Alice', { enumerable: true })
console.log(obj.name)  // 'Alice'
Object.keys(obj)       // ['name'] (secret not included)

// Define writable property
defineProp(obj, 'count', 0, { writable: true })
obj.count = 100        // Works
console.log(obj.count) // 100

// Define configurable (can be deleted)
defineProp(obj, 'temp', 'value', { configurable: true })
delete obj.temp        // Works
console.log(obj.temp)  // undefined
```

## Examples

### Create Constants

```javascript
import { defineProp } from '@pwshub/bellajs'

const Config = {}
defineProp(Config, 'API_URL', 'https://api.example.com', {
  enumerable: true
})
defineProp(Config, 'VERSION', '1.0.0', {
  enumerable: true
})

// Config.API_URL cannot be changed
```

### Hide Internal Properties

```javascript
import { defineProp } from '@pwshub/bellajs'

class User {
  constructor(name) {
    this.name = name
    defineProp(this, '_password', 'secret123')
  }
}

const user = new User('Alice')
console.log(user.name)      // 'Alice'
console.log(user._password) // 'secret123'
console.log(Object.keys(user)) // ['name'] (_password hidden)
```

### Create Read-Only Object

```javascript
import { defineProp } from '@pwshub/bellajs'

const readOnly = {}
defineProp(readOnly, 'value', 42, {
  writable: false,
  configurable: false,
  enumerable: true
})

readOnly.value = 100  // Fails
console.log(readOnly.value)  // 42
```

### Define Multiple Properties

```javascript
import { defineProp } from '@pwshub/bellajs'

const obj = {}

const props = {
  x: 1,
  y: 2,
  z: 3
}

Object.entries(props).forEach(([key, value]) => {
  defineProp(obj, key, value, { enumerable: true })
})

console.log(obj)  // { x: 1, y: 2, z: 3 }
```

## See Also

- [Object utilities](object.md) - clone, copies for object manipulation
- [Detection utilities](detection.md) - Type checking
