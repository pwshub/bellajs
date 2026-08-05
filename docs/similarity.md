# Similarity Utilities

String comparison and similarity scoring using cosine similarity.

## Installation

```typescript
import { compareTwoStrings, isSimilar } from "jsr:@pwshub/bellajs";
```

## Core Functions

### `compareTwoStrings(first, second)`

Compare two strings and return similarity score (0 to 1).

```typescript
compareTwoStrings("hello", "hello"); // 1
compareTwoStrings("hello", "world"); // 0
compareTwoStrings("hello", "hallo"); // ~0.5
```

- Case insensitive
- Different separators treated same

### `isSimilar(first, second, threshold)`

Check if two strings are similar based on threshold (default: 0.5).

```typescript
isSimilar("hello", "hallo", 0.5); // true
isSimilar("hello", "world", 0.5); // false
```

## Advanced Functions

### `tokenize(text)`

Split text into lowercase tokens.

```typescript
tokenize("Hello World!"); // ["hello", "world"]
```

### `toBow(tokens)`

Convert tokens to Bag-of-Words frequency map.

```typescript
toBow(["hello", "world", "hello"]); // { hello: 2, world: 1 }
```

### `cosineSimilarity(bow1, bow2)`

Calculate cosine similarity between two bag-of-words vectors.

```typescript
const bow1 = { hello: 1, world: 1 };
const bow2 = { hello: 1, foo: 1 };
cosineSimilarity(bow1, bow2); // ~0.5
```

## Algorithm

Uses cosine similarity on bag-of-words vectors:

1. **Tokenize** — Split strings into words
2. **Count** — Create frequency map for each string
3. **Compare** — Calculate cosine of angle between vectors

Properties:

- Returns 1 for identical strings
- Returns 0 for no common words
- Order independent: `compareTwoStrings(a, b) === compareTwoStrings(b, a)`
- Length normalized
