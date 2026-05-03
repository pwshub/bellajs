# String Utilities

Text manipulation, transformation, and analysis functions with multi-language support.

## Installation

```bash
npm install @pwshub/bellajs
```

## Usage

```javascript
import { 
  truncate,
  slugify,
  getWordCount,
  getSentences
} from '@pwshub/bellajs'
```

## Basic Transformations

### `truncateByWord(text, wordLimit)`

Truncate text to specified word count, respecting word boundaries. Works with any language.

```javascript
truncateByWord('Hello world this is a test', 3)
// "Hello world this..."

truncateByWord('こんにちは 世界 これはテストです', 3)
// "こんにちは 世界 これ..."

truncateByWord('Short text', 10)
// "Short text" (no truncation needed)
```

### `truncateByChar(text, charLimit)`

Truncate text to specified character count, respecting grapheme clusters (emoji, multi-byte characters).

```javascript
truncateByChar('Hello world', 5)
// "Hello..."

truncateByChar('こんにちは', 3)
// "こんにち..."

truncateByChar('👨‍👩‍👧‍👦abc', 2)
// "👨‍👩‍👧‍👦..."

truncateByChar('Short', 10)
// "Short" (no truncation needed)
```

### `truncateByGrapheme(text, charLimit)`

Alias for `truncateByChar`. Truncates text by grapheme clusters.

### `truncateByCodePoint(text, max)`

Truncate text to a specified number of Unicode code points. Safe for PostgreSQL `VARCHAR` columns.

```javascript
truncateByCodePoint('Hello world', 5)
// "Hello"

truncateByCodePoint('𝄞abc', 2)
// "𝄞a" (𝄞 is 1 code point)

truncateByCodePoint('Hello', 10)
// "Hello" (no truncation needed)
```

### `truncateByByte(text, maxBytes)`

Truncate text to a specified number of UTF-8 bytes. Does not break multi-byte characters.
Safe for `VARBINARY` columns and other byte-constrained storage.

```javascript
truncateByByte('Hello world', 5)
// "Hello"

truncateByByte('café', 4)
// "caf" (é is 2 bytes, so it's excluded)

truncateByByte('𝄞abc', 4)
// "𝄞" (4 bytes)
```

### `stripTags(html)`

Remove all HTML tags from a string.

```javascript
stripTags('<p>Hello <b>world</b></p>')
// "Hello world"
```

### `escapeHTML(text)`

Escape HTML special characters.

```javascript
escapeHTML('<script>alert("XSS")</script>')
// "&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;"
```

### `unescapeHTML(html)`

Unescape HTML entities.

```javascript
unescapeHTML('&lt;hello&gt;')
// "<hello>"
```

### `ucfirst(text)`

Uppercase first character, lowercase rest.

```javascript
ucfirst('HELLO WORLD')
// "Hello world"
```

### `ucwords(text)`

Uppercase first character of each word.

```javascript
ucwords('hello world')
// "Hello World"
```

### `stripAccent(text)`

Remove accents and diacritical marks.

```javascript
stripAccent('café résumé naïve')
// "cafe resume naive"
```

### `slugify(text, delimiter)`

Convert text to URL-friendly slug.

```javascript
slugify('Hello World')
// "hello-world"

slugify('Café résumé', '-')
// "cafe-resume"

slugify('Nghị luận tác phẩm', '-')
// "nghi-luan-tac-pham"

slugify('Hello World', '_')
// "hello_world"
```

## Text Analysis

### `getSentences(text, lang)`

Split text into sentences using Intl.Segmenter.

```javascript
getSentences('Hello world. How are you? I am fine.')
// ["Hello world.", " How are you?", " I am fine."]

getSentences('Xin chào. Bạn khỏe không?')
// ["Xin chào.", " Bạn khỏe không?"]
```

### `getArrayOfWords(text, lang)`

Extract words from text with proper segmentation.

```javascript
getArrayOfWords('Hello, world!')
// ["Hello", "world"]

getArrayOfWords('こんにちは 世界')
// ["こんにちは", "世界"]
```

### `getWordCount(text)`

Count words in text accurately.

```javascript
getWordCount('Hello world')
// 2

getWordCount('One two three four')
// 4
```

### `findWordsIn(text, words)`

Find specific words within a text.

```javascript
findWordsIn('Hello world', ['hello', 'foo'])
// ["hello"]

findWordsIn('The quick brown fox', ['cat', 'fox'])
// ["fox"]
```

### `getWordMap(text)`

Create frequency map of word occurrences.

```javascript
getWordMap('hello world hello')
// { hello: 2, world: 1 }
```

### `getTTR(text, imgcount, wordsPerMinute)`

Calculate Time To Read in minutes.

```javascript
getTTR('Short text here')
// 1 (minute)

getTTR(longArticle, 5)  // with 5 images
// 8 (minutes)
```

## See Also

- [Similarity utilities](similarity.md) - String comparison
- [Detection utilities](detection.md) - Type checking
