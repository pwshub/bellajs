import { isString } from './detection.js'

const toString = (input) => {
  return !isString(input) ? String(input) : input
}

/**
 * Truncates text to a specified word count, respecting word boundaries.
 * Works with any language supported by Intl.Segmenter.
 *
 * @param {string} text - The text to truncate.
 * @param {number} [wordLimit=0] - Maximum number of words. If 0, returns original text.
 * @returns {string} The truncated text with ellipsis if needed.
 *
 * @example
 * truncate('Hello world, this is a test', 3) // 'Hello world, this...'
 * truncate('こんにちは世界', 2) // 'こんにちは 世界'
 */
export const truncate = (text, wordLimit = 0) => {
  if (!text) return ''
  if (wordLimit <= 0) {
    return text
  }

  const segmenter = new Intl.Segmenter(undefined, { granularity: 'word' })
  const segments = segmenter.segment(text)

  let wordCount = 0
  let truncatedText = ''

  for (const { segment, isWordLike } of segments) {
    if (wordCount >= wordLimit) {
      return truncatedText.trim() + '...'
    }
    if (isWordLike) {
      wordCount++
    }
    truncatedText += segment
  }

  return truncatedText.trim()
}

/**
 * Removes all HTML tags from a string.
 *
 * @param {string} s - The string to strip tags from.
 * @returns {string} The string without HTML tags.
 */
export const stripTags = (s) => {
  return toString(s).replace(/(<([^>]+)>)/ig, '').trim()
}

/**
 * Escapes HTML special characters to their entity equivalents.
 * Converts &, <, >, and " to their HTML entity forms.
 *
 * @param {string} s - The string to escape.
 * @returns {string} The escaped string.
 */
export const escapeHTML = (s) => {
  return toString(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * Unescapes HTML entities back to their original characters.
 * Converts HTML entities back to &, <, >, and ".
 *
 * @param {string} s - The string to unescape.
 * @returns {string} The unescaped string.
 */
export const unescapeHTML = (s) => {
  return toString(s)
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
}

/**
 * Uppercases the first character of a string and lowercases the rest.
 *
 * @param {string} s - The string to capitalize.
 * @returns {string} The string with the first character uppercased.
 */
export const ucfirst = (s) => {
  const x = toString(s).toLowerCase()
  return x.length > 1
    ? x.charAt(0).toUpperCase() + x.slice(1)
    : x.toUpperCase()
}

/**
 * Uppercases the first character of each word in a string.
 *
 * @param {string} s - The string to capitalize words in.
 * @returns {string} The string with each word capitalized.
 */
export const ucwords = (s) => {
  return toString(s).split(' ').map((w) => {
    return ucfirst(w)
  }).join(' ')
}

const accentMap = new Map()
const buildAccentMap = () => {
  const lmap = {
    a: 'á|à|ả|ã|ạ|ă|ắ|ặ|ằ|ẳ|ẵ|â|ấ|ầ|ẩ|ẫ|ậ|ä|æ',
    c: 'ç',
    d: 'đ|ð',
    e: 'é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ|ë',
    i: 'í|ì|ỉ|ĩ|ị|ï|î',
    n: 'ñ',
    o: 'ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ|ö|ø',
    s: 'ß',
    u: 'ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự|û',
    y: 'ý|ỳ|ỷ|ỹ|ỵ|ÿ',
  }
  for (const key in lmap) {
    lmap[key].split('|').forEach((v) => {
      accentMap.set(v, key)
      accentMap.set(v.toUpperCase(), key.toUpperCase())
    })
  }
}
buildAccentMap()

/**
 * Removes accents and diacritical marks from characters in a string.
 * Converts characters like á, à, â to a, and their uppercase equivalents.
 *
 * @param {string} s - The string to strip accents from.
 * @returns {string} The string without accents.
 */
export const stripAccent = (s) => {
  // eslint-disable-next-line no-control-regex
  return toString(s).replace(/[^\u0000-\u007E]/g, (a) => accentMap.get(a) || a)
}

/**
 * Converts a string into a URL-friendly slug.
 * Removes accents, normalizes unicode, replaces spaces and special characters
 * with a delimiter (default is hyphen).
 *
 * @param {string} s - The string to slugify.
 * @param {string} [delimiter=-] - The character to use as a word separator.
 * @returns {string} The slugified string.
 */
export const slugify = (s, delimiter = '-') => {
  if (!s) return ''
  return stripAccent(s)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, delimiter)
}

/**
 * Splits text into sentences using Intl.Segmenter.
 *
 * @param {string} text - The text to split into sentences.
 * @param {string} [lang] - Optional locale for segmentation (e.g., 'en', 'vi', 'zh').
 * @returns {string[]} Array of sentences.
 *
 * @example
 * getSentences('Hello world. How are you?') // ['Hello world.', 'How are you?']
 */
export const getSentences = (text, lang) => {
  if (!text) return []

  const segmenter = new Intl.Segmenter(lang, { granularity: 'sentence' })
  const segments = segmenter.segment(text.trim())
  return Array.from(segments).map((item) => item.segment)
}

/**
 * Extracts words from text using Intl.Segmenter.
 *
 * @param {string} text - The text to extract words from.
 * @param {string} [lang] - Optional locale for segmentation.
 * @returns {string[]} Array of words.
 *
 * @example
 * getArrayOfWords('Hello, world!') // ['Hello', 'world']
 */
export const getArrayOfWords = (text, lang) => {
  if (!text) return []

  const segmenter = new Intl.Segmenter(lang, { granularity: 'word' })
  const segments = segmenter.segment(text.trim())
  const words = []
  for (const { segment, isWordLike } of segments) {
    if (isWordLike) {
      words.push(segment)
    }
  }
  return words
}

/**
 * Counts words in text using Intl.Segmenter.
 *
 * @param {string} text - The text to count words in.
 * @returns {number} The word count.
 *
 * @example
 * getWordCount('Hello world') // 2
 */
export const getWordCount = (text) => {
  if (!text) return 0

  const segmenter = new Intl.Segmenter(undefined, { granularity: 'word' })
  const segments = segmenter.segment(text)
  let wordCount = 0
  for (const { isWordLike } of segments) {
    if (isWordLike) {
      wordCount++
    }
  }
  return wordCount
}

/**
 * Finds specific words within a text using Intl.Segmenter for accurate matching.
 *
 * @param {string} text - The text to search in.
 * @param {string[]} [words=[]] - Array of words to find.
 * @returns {string[]} Array of words that were found in the text.
 *
 * @example
 * findWordsIn('Hello world', ['hello', 'foo']) // ['hello']
 */
export const findWordsIn = (text, words = []) => {
  if (!text || !words.length) return []

  const textWords = getArrayOfWords(text).map(w => w.toLowerCase())
  return words.filter(word => {
    return textWords.includes(word.toLowerCase())
  })
}

/**
 * Finds specific words within a text using RegExp (fallback method).
 * Use this if findWordsIn() doesn't work correctly for your use case.
 *
 * @param {string} text - The text to search in.
 * @param {string[]} [words=[]] - Array of words to find.
 * @returns {string[]} Array of words that were found in the text.
 *
 * @example
 * findWordsInWithRegExp('Hello world', ['hello', 'foo']) // ['hello']
 */
export const findWordsInWithRegExp = (text, words = []) => {
  if (!text || !words.length) return []
  const lowerText = text.toLowerCase()
  return words.filter(word => {
    const regex = new RegExp('\\b' + word.toLowerCase() + '\\b', 'gi')
    return regex.test(lowerText)
  })
}

/**
 * Creates a frequency map of word occurrences in text.
 *
 * @param {string} text - The text to analyze.
 * @returns {Record<string, number>} Object with words as keys and counts as values.
 *
 * @example
 * getWordMap('hello world hello') // { hello: 2, world: 1 }
 */
export const getWordMap = (text) => {
  if (!text) return {}
  const words = getArrayOfWords(text).filter(w => w.length > 2)
  return words.reduce((acc, curr) => {
    acc[curr] = (acc[curr] ?? 0) + 1
    return acc
  }, {})
}

/**
 * Calculates Time To Read (TTR) in minutes.
 * Based on word count and optional image count.
 *
 * @param {string} text - The text to calculate reading time for.
 * @param {number} [imgcount=0] - Number of images in the content.
 * @param {number} [wordsPerMinute=268] - Average reading speed.
 * @returns {number} Estimated reading time in minutes.
 *
 * @example
 * getTTR('Hello world', 0) // 1 (minute)
 */
export const getTTR = (text, imgcount = 0, wordsPerMinute = 268) => {
  const wordCount = getWordCount(text)
  const minToRead = wordCount / wordsPerMinute
  const secToRead = Math.ceil(minToRead * 60)
  const secOnImage = imgcount * 5
  return Math.ceil((secToRead + secOnImage) / 60)
}
