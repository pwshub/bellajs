# Date Utilities

Date formatting, time calculations, and relative time with multi-language
support.

## Installation

```typescript
import { formatDate, formatRelativeTime, sec2dur } from "jsr:@pwshub/bellajs";
```

## Current Time

### `getTime(t)`

Get timestamp in milliseconds. Returns current time if no argument.

### `getIsoDateTime(t)`

Get ISO 8601 datetime string.

```typescript
getIsoDateTime(); // "2026-01-03T20:34:28.000Z"
```

### `formatDateISO(date)`

Format date as YYYY-MM-DD string.

```typescript
formatDateISO(new Date()); // "2026-01-03"
```

## Formatted Dates

### `formatDate(input, locale, options)`

Format date with multi-language support using `Intl.DateTimeFormat`.

```typescript
formatDate(new Date(), "en"); // "Jan 3, 2026, 8:34:28 PM"
formatDate(new Date(), "vi"); // "20:34:28, 3 thg 1, 2026"
formatDate(new Date(), "ja"); // "2026/1/3 20:34:28"
formatDate(new Date(), "zh"); // "2026年1月3日 GMT+7 下午8:34:28"
formatDate(new Date(), "ko"); // "2026. 1. 3. 오후 8:34:28"
```

## Relative Time

### `formatRelativeTime(input, locale, justNowText)`

Format date as relative time (e.g., "5 minutes ago") with multi-language
support.

```typescript
formatRelativeTime(Date.now() - 300000, "en"); // "5 minutes ago"
formatRelativeTime(Date.now() - 300000, "vi"); // "5 phút trước"
formatRelativeTime(Date.now() - 300000, "ko"); // "5분 전"
```

- Default locale: `"en"`
- Default justNowText: `"just now"`

## Duration

### `sec2dur(seconds)`

Convert seconds to duration string.

```typescript
sec2dur(3661); // "1h 1m 1s"
sec2dur(90); // "1m 30s"
```

### `getDuration(begin, end)`

Get duration string from start time to now (or end time).

```typescript
getDuration(Date.now() - 5000); // "5s"
```
