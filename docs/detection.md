# Detection Utilities

Type checking functions for JavaScript values.

## Installation

```typescript
import { isEmpty, isNumber, isString, isValidUrl } from "jsr:@pwshub/bellajs";
```

## Functions

| Function                 | Description                                                                  |
| ------------------------ | ---------------------------------------------------------------------------- |
| `isNumber(val)`          | Check if value is a number                                                   |
| `isInteger(val)`         | Check if value is an integer                                                 |
| `isArray(val)`           | Check if value is an array                                                   |
| `isString(val)`          | Check if value is a string                                                   |
| `isBoolean(val)`         | Check if value is a boolean                                                  |
| `isNull(val)`            | Check if value is null                                                       |
| `isUndefined(val)`       | Check if value is undefined                                                  |
| `isNil(val)`             | Check if value is null or undefined                                          |
| `isFunction(val)`        | Check if value is a function                                                 |
| `isObject(val)`          | Check if value is a plain object (not array)                                 |
| `isDate(val)`            | Check if value is a valid date                                               |
| `isEmail(val)`           | Check if value is a valid email address                                      |
| `isEmpty(val)`           | Check if value is empty (null, undefined, empty string/array/object)         |
| `hasProperty(obj, prop)` | Check if object has own property (not inherited)                             |
| `isValidUrl(url)`        | Check if string is valid URL with HTTP/HTTPS protocol                        |
| `isAbsoluteUrl(url)`     | Check if URL string is absolute (starts with `http://`, `https://`, or `//`) |

## Examples

```typescript
isNumber(42); // true
isNumber("42"); // false

isEmpty(""); // true
isEmpty([]); // true
isEmpty("hello"); // false

isValidUrl("https://example.com"); // true
isValidUrl("ftp://example.com"); // false

isAbsoluteUrl("//cdn.example.com"); // true
isAbsoluteUrl("/path/to/resource"); // false
```
