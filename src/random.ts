/** Cryptographically secure random utilities. */

const crypto = globalThis.crypto;

const DEFAULT_ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

/**
 * Generates a random unique ID string using crypto.getRandomValues.
 * Length includes the prefix.
 */
export const genid = (len = 32, prefix = ""): string => {
  const prefixLen = prefix.length;
  if (prefixLen >= len) {
    return prefix.substring(0, len);
  }

  const randomLen = len - prefixLen;
  const alphabet = DEFAULT_ALPHABET;
  const alphabetLen = alphabet.length;

  const mask = (2 << (31 - Math.clz32(alphabetLen - 1))) - 1;
  const step = Math.ceil((1.6 * mask * randomLen) / alphabetLen);
  const bytes = new Uint8Array(step);
  crypto.getRandomValues(bytes);

  let id = prefix;
  let i = 0;
  while (id.length < len && i < bytes.length) {
    const randomIndex = bytes[i] & mask;
    if (randomIndex < alphabetLen) {
      id += alphabet[randomIndex];
    }
    i++;
  }

  while (id.length < len) {
    const extraBytes = new Uint8Array(step);
    crypto.getRandomValues(extraBytes);
    let j = 0;
    while (id.length < len && j < extraBytes.length) {
      const randomIndex = extraBytes[j] & mask;
      if (randomIndex < alphabetLen) {
        id += alphabet[randomIndex];
      }
      j++;
    }
  }

  return id;
};

/** Generates a cryptographically secure random integer from 0 to max (inclusive). */
export const randomInt = (max: number): number => {
  if (max < 0 || !Number.isInteger(max)) {
    throw new Error("max must be a non-negative integer");
  }

  if (max === 0) {
    return 0;
  }

  const mask = (2 << (31 - Math.clz32(max))) - 1;
  const bytes = new Uint32Array(1);

  let randomValue: number;
  do {
    crypto.getRandomValues(bytes);
    randomValue = bytes[0] & mask;
  } while (randomValue > max);

  return randomValue;
};
