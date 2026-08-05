/** String similarity utilities using cosine similarity. */

/** Tokenizes a string into lowercase alphanumeric words. */
export const tokenize = (text: string): string[] => {
  if (!text) return [];
  return text
    .toLowerCase()
    .split(/[\s/_.-]+/)
    .filter((t) => t.length > 0);
};

/** Builds a bag-of-words frequency map from tokens. */
export const toBow = (tokens: string[]): Record<string, number> => {
  return tokens.reduce((acc: Record<string, number>, token) => {
    acc[token] = (acc[token] ?? 0) + 1;
    return acc;
  }, {});
};

/** Computes cosine similarity between two bag-of-words vectors (0 to 1). */
export const cosineSimilarity = (
  bow1: Record<string, number>,
  bow2: Record<string, number>,
): number => {
  const terms = new Set([...Object.keys(bow1), ...Object.keys(bow2)]);

  let dot = 0;
  let mag1 = 0;
  let mag2 = 0;

  for (const term of terms) {
    const v1 = bow1[term] ?? 0;
    const v2 = bow2[term] ?? 0;
    dot += v1 * v2;
    mag1 += v1 * v1;
    mag2 += v2 * v2;
  }

  const magnitude = Math.sqrt(mag1) * Math.sqrt(mag2);
  return magnitude === 0 ? 0 : dot / magnitude;
};

/** Compares two strings and returns their cosine similarity score (0 to 1). */
export const compareTwoStrings = (first: string, second: string): number => {
  return cosineSimilarity(toBow(tokenize(first)), toBow(tokenize(second)));
};

/** Checks if two strings are similar based on a threshold. */
export const isSimilar = (
  first: string,
  second: string,
  threshold = 0.5,
): boolean => {
  return compareTwoStrings(first, second) >= threshold;
};
