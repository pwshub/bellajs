/**
 * Tokenizes a string into lowercase alphanumeric words.
 * Handles URL separators (/, -, _, .) and whitespace.
 *
 * @param {string} text - The string to tokenize.
 * @returns {string[]} Array of lowercase tokens.
 *
 * @example
 * tokenize('Hello World') // ['hello', 'world']
 * tokenize('some-url_path/file.name') // ['some', 'url', 'path', 'file', 'name']
 */
export const tokenize = (text) => {
  if (!text) return []
  return text
    .toLowerCase()
    .split(/[\s/_.-]+/)
    .filter(t => t.length > 0)
}

/**
 * Builds a bag-of-words frequency map from a token array.
 *
 * @param {string[]} tokens - Array of tokens.
 * @returns {Record<string, number>} Token frequency map.
 *
 * @example
 * toBow(['hello', 'world', 'hello']) // { hello: 2, world: 1 }
 */
export const toBow = (tokens) => {
  return tokens.reduce((acc, token) => {
    acc[token] = (acc[token] ?? 0) + 1
    return acc
  }, {})
}

/**
 * Computes cosine similarity between two bag-of-words vectors.
 * Returns a value between 0 (no overlap) and 1 (identical).
 *
 * @param {Record<string, number>} bow1 - First bag-of-words vector.
 * @param {Record<string, number>} bow2 - Second bag-of-words vector.
 * @returns {number} Cosine similarity score (0 to 1).
 *
 * @example
 * cosineSimilarity({ a: 1, b: 2 }, { a: 1, b: 2 }) // 1 (identical)
 * cosineSimilarity({ a: 1 }, { b: 1 }) // 0 (no overlap)
 */
export const cosineSimilarity = (bow1, bow2) => {
  const terms = new Set([...Object.keys(bow1), ...Object.keys(bow2)])

  let dot = 0
  let mag1 = 0
  let mag2 = 0

  for (const term of terms) {
    const v1 = bow1[term] ?? 0
    const v2 = bow2[term] ?? 0
    dot += v1 * v2
    mag1 += v1 * v1
    mag2 += v2 * v2
  }

  const magnitude = Math.sqrt(mag1) * Math.sqrt(mag2)
  return magnitude === 0 ? 0 : dot / magnitude
}

/**
 * Compares two strings and returns their cosine similarity score.
 * Well suited for URLs, article titles, and short text comparisons.
 *
 * @param {string} first - The first string to compare.
 * @param {string} second - The second string to compare.
 * @returns {number} Similarity score between 0 (completely different) and 1 (identical).
 *
 * @example
 * compareTwoStrings('hello world', 'hello world') // 1
 * compareTwoStrings('hello world', 'hello there') // ~0.7
 * compareTwoStrings('foo bar', 'baz qux') // 0
 */
export const compareTwoStrings = (first, second) => {
  return cosineSimilarity(toBow(tokenize(first)), toBow(tokenize(second)))
}

/**
 * Checks if two strings are similar based on a threshold.
 *
 * @param {string} first - The first string to compare.
 * @param {string} second - The second string to compare.
 * @param {number} [threshold=0.5] - Minimum similarity score to consider similar (0 to 1).
 * @returns {boolean} True if similarity score meets or exceeds threshold.
 *
 * @example
 * isSimilar('hello world', 'hello world', 0.9) // true
 * isSimilar('hello world', 'hello there', 0.8) // false
 * isSimilar('foo bar', 'foo baz', 0.5) // true
 */
export const isSimilar = (first, second, threshold = 0.5) => {
  return compareTwoStrings(first, second) >= threshold
}
