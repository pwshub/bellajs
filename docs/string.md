# String Utilities

Text manipulation, transformation, and analysis functions with multi-language
support via `Intl.Segmenter`.

## Installation

```typescript
import { getWordCount, slugify, truncateByWord } from "jsr:@pwshub/bellajs";
```

## Truncation

### `truncateByWord(text, wordLimit)`

Truncate to word count, respecting word boundaries.

```typescript
truncateByWord("Hello world this is a test", 3); // "Hello world this..."
```

### `truncateByChar(text, charLimit)`

Truncate to character count, respecting grapheme clusters.

```typescript
truncateByChar("Hello world", 5); // "Hello..."
truncateByChar("👨‍👩‍👧‍👦abc", 2); // "👨‍👩‍👧‍👦..."
```

### `truncateByGrapheme(text, charLimit)`

Alias for `truncateByChar`.

### `truncateByCodePoint(text, max)`

Truncate by Unicode code points. Safe for PostgreSQL `VARCHAR`.

```typescript
truncateByCodePoint("𝄞abc", 2); // "𝄞a"
```

### `truncateByByte(text, maxBytes)`

Truncate by UTF-8 bytes. Does not break multi-byte characters. Safe for
`VARBINARY`.

```typescript
truncateByByte("café", 4); // "caf"
truncateByByte("𝄞abc", 4); // "𝄞"
```

## HTML

### `stripTags(html)` — Remove all HTML tags

### `escapeHTML(text)` — Escape HTML special characters

### `unescapeHTML(html)` — Unescape HTML entities

## Transformations

### `ucfirst(text)` — Uppercase first character, lowercase rest

### `ucwords(text)` — Uppercase first character of each word

### `stripAccent(text)` — Remove accents and diacritical marks

### `slugify(text, delimiter)` — Convert text to URL-friendly slug

```typescript
slugify("Hello World!"); // "hello-world"
slugify("Héllo Wörld", "_"); // "hello_world"
```

## Text Analysis

All text analysis functions use `Intl.Segmenter` for accurate multi-language
support.

### `getSentences(text, lang)` — Split text into sentences

### `getArrayOfWords(text, lang)` — Extract words with proper segmentation

### `getWordCount(text)` — Count words accurately

### `findWordsIn(text, words)` — Find specific words within text

### `findWordsInWithRegExp(text, words)` — Find words using RegExp (fallback)

### `getWordMap(text)` — Create frequency map of word occurrences

### `getTTR(text, imgcount, wordsPerMinute)` — Calculate Time To Read in minutes

```typescript
getWordCount("Hello world"); // 2
getWordCount("こんにちは世界"); // 2
getWordMap("hello world hello"); // { hello: 2, world: 1 }
```
