/** In-memory key-value store with optional TTL. */

interface StoreEntry {
  value: any;
  expiry: number;
}

interface Memstore {
  set(key: string, value: any, ttl?: number): Memstore;
  get(key: string): any | null;
  has(key: string): boolean;
  del(key: string): boolean;
  clear(): Memstore;
  size(): number;
  entries(): Generator<[string, any]>;
  save(key: string, value: any, ttl?: number): Memstore;
  load(key: string): any | null;
}

/** Creates an in-memory key-value store with optional TTL (in seconds). */
export const memstore = (defaultTtl = -1): Memstore => {
  const cache = new Map<string, StoreEntry>();

  const isValid = (key: string): boolean => {
    if (!cache.has(key)) {
      return false;
    }
    const entry = cache.get(key)!;
    if (entry.expiry === -1 || entry.expiry > Date.now()) {
      return true;
    }
    cache.delete(key);
    return false;
  };

  const set = (key: string, value: any, ttl = defaultTtl): Memstore => {
    const expiry = ttl >= 0 ? Date.now() + ttl * 1000 : -1;
    cache.set(key, { value, expiry });
    return store;
  };

  const get = (key: string): any | null => {
    if (!isValid(key)) {
      return null;
    }
    return cache.get(key)!.value;
  };

  const has = (key: string): boolean => isValid(key);

  const del = (key: string): boolean => cache.delete(key);

  const clear = (): Memstore => {
    cache.clear();
    return store;
  };

  const size = (): number => {
    let count = 0;
    for (const key of cache.keys()) {
      if (isValid(key)) {
        count++;
      }
    }
    return count;
  };

  const entries = function* (): Generator<[string, any]> {
    for (const [key, entry] of cache.entries()) {
      if (entry.expiry === -1 || entry.expiry > Date.now()) {
        yield [key, entry.value];
      } else {
        cache.delete(key);
      }
    }
  };

  const store: Memstore = {
    set,
    get,
    has,
    del,
    clear,
    size,
    entries,
    save: set,
    load: get,
  };

  return store;
};
