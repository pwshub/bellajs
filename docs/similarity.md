# Similarity Utilities

String comparison and similarity scoring using cosine similarity.

## Installation

```bash
npm install @pwshub/bellajs
```

## Usage

```javascript
import { 
  compareTwoStrings,
  isSimilar,
  tokenize,
  toBow,
  cosineSimilarity
} from '@pwshub/bellajs'
```

## Core Functions

### `compareTwoStrings(first, second)`

Compare two strings and return similarity score (0 to 1).

**Parameters:**
- `first` - First string to compare
- `second` - Second string to compare

**Returns:** number (0 = completely different, 1 = identical)

```javascript
// Identical strings
compareTwoStrings('hello world', 'hello world')
// 1.0 (or very close due to floating point)

// Completely different
compareTwoStrings('foo bar', 'baz qux')
// 0

// Partially similar
compareTwoStrings('hello world', 'hello there')
// ~0.7 (shares 'hello')

// Case insensitive
compareTwoStrings('Hello World', 'hello WORLD')
// 1.0

// Different separators treated same
compareTwoStrings('hello-world', 'hello_world')
// 1.0
```

**Use cases:**
- URL comparison
- Article title matching
- Fuzzy search
- Duplicate detection

### `isSimilar(first, second, threshold)`

Check if two strings are similar based on threshold.

**Parameters:**
- `first` - First string
- `second` - Second string  
- `threshold` (default: 0.5) - Minimum similarity score

**Returns:** boolean

```javascript
isSimilar('hello world', 'hello world', 0.9)
// true

isSimilar('hello world', 'hello there', 0.9)
// false (not similar enough)

isSimilar('hello world', 'hello there', 0.5)
// true

// Default threshold is 0.5
isSimilar('foo bar', 'foo baz')
// true (shares 'foo')

isSimilar('foo bar', 'completely different')
// false
```

## Advanced Functions

### `tokenize(text)`

Split text into lowercase tokens.

```javascript
tokenize('Hello World')
// ['hello', 'world']

tokenize('https://example.com/path/to/page')
// ['https:', 'example', 'com', 'path', 'to', 'page']

tokenize('some_variable-name.file')
// ['some', 'variable', 'name', 'file']
```

### `toBow(tokens)`

Convert tokens to Bag-of-Words frequency map.

```javascript
toBow(['hello', 'world', 'hello'])
// { hello: 2, world: 1 }

toBow(['a', 'b', 'a', 'c', 'a'])
// { a: 3, b: 1, c: 1 }
```

### `cosineSimilarity(bow1, bow2)`

Calculate cosine similarity between two bag-of-words vectors.

```javascript
cosineSimilarity(
  { hello: 2, world: 1 },
  { hello: 2, world: 1 }
)
// 1.0 (identical)

cosineSimilarity(
  { hello: 1 },
  { world: 1 }
)
// 0 (no overlap)

cosineSimilarity(
  { hello: 1, world: 1 },
  { hello: 1, there: 1 }
)
// ~0.5 (partial overlap)
```

## Examples

### Detect Duplicate URLs

```javascript
import { isSimilar } from '@pwshub/bellajs'

const existingUrls = [
  'https://example.com/article/123',
  'https://example.com/article/456'
]

const newUrl = 'https://example.com/article/123?ref=twitter'

const isDuplicate = existingUrls.some(existing => 
  isSimilar(existing, newUrl, 0.8)
)
// true (similar enough to be duplicate)
```

### Match Article Titles

```javascript
import { compareTwoStrings } from '@pwshub/bellajs'

const stored = 'Breaking: Major Event Happens Today'
const incoming = 'breaking major event happens today'

const similarity = compareTwoStrings(stored, incoming)
// ~1.0 (essentially identical)

if (similarity > 0.9) {
  console.log('Likely duplicate article')
}
```

### Fuzzy Search

```javascript
import { isSimilar } from '@pwshub/bellajs'

const products = [
  'Wireless Bluetooth Headphones',
  'USB-C Charging Cable',
  'Laptop Stand Adjustable'
]

const searchQuery = 'wireless bluetooth headphone'

const matches = products.filter(product =>
  isSimilar(product.toLowerCase(), searchQuery, 0.7)
)
// ['Wireless Bluetooth Headphones']
```

### Content Deduplication

```javascript
import { compareTwoStrings } from '@pwshub/bellajs'

const articles = []

function addArticle(title, content) {
  // Check for duplicate title
  const isDuplicate = articles.some(existing =>
    compareTwoStrings(existing.title, title) > 0.9
  )
  
  if (!isDuplicate) {
    articles.push({ title, content })
  }
}
```

## Algorithm

Uses **cosine similarity** on bag-of-words vectors:

1. **Tokenize:** Split strings into words
2. **Count:** Create frequency map for each string
3. **Compare:** Calculate cosine of angle between vectors

```
Similarity = (A · B) / (||A|| × ||B||)

Where:
- A · B = dot product
- ||A|| = magnitude of A
- ||B|| = magnitude of B
```

**Properties:**
- Returns 1 for identical strings
- Returns 0 for no common words
- Order independent: `compare(a, b) == compare(b, a)`
- Length normalized: Long vs short strings compared fairly

## See Also

- [String utilities](string.md) - Text manipulation
- [Hash utilities](hash.md) - For exact matching via hashes
