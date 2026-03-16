# Date Utilities

Date formatting, time calculations, and relative time with multi-language support.

## Installation

```bash
npm install @pwshub/bellajs
```

## Usage

```javascript
import { 
  formatDate,
  formatRelativeTime,
  getTime,
  sec2dur
} from '@pwshub/bellajs'
```

## Current Time

### `getTime(t)`

Get timestamp in milliseconds. Returns current time if no argument.

```javascript
getTime()
// 1705395600000 (current timestamp)

getTime('2026-01-01')
// 1735689600000

getTime(new Date('2026-06-15'))
// 1750032000000
```

### `getIsoDateTime(t)`

Get ISO 8601 datetime string.

```javascript
getIsoDateTime()
// "2026-01-16T10:30:00.000Z"

getIsoDateTime('2026-01-01')
// "2026-01-01T00:00:00.000Z"
```

### `formatDateISO(date)`

Format date as YYYY-MM-DD string.

```javascript
formatDateISO(new Date('2026-01-16'))
// "2026-01-16"

formatDateISO('2026-01-16T10:30:00')
// "2026-01-16"
```

## Formatted Dates

### `formatDate(input, locale, options)`

Format date with multi-language support using Intl.DateTimeFormat.

**Parameters:**
- `input` - Date, timestamp, or date string
- `locale` (default: 'en') - Locale code
- `options` - Intl.DateTimeFormatOptions

```javascript
// Default formatting
formatDate(new Date())
// "Jan 3, 2026, 8:34:28 PM"

// Different locales
formatDate(new Date(), 'en')
// "Jan 3, 2026, 8:34:28 PM"

formatDate(new Date(), 'vi')
// "20:34:28, 3 thg 1, 2026"

formatDate(new Date(), 'ja')
// "2026/1/3 20:34:28"

formatDate(new Date(), 'zh')
// "2026 年 1 月 3 日 GMT+7 下午 8:34:28"

formatDate(new Date(), 'ko')
// "2026. 1. 3. 오후 8:34:28"

// Custom options
formatDate(new Date(), 'en', {
  dateStyle: 'full',
  timeStyle: 'short'
})
// "Saturday, January 3, 2026 at 8:34 PM"
```

## Relative Time

### `formatRelativeTime(input, locale, justNowText)`

Format date as relative time (e.g., "5 minutes ago") with multi-language support.

**Parameters:**
- `input` - Date, timestamp, or date string
- `locale` (default: 'en') - Locale code
- `justNowText` (default: 'just now') - Text for times < 1 second

```javascript
// English
formatRelativeTime(Date.now() - 5000)
// "5 seconds ago"

formatRelativeTime(Date.now() - 300000)
// "5 minutes ago"

formatRelativeTime(Date.now() - 3600000)
// "1 hour ago"

formatRelativeTime(Date.now() - 86400000)
// "1 day ago"

// Different locales
formatRelativeTime(Date.now() - 300000, 'vi')
// "5 phút trước"

formatRelativeTime(Date.now() - 300000, 'ja')
// "5 分前"

formatRelativeTime(Date.now() - 300000, 'ko')
// "5 분 전"

formatRelativeTime(Date.now() - 300000, 'zh')
// "5 分钟前"

// Custom "just now" text
formatRelativeTime(Date.now(), 'vi', 'vừa xong')
// "vừa xong"
```

## Duration

### `sec2dur(seconds)`

Convert seconds to HH:MM:SS format.

```javascript
sec2dur(3661)
// "01:01:01"

sec2dur(90)
// "00:01:30"

sec2dur(5)
// "00:00:05"

sec2dur(90061)
// "25:01:01"
```

### `getDuration(begin, end)`

Get duration string from start time to now (or end time).

```javascript
const start = Date.now() - 5000
getDuration(start)
// "00:00:05"

// With explicit end time
getDuration(0, 3661000)
// "01:01:01"
```

## Examples

### Display Article Publish Time

```javascript
import { formatRelativeTime } from '@pwshub/bellajs'

const article = {
  title: 'My Post',
  publishedAt: new Date('2026-01-15T10:00:00')
}

// "2 hours ago"
const timeAgo = formatRelativeTime(article.publishedAt)
```

### Multi-language Support

```javascript
import { formatDate, formatRelativeTime } from '@pwshub/bellajs'

const date = new Date('2026-01-15T10:00:00')

// User selects language
const lang = userPreferences.language // 'vi', 'en', 'ja', etc.

formatDate(date, lang)
formatRelativeTime(date, lang)
```

### Calculate Reading Duration

```javascript
import { sec2dur } from '@pwshub/bellajs'

const videoDurationSeconds = 3661
const formatted = sec2dur(videoDurationSeconds)
// "01:01:01"
```

## See Also

- [String utilities](string.md) - Text formatting
- [Store utilities](store.md) - memstore with TTL for time-based caching
