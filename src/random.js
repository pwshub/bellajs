const crypto = globalThis.crypto

/**
 * Default alphabet for ID generation: A-Z, a-z, 0-9 (62 characters).
 * Excludes _ and - for cleaner IDs.
 */
const DEFAULT_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

/**
 * Generates a random unique ID string using cryptographically secure random values.
 * The length includes the prefix, so if prefix takes 4 characters of a 10-char ID,
 * only 6 random characters are generated.
 *
 * @param {number} [len=32] - The total length of the ID (including prefix).
 * @param {string} [prefix=''] - An optional prefix to add to the beginning of the ID.
 * @returns {string} A random ID string of the specified length.
 *
 * @example
 * genid() // 'aB3xY9kL2mN5pQ7rS8tU0vW1xY2zA3bC'
 * genid(16) // 'kL2mN5pQ7rS8tU0v'
 * genid(16, 'user_') // 'user_aB3xY9kL2mN5p'
 */
export const genid = (len = 32, prefix = '') => {
  const prefixLen = prefix.length
  if (prefixLen >= len) {
    return prefix.substring(0, len)
  }

  const randomLen = len - prefixLen
  const alphabet = DEFAULT_ALPHABET
  const alphabetLen = alphabet.length

  // Calculate mask for bitmask technique
  // Find smallest 2^n - 1 that covers alphabet size (62)
  // For 62: clz32(61) = 26, so 31 - 26 = 5, mask = (2 << 5) - 1 = 63
  const mask = (2 << (31 - Math.clz32(alphabetLen - 1))) - 1

  // Calculate how many random bytes we need
  // Step calculation: fetch extra bytes to reduce crypto calls
  const step = Math.ceil((1.6 * mask * randomLen) / alphabetLen)
  const bytes = new Uint8Array(step)
  crypto.getRandomValues(bytes)

  let id = prefix
  let i = 0
  while (id.length < len && i < bytes.length) {
    // Use bitmask to get value in range, reject if out of bounds
    const randomIndex = bytes[i] & mask
    if (randomIndex < alphabetLen) {
      id += alphabet[randomIndex]
    }
    i++
  }

  // If we ran out of bytes, generate more (shouldn't happen often)
  while (id.length < len) {
    const extraBytes = new Uint8Array(step)
    crypto.getRandomValues(extraBytes)
    let j = 0
    while (id.length < len && j < extraBytes.length) {
      const randomIndex = extraBytes[j] & mask
      if (randomIndex < alphabetLen) {
        id += alphabet[randomIndex]
      }
      j++
    }
  }

  return id
}

/**
 * Generates a cryptographically secure random integer from 0 to max (inclusive).
 * Uses bitmask technique for efficiency.
 *
 * @param {number} max - The maximum value (inclusive).
 * @returns {number} A random integer between 0 and max.
 *
 * @example
 * randomInt(100) // 0-100
 * randomInt(1) // 0 or 1
 * randomInt(1000000) // 0-1000000
 */
export const randomInt = (max) => {
  if (max < 0 || !Number.isInteger(max)) {
    throw new Error('max must be a non-negative integer')
  }

  if (max === 0) {
    return 0
  }

  // Calculate mask for efficient random generation
  const mask = (2 << (31 - Math.clz32(max))) - 1

  const bytes = new Uint32Array(1)

  // Rejection sampling to avoid modulo bias
  let randomValue
  do {
    crypto.getRandomValues(bytes)
    randomValue = bytes[0] & mask
  } while (randomValue > max)

  return randomValue
}
