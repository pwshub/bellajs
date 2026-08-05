/** String manipulation utilities. */

import { isString } from "./detection.ts";

const toString = (input: any): string => {
  return !isString(input) ? String(input) : input;
};

/**
 * Truncates text to a specified word count using Intl.Segmenter.
 * Works with any language.
 */
export const truncateByWord = (text: string, wordLimit = 0): string => {
  if (!text) return "";
  if (wordLimit <= 0) {
    return text;
  }

  const segmenter = new Intl.Segmenter(undefined, { granularity: "word" });
  const segments = segmenter.segment(text);

  let wordCount = 0;
  let truncatedText = "";

  for (const { segment, isWordLike } of segments) {
    if (wordCount >= wordLimit) {
      return truncatedText.trim() + "...";
    }
    if (isWordLike) {
      wordCount++;
    }
    truncatedText += segment;
  }

  return truncatedText.trim();
};

/**
 * Truncates text to a specified character count using grapheme clusters.
 * Works with emoji and multi-byte characters.
 */
export const truncateByChar = (text: string, charLimit = 0): string => {
  if (!text) return "";
  if (charLimit <= 0) return text;

  const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
  const segments = segmenter.segment(text);

  let count = 0;
  let result = "";

  for (const { segment } of segments) {
    if (count >= charLimit) {
      return result + "...";
    }
    result += segment;
    count++;
  }

  return result;
};

/** Alias for truncateByChar. */
export const truncateByGrapheme = truncateByChar;

/**
 * Truncates text to a specified number of Unicode code points.
 * Safe for PostgreSQL VARCHAR columns.
 */
export const truncateByCodePoint = (text: string, max = 250): string => {
  if (!text) return "";
  const chars = [...text];
  if (chars.length <= max) return text;
  return chars.slice(0, max).join("");
};

/**
 * Truncates text to a specified number of UTF-8 bytes.
 * Safe for byte-constrained storage like VARBINARY columns.
 */
export const truncateByByte = (text: string, maxBytes = 255): string => {
  if (!text) return "";
  const encoder = new TextEncoder();
  const bytes = encoder.encode(text);
  if (bytes.length <= maxBytes) return text;
  const decoder = new TextDecoder("utf-8", { fatal: false });
  let result = decoder.decode(bytes.slice(0, maxBytes));
  if (result.endsWith("\uFFFD")) {
    result = result.slice(0, -1);
  }
  return result;
};

/** @deprecated Use truncateByWord instead. */
export const truncate = truncateByWord;

/** Removes all HTML tags from a string. */
export const stripTags = (s: string): string => {
  return toString(s).replace(/(<([^>]+)>)/ig, "").trim();
};

/** Escapes HTML special characters to entity equivalents. */
export const escapeHTML = (s: string): string => {
  return toString(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
};

/** Unescapes HTML entities back to original characters. */
export const unescapeHTML = (s: string): string => {
  return toString(s)
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
};

/** Uppercases the first character and lowercases the rest. */
export const ucfirst = (s: string): string => {
  const x = toString(s).toLowerCase();
  return x.length > 1
    ? x.charAt(0).toUpperCase() + x.slice(1)
    : x.toUpperCase();
};

/** Uppercases the first character of each word. */
export const ucwords = (s: string): string => {
  return toString(s).split(" ").map((w: string) => {
    return ucfirst(w);
  }).join(" ");
};

/** Removes accents and diacritical marks from characters. */
export const stripAccent = (s: string): string => {
  const accentMap = new Map<string, string>();
  const lmap: Record<string, string> = {
    a: "á|à|ả|ã|ạ|ă|ắ|ặ|ằ|ẳ|ẵ|â|ấ|ầ|ẩ|ẫ|ậ|ä|æ",
    c: "ç",
    d: "đ|ð",
    e: "é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ|ë",
    i: "í|ì|ỉ|ĩ|ị|ï|î",
    n: "ñ",
    o: "ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ|ö|ø",
    s: "ß",
    u: "ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự|û",
    y: "ý|ỳ|ỷ|ỹ|ỵ|ÿ",
  };
  for (const key in lmap) {
    lmap[key].split("|").forEach((v) => {
      accentMap.set(v, key);
      accentMap.set(v.toUpperCase(), key.toUpperCase());
    });
  }
  // deno-lint-ignore no-control-regex
  return toString(s).replace(/[^\u0000-\u007E]/g, (a: string) => {
    return accentMap.get(a) || a;
  });
};

/** Converts a string into a URL-friendly slug. */
export const slugify = (s: string, delimiter = "-"): string => {
  if (!s) return "";
  return stripAccent(s)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, delimiter);
};

/** Splits text into sentences using Intl.Segmenter. */
export const getSentences = (text: string, lang?: string): string[] => {
  if (!text) return [];
  const segmenter = new Intl.Segmenter(lang, { granularity: "sentence" });
  const segments = segmenter.segment(text.trim());
  return Array.from(segments).map((item) => item.segment);
};

/** Extracts words from text using Intl.Segmenter. */
export const getArrayOfWords = (text: string, lang?: string): string[] => {
  if (!text) return [];
  const segmenter = new Intl.Segmenter(lang, { granularity: "word" });
  const segments = segmenter.segment(text.trim());
  const words: string[] = [];
  for (const { segment, isWordLike } of segments) {
    if (isWordLike) {
      words.push(segment);
    }
  }
  return words;
};

/** Counts words in text using Intl.Segmenter. */
export const getWordCount = (text: string): number => {
  if (!text) return 0;
  const segmenter = new Intl.Segmenter(undefined, { granularity: "word" });
  const segments = segmenter.segment(text);
  let wordCount = 0;
  for (const { isWordLike } of segments) {
    if (isWordLike) {
      wordCount++;
    }
  }
  return wordCount;
};

/** Finds specific words within a text using Intl.Segmenter. */
export const findWordsIn = (text: string, words: string[] = []): string[] => {
  if (!text || !words.length) return [];
  const textWords = getArrayOfWords(text).map((w) => w.toLowerCase());
  return words.filter((word) => {
    return textWords.includes(word.toLowerCase());
  });
};

/** Finds specific words within a text using RegExp. */
export const findWordsInWithRegExp = (
  text: string,
  words: string[] = [],
): string[] => {
  if (!text || !words.length) return [];
  const lowerText = text.toLowerCase();
  return words.filter((word) => {
    const regex = new RegExp("\\b" + word.toLowerCase() + "\\b", "gi");
    return regex.test(lowerText);
  });
};

/** Creates a frequency map of word occurrences in text. */
export const getWordMap = (text: string): Record<string, number> => {
  if (!text) return {};
  const words = getArrayOfWords(text).filter((w) => w.length > 2);
  return words.reduce((acc: Record<string, number>, curr) => {
    acc[curr] = (acc[curr] ?? 0) + 1;
    return acc;
  }, {});
};

/** Calculates Time To Read in minutes based on word count. */
export const getTTR = (
  text: string,
  imgcount = 0,
  wordsPerMinute = 268,
): number => {
  const wordCount = getWordCount(text);
  const minToRead = wordCount / wordsPerMinute;
  const secToRead = Math.ceil(minToRead * 60);
  const secOnImage = imgcount * 5;
  return Math.ceil((secToRead + secOnImage) / 60);
};
