# Number Utilities

Number formatting functions for bytes and financial values.

## Installation

```bash
npm install @pwshub/bellajs
```

## Usage

```javascript
import { formatBytes, formatNumber } from '@pwshub/bellajs'
```

## Functions

### `formatBytes(bytes, decimals)`

Converts bytes to a human-readable size string with appropriate unit (Bytes, KiB, MiB, GiB, etc.).

**Parameters:**
- `bytes` (number): The number of bytes to format
- `decimals` (number, optional): Number of decimal places (default: 2)

**Returns:** Formatted size string with unit

```javascript
formatBytes(0)                    // '0 Bytes'
formatBytes(1024)                 // '1 KiB'
formatBytes(1536)                 // '1.5 KiB'
formatBytes(1048576)              // '1 MiB'
formatBytes(1234567890)           // '1.15 GiB'
formatBytes(1099511627776)        // '1 TiB'

// Custom decimal places
formatBytes(1536, 0)              // '2 KiB'
formatBytes(1536, 3)              // '1.5 KiB'
formatBytes(1234567890, 4)        // '1.1496 GiB'
```

**Use Cases:**
- Displaying file sizes in UI
- Showing storage usage
- Network transfer progress

### `formatNumber(x, decimals)`

Formats a number as a fixed-point decimal string, typically for financial display.

**Parameters:**
- `x` (number, optional): The number to format (default: 0)
- `decimals` (number, optional): Number of decimal places (default: 2)

**Returns:** Formatted number string with fixed decimal places

```javascript
formatNumber(123)                 // '123.00'
formatNumber(123.456)             // '123.46'
formatNumber(123.456, 3)          // '123.456'
formatNumber(1000, 0)             // '1000'
formatNumber('45.678', 2)         // '45.68'
formatNumber(-123.456, 2)         // '-123.46'
```

**Use Cases:**
- Displaying prices and currency
- Financial reports
- Percentage display
- Consistent decimal formatting

## Examples

### File Size Display

```javascript
import { formatBytes } from '@pwshub/bellajs'

const fileSize = 2547891
console.log(`File size: ${formatBytes(fileSize)}`)
// 'File size: 2.43 MiB'

const storageUsed = 1234567890123
console.log(`Storage used: ${formatBytes(storageUsed, 1)}`)
// 'Storage used: 1.1 TiB'
```

### Price Display

```javascript
import { formatNumber } from '@pwshub/bellajs'

const price = 99.9
console.log(`Price: $${formatNumber(price)}`)
// 'Price: $99.90'

const discount = 0.15
console.log(`Discount: ${(formatNumber(discount * 100, 1))}%`)
// 'Discount: 15.0%'
```

### Combined Usage

```javascript
import { formatBytes, formatNumber } from '@pwshub/bellajs'

const file = {
  name: 'document.pdf',
  size: 2456789,
  price: 19.9
}

console.log(`${file.name}: ${formatBytes(file.size)} - $${formatNumber(file.price)}`)
// 'document.pdf: 2.34 MiB - $19.90'
```

## Units

`formatBytes` uses binary prefixes (IEC 80000-13):

| Unit | Bytes | Symbol |
|------|-------|--------|
| Bytes | 1 | B |
| Kibibyte | 1,024 | KiB |
| Mebibyte | 1,048,576 | MiB |
| Gibibyte | 1,073,741,824 | GiB |
| Tebibyte | 1,099,511,627,776 | TiB |
| Pebibyte | 1,125,899,906,842,624 | PiB |
| Exbibyte | 1,152,921,504,606,846,976 | EiB |
| Zebibyte | 1,180,591,620,717,411,303,424 | ZiB |
| Yobibyte | 1,208,925,819,614,629,174,706,176 | YiB |

## See Also

- [Date utilities](date.md) - Date formatting
- [String utilities](string.md) - Text manipulation
