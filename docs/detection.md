# Detection Utilities

Type checking functions for JavaScript values.

## Installation

```bash
npm install @pwshub/bellajs
```

## Usage

```javascript
import { 
  isNumber, 
  isString, 
  isArray, 
  isObject,
  isNil 
} from '@pwshub/bellajs'
```

## Functions

### `isNumber(val)`

Check if value is a number.

```javascript
isNumber(42)        // true
isNumber(3.14)      // true
isNumber('42')      // false
isNumber(null)      // false
```

### `isInteger(val)`

Check if value is an integer.

```javascript
isInteger(42)       // true
isInteger(3.14)     // false
isInteger(-5)       // true
```

### `isArray(val)`

Check if value is an array.

```javascript
isArray([1, 2, 3])  // true
isArray([])         // true
isArray('array')    // false
```

### `isString(val)`

Check if value is a string.

```javascript
isString('hello')   // true
isString('')        // true
isString(42)        // false
```

### `isBoolean(val)`

Check if value is a boolean.

```javascript
isBoolean(true)     // true
isBoolean(false)    // true
isBoolean(1)        // false
```

### `isNull(val)`

Check if value is null.

```javascript
isNull(null)        // true
isNull(undefined)   // false
isNull(0)           // false
```

### `isUndefined(val)`

Check if value is undefined.

```javascript
isUndefined(undefined)  // true
isUndefined()           // true
isUndefined(null)       // false
```

### `isNil(val)`

Check if value is null or undefined.

```javascript
isNil(null)         // true
isNil(undefined)    // true
isNil(0)            // false
isNil('')           // false
```

### `isFunction(val)`

Check if value is a function.

```javascript
isFunction(() => {})    // true
isFunction(function() {}) // true
isFunction(42)          // false
```

### `isObject(val)`

Check if value is a plain object (not array).

```javascript
isObject({})        // true
isObject({ a: 1 })  // true
isObject([])        // false
isObject(null)      // false
```

### `isDate(val)`

Check if value is a valid date.

```javascript
isDate(new Date())  // true
isDate('2026-01-01') // false
isDate(new Date('invalid')) // false
```

### `isEmail(val)`

Check if value is a valid email address.

```javascript
isEmail('user@example.com')  // true
isEmail('invalid')           // false
isEmail(123)                 // false
```

### `isEmpty(val)`

Check if value is empty (null, undefined, empty string, empty array, or empty object).

```javascript
isEmpty('')         // true
isEmpty([])         // true
isEmpty({})         // true
isEmpty(null)       // true
isEmpty('hello')    // false
isEmpty([1, 2])     // false
```

### `hasProperty(obj, prop)`

Check if object has own property (not inherited).

```javascript
const obj = { name: 'Alice', age: 30 }
hasProperty(obj, 'name')    // true
hasProperty(obj, 'toString') // false (inherited)
```

### `isValidUrl(url)`

Check if a string is a valid URL with HTTP or HTTPS protocol.

```javascript
isValidUrl('https://example.com')        // true
isValidUrl('http://example.com/path')    // true
isValidUrl('ftp://example.com')          // false
isValidUrl('not-a-url')                  // false
isValidUrl('')                           // false
```

### `isAbsoluteUrl(url)`

Check if a URL string is absolute (starts with http://, https://, or //).

```javascript
isAbsoluteUrl('https://example.com')     // true
isAbsoluteUrl('http://example.com')      // true
isAbsoluteUrl('//cdn.example.com/lib.js') // true
isAbsoluteUrl('/path/to/resource')       // false
isAbsoluteUrl('relative/path')           // false
```

## See Also

- [Object utilities](object.md) - clone, copies
- [String utilities](string.md) - Text manipulation
