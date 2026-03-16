/**
 * Creates an in-memory key-value store with optional TTL (time-to-live) support.
 *
 * @param {number} [defaultTtl=-1] - Default TTL in seconds for all entries (-1 for no expiration).
 * @returns {Object} Store instance with set, get, has, del, clear, size, and entries methods.
 *
 * @example
 * const store = memstore(60) // 60 seconds default TTL
 * store.set('user:1', { name: 'John' })
 * store.get('user:1') // { name: 'John' }
 */
export const memstore = (defaultTtl = -1) => {
  const cache = new Map()

  /**
   * Checks if a key has expired and removes it if necessary.
   *
   * @param {string} key - The cache key to check.
   * @returns {boolean} True if key exists and is valid, false otherwise.
   */
  const isValid = (key) => {
    if (!cache.has(key)) {
      return false
    }

    const entry = cache.get(key)
    if (entry.expiry === -1 || entry.expiry > Date.now()) {
      return true
    }

    cache.delete(key)
    return false
  }

  /**
   * Stores a value in the cache with optional TTL.
   *
   * @param {string} key - The cache key.
   * @param {*} value - The value to store (can be any type).
   * @param {number} [ttl=defaultTtl] - Time-to-live in seconds (-1 for no expiration).
   * @returns {Object} The store instance for method chaining.
   *
   * @example
   * store.set('session:abc', { userId: 1 }, 300) // expires in 5 minutes
   * store.set('config', { theme: 'dark' }) // uses default TTL
   */
  const set = (key, value, ttl = defaultTtl) => {
    const expiry = ttl >= 0 ? Date.now() + ttl * 1000 : -1
    cache.set(key, { value, expiry })
    return store
  }

  /**
   * Retrieves a value from the cache.
   *
   * @param {string} key - The cache key.
   * @returns {*} The stored value or null if not found/expired.
   *
   * @example
   * const user = store.get('user:1')
   * if (user === null) {
   *   // Key not found or expired
   * }
   */
  const get = (key) => {
    if (!isValid(key)) {
      return null
    }
    return cache.get(key).value
  }

  /**
   * Checks if a key exists and is not expired.
   *
   * @param {string} key - The cache key.
   * @returns {boolean} True if key exists and is valid, false otherwise.
   *
   * @example
   * if (store.has('user:1')) {
   *   console.log('User exists in cache')
   * }
   */
  const has = (key) => isValid(key)

  /**
   * Deletes a key from the cache.
   *
   * @param {string} key - The cache key to delete.
   * @returns {boolean} True if key existed and was deleted, false otherwise.
   *
   * @example
   * store.del('user:1') // returns true if deleted
   */
  const del = (key) => cache.delete(key)

  /**
   * Removes all entries from the cache.
   *
   * @returns {Object} The store instance for method chaining.
   *
   * @example
   * store.clear() // removes all cached entries
   */
  const clear = () => {
    cache.clear()
    return store
  }

  /**
   * Returns the number of valid (non-expired) entries in the cache.
   *
   * @returns {number} Count of valid entries.
   *
   * @example
   * console.log(`Cache has ${store.size()} entries`)
   */
  const size = () => {
    let count = 0
    for (const key of cache.keys()) {
      if (isValid(key)) {
        count++
      }
    }
    return count
  }

  /**
   * Returns an iterator of all valid [key, value] pairs.
   * Automatically filters out expired entries.
   *
   * @returns {IterableIterator<[string, *]>} Iterator of [key, value] pairs.
   *
   * @example
   * for (const [key, value] of store.entries()) {
   *   console.log(key, value)
   * }
   *
   * // Or convert to array
   * const allEntries = [...store.entries()]
   */
  const entries = function* () {
    for (const [key, entry] of cache.entries()) {
      if (entry.expiry === -1 || entry.expiry > Date.now()) {
        yield [key, entry.value]
      } else {
        cache.delete(key)
      }
    }
  }

  const store = {
    set,
    get,
    has,
    del,
    clear,
    size,
    entries,
    save: set,
    load: get,
  }

  return store
}
