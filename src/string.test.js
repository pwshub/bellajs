import { describe, it } from 'node:test'
import assert from 'node:assert'

import {
  truncate,
  stripTags,
  escapeHTML,
  unescapeHTML,
  ucfirst,
  ucwords,
  stripAccent,
  slugify,
  getSentences,
  getArrayOfWords,
  getWordCount,
  findWordsIn,
  findWordsInWithRegExp,
  getWordMap,
  getTTR,
} from '../src/string.js'

describe('string - truncate', () => {
  it('returns original text when wordLimit is 0', () => {
    const result = truncate('hello world', 0)
    assert.strictEqual(result, 'hello world')
  })

  it('truncates to specified word count', () => {
    const result = truncate('hello world this is a test', 3)
    assert.strictEqual(result, 'hello world this...')
  })

  it('handles empty string', () => {
    const result = truncate('', 5)
    assert.strictEqual(result, '')
  })

  it('handles text shorter than limit', () => {
    const result = truncate('hello world', 10)
    assert.strictEqual(result, 'hello world')
  })

  it('handles CJK text', () => {
    const result = truncate('こんにちは 世界 これはテストです', 3)
    assert.ok(result.includes('...'))
  })
})

describe('string - stripTags', () => {
  it('removes HTML tags', () => {
    const result = stripTags('<p>Hello <b>world</b></p>')
    assert.strictEqual(result, 'Hello world')
  })

  it('handles string without tags', () => {
    const result = stripTags('Hello world')
    assert.strictEqual(result, 'Hello world')
  })

  it('handles empty string', () => {
    const result = stripTags('')
    assert.strictEqual(result, '')
  })
})

describe('string - escapeHTML', () => {
  it('escapes HTML special characters', () => {
    const result = escapeHTML('<script>alert("XSS")</script>')
    assert.strictEqual(result, '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;')
  })

  it('escapes ampersand', () => {
    const result = escapeHTML('Tom & Jerry')
    assert.strictEqual(result, 'Tom &amp; Jerry')
  })

  it('handles string without special chars', () => {
    const result = escapeHTML('Hello world')
    assert.strictEqual(result, 'Hello world')
  })
})

describe('string - unescapeHTML', () => {
  it('unescapes HTML entities', () => {
    const result = unescapeHTML('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;')
    assert.strictEqual(result, '<script>alert("XSS")</script>')
  })

  it('unescapes ampersand', () => {
    const result = unescapeHTML('Tom &amp; Jerry')
    assert.strictEqual(result, 'Tom & Jerry')
  })
})

describe('string - ucfirst', () => {
  it('capitalizes first character', () => {
    assert.strictEqual(ucfirst('hello'), 'Hello')
  })

  it('lowercases rest of string', () => {
    assert.strictEqual(ucfirst('HELLO'), 'Hello')
  })

  it('handles single character', () => {
    assert.strictEqual(ucfirst('a'), 'A')
  })

  it('handles empty string', () => {
    assert.strictEqual(ucfirst(''), '')
  })
})

describe('string - ucwords', () => {
  it('capitalizes first character of each word', () => {
    assert.strictEqual(ucwords('hello world'), 'Hello World')
  })

  it('handles multiple spaces', () => {
    assert.strictEqual(ucwords('hello  world'), 'Hello  World')
  })

  it('handles empty string', () => {
    assert.strictEqual(ucwords(''), '')
  })
})

describe('string - stripAccent', () => {
  it('removes accents from characters', () => {
    assert.strictEqual(stripAccent('café'), 'cafe')
    assert.strictEqual(stripAccent('naïve'), 'naive')
  })

  it('handles uppercase', () => {
    assert.strictEqual(stripAccent('ÉÀ'), 'EA')
  })

  it('handles string without accents', () => {
    assert.strictEqual(stripAccent('hello'), 'hello')
  })
})

describe('string - slugify', () => {
  it('creates URL-friendly slug', () => {
    assert.strictEqual(slugify('Hello World'), 'hello-world')
  })

  it('removes accents', () => {
    assert.strictEqual(slugify('Café résumé'), 'cafe-resume')
  })

  it('uses custom delimiter', () => {
    assert.strictEqual(slugify('Hello World', '_'), 'hello_world')
  })

  it('handles special characters', () => {
    assert.strictEqual(slugify('Hello! @World#'), 'hello-world')
  })
})

describe('string - getSentences', () => {
  it('splits text into sentences', () => {
    const result = getSentences('Hello world. How are you? I am fine.')
    assert.strictEqual(result.length, 3)
  })

  it('handles empty string', () => {
    const result = getSentences('')
    assert.deepStrictEqual(result, [])
  })

  it('handles single sentence', () => {
    const result = getSentences('Hello world')
    assert.strictEqual(result.length, 1)
  })
})

describe('string - getArrayOfWords', () => {
  it('extracts words from text', () => {
    const result = getArrayOfWords('Hello, world!')
    assert.ok(result.includes('Hello'))
    assert.ok(result.includes('world'))
  })

  it('handles empty string', () => {
    const result = getArrayOfWords('')
    assert.deepStrictEqual(result, [])
  })

  it('filters punctuation', () => {
    const result = getArrayOfWords('Hello, world!')
    assert.strictEqual(result.length, 2)
  })
})

describe('string - getWordCount', () => {
  it('counts words in text', () => {
    assert.strictEqual(getWordCount('hello world'), 2)
    assert.strictEqual(getWordCount('one'), 1)
  })

  it('handles empty string', () => {
    assert.strictEqual(getWordCount(''), 0)
  })

  it('handles multiple spaces', () => {
    assert.strictEqual(getWordCount('hello   world'), 2)
  })
})

describe('string - findWordsIn', () => {
  it('finds words in text using Intl.Segmenter', () => {
    const result = findWordsIn('Hello world', ['hello', 'foo'])
    assert.deepStrictEqual(result, ['hello'])
  })

  it('is case insensitive', () => {
    const result = findWordsIn('Hello World', ['HELLO'])
    assert.deepStrictEqual(result, ['HELLO'])
  })

  it('returns empty array for no matches', () => {
    const result = findWordsIn('hello', ['foo', 'bar'])
    assert.deepStrictEqual(result, [])
  })

  it('handles empty text', () => {
    const result = findWordsIn('', ['hello'])
    assert.deepStrictEqual(result, [])
  })

  it('handles CJK text', () => {
    const result = findWordsIn('こんにちは 世界', ['こんにちは'])
    assert.deepStrictEqual(result, ['こんにちは'])
  })
})

describe('string - findWordsInWithRegExp', () => {
  it('finds words in text using RegExp', () => {
    const result = findWordsInWithRegExp('Hello world', ['hello', 'foo'])
    assert.deepStrictEqual(result, ['hello'])
  })

  it('is case insensitive', () => {
    const result = findWordsInWithRegExp('Hello World', ['HELLO'])
    assert.deepStrictEqual(result, ['HELLO'])
  })

  it('returns empty array for no matches', () => {
    const result = findWordsInWithRegExp('hello', ['foo', 'bar'])
    assert.deepStrictEqual(result, [])
  })

  it('handles empty text', () => {
    const result = findWordsInWithRegExp('', ['hello'])
    assert.deepStrictEqual(result, [])
  })
})

describe('string - getWordMap', () => {
  it('creates word frequency map', () => {
    const result = getWordMap('hello world hello')
    assert.deepStrictEqual(result, { hello: 2, world: 1 })
  })

  it('filters short words', () => {
    const result = getWordMap('I am a test')
    assert.strictEqual('I' in result, false)
    assert.strictEqual('am' in result, false)
    assert.strictEqual('a' in result, false)
    assert.strictEqual('test' in result, true)
  })

  it('handles empty string', () => {
    const result = getWordMap('')
    assert.deepStrictEqual(result, {})
  })
})

describe('string - getTTR', () => {
  it('calculates reading time', () => {
    const result = getTTR('hello world')
    assert.strictEqual(result >= 1, true)
  })

  it('accounts for images', () => {
    const text = 'This is a longer text that will take some time to read. '.repeat(10)
    const result1 = getTTR(text, 0)
    const result2 = getTTR(text, 10)
    assert.strictEqual(result2 > result1, true)
  })

  it('handles empty text', () => {
    const result = getTTR('')
    assert.strictEqual(result, 0)
  })
})
