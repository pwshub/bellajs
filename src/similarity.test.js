import { describe, it } from 'node:test'
import assert from 'node:assert'

import {
  tokenize,
  toBow,
  cosineSimilarity,
  compareTwoStrings,
  isSimilar,
} from '../src/similarity.js'

describe('similarity - tokenize', () => {
  it('tokenizes simple text', () => {
    const result = tokenize('hello world')
    assert.deepStrictEqual(result, ['hello', 'world'])
  })

  it('tokenizes URLs', () => {
    const result = tokenize('https://example.com/path/to/page')
    // Note: colon is kept as it's not in the separator regex
    assert.deepStrictEqual(result, ['https:', 'example', 'com', 'path', 'to', 'page'])
  })

  it('tokenizes with underscores', () => {
    const result = tokenize('some_variable_name')
    assert.deepStrictEqual(result, ['some', 'variable', 'name'])
  })

  it('tokenizes with hyphens', () => {
    const result = tokenize('some-kebab-case-text')
    assert.deepStrictEqual(result, ['some', 'kebab', 'case', 'text'])
  })

  it('handles mixed separators', () => {
    const result = tokenize('some/url_path-file.name')
    assert.deepStrictEqual(result, ['some', 'url', 'path', 'file', 'name'])
  })

  it('converts to lowercase', () => {
    const result = tokenize('Hello WORLD')
    assert.deepStrictEqual(result, ['hello', 'world'])
  })

  it('filters empty tokens', () => {
    const result = tokenize('hello  world')
    assert.deepStrictEqual(result, ['hello', 'world'])
  })

  it('handles empty string', () => {
    const result = tokenize('')
    assert.deepStrictEqual(result, [])
  })

  it('handles null/undefined', () => {
    assert.deepStrictEqual(tokenize(null), [])
    assert.deepStrictEqual(tokenize(undefined), [])
  })
})

describe('similarity - toBow', () => {
  it('creates frequency map from tokens', () => {
    const result = toBow(['hello', 'world', 'hello'])
    assert.deepStrictEqual(result, { hello: 2, world: 1 })
  })

  it('handles empty array', () => {
    const result = toBow([])
    assert.deepStrictEqual(result, {})
  })

  it('handles single token', () => {
    const result = toBow(['test'])
    assert.deepStrictEqual(result, { test: 1 })
  })

  it('handles all same tokens', () => {
    const result = toBow(['a', 'a', 'a', 'a'])
    assert.deepStrictEqual(result, { a: 4 })
  })
})

describe('similarity - cosineSimilarity', () => {
  it('returns ~1 for identical vectors', () => {
    const result = cosineSimilarity({ a: 1, b: 2 }, { a: 1, b: 2 })
    assert.strictEqual(result > 0.99, true) // Floating point precision
  })

  it('returns 0 for no overlap', () => {
    const result = cosineSimilarity({ a: 1 }, { b: 1 })
    assert.strictEqual(result, 0)
  })

  it('returns value between 0 and 1 for partial overlap', () => {
    const result = cosineSimilarity({ a: 1, b: 1 }, { a: 1, c: 1 })
    assert.strictEqual(result > 0, true)
    assert.strictEqual(result < 1, true)
  })

  it('returns 0 for empty vectors', () => {
    const result = cosineSimilarity({}, {})
    assert.strictEqual(result, 0)
  })

  it('handles different magnitudes', () => {
    const result = cosineSimilarity({ a: 2 }, { a: 4 })
    assert.strictEqual(result, 1) // Same direction, different magnitude
  })
})

describe('similarity - compareTwoStrings', () => {
  it('returns ~1 for identical strings', () => {
    const result = compareTwoStrings('hello world', 'hello world')
    assert.strictEqual(result > 0.99, true) // Floating point precision
  })

  it('returns 0 for completely different strings', () => {
    const result = compareTwoStrings('foo bar', 'baz qux')
    assert.strictEqual(result, 0)
  })

  it('returns high score for similar strings', () => {
    const result = compareTwoStrings('hello world', 'hello there')
    assert.strictEqual(result > 0.4, true)
  })

  it('handles URLs', () => {
    const result1 = compareTwoStrings(
      'https://example.com/path/to/page',
      'https://example.com/path/to/page'
    )
    assert.strictEqual(result1 > 0.99, true)

    const result2 = compareTwoStrings(
      'https://example.com/path/to/page',
      'https://example.com/path/to/other'
    )
    assert.strictEqual(result2 > 0.5, true)
  })

  it('handles case insensitivity', () => {
    const result = compareTwoStrings('Hello World', 'hello WORLD')
    assert.strictEqual(result > 0.99, true)
  })

  it('handles different separators', () => {
    const result = compareTwoStrings('hello-world', 'hello_world')
    assert.strictEqual(result > 0.99, true)
  })

  it('handles empty strings', () => {
    const result = compareTwoStrings('', '')
    assert.strictEqual(result, 0)
  })

  it('handles one empty string', () => {
    const result = compareTwoStrings('hello', '')
    assert.strictEqual(result, 0)
  })
})

describe('similarity - isSimilar', () => {
  it('returns true for identical strings', () => {
    const result = isSimilar('hello world', 'hello world', 0.9)
    assert.strictEqual(result, true)
  })

  it('returns false for different strings with high threshold', () => {
    const result = isSimilar('hello world', 'hello there', 0.9)
    assert.strictEqual(result, false)
  })

  it('returns true for similar strings with low threshold', () => {
    const result = isSimilar('hello world', 'hello there', 0.4)
    assert.strictEqual(result, true)
  })

  it('uses default threshold of 0.5', () => {
    // 'foo bar' vs 'foo baz' shares 1 out of 3 words = low similarity
    const result1 = isSimilar('foo bar', 'foo')  // 50% overlap
    assert.strictEqual(result1, true)

    const result2 = isSimilar('foo bar', 'completely different')
    assert.strictEqual(result2, false)
  })

  it('handles edge cases', () => {
    assert.strictEqual(isSimilar('', '', 0), true)
    assert.strictEqual(isSimilar('test', '', 0), true)
  })
})
