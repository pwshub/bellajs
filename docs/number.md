# Number Utilities

Number formatting functions for bytes and financial values.

## Installation

```typescript
import { formatBytes, formatNumber } from "jsr:@pwshub/bellajs";
```

### `formatBytes(bytes, decimals)`

Converts bytes to human-readable size string with IEC binary prefixes (KiB, MiB,
GiB, etc.).

```typescript
formatBytes(0); // "0 Bytes"
formatBytes(1024); // "1 KiB"
formatBytes(1536); // "1.5 KiB"
formatBytes(1048576); // "1 MiB"
formatBytes(1234567890); // "1.15 GiB"
formatBytes(1536, 0); // "2 KiB"
formatBytes(1234567890, 4); // "1.1498 GiB"
```

- Default decimals: 2

### `formatNumber(x, decimals)`

Formats a number as a fixed-point decimal string, typically for financial
display.

```typescript
formatNumber(123); // "123.00"
formatNumber(123.456); // "123.46"
formatNumber(123.456, 3); // "123.456"
formatNumber(1000, 0); // "1000"
formatNumber("45.678", 2); // "45.68"
```

- Default decimals: 2
