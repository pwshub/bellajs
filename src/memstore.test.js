import { describe, it } from 'node:test'
import assert from 'node:assert'

import { memstore } from '../src/memstore.js'

describe('memstore - basic operations', () => {
  it('creates a store with default settings', () => {
    const store = memstore()
    assert.ok(store.set)
    assert.ok(store.get)
    assert.ok(store.has)
    assert.ok(store.del)
    assert.ok(store.clear)
    assert.ok(store.size)
    assert.ok(store.entries)
  })

  it('sets and gets a value', () => {
    const store = memstore()
    store.set('key1', 'value1')
    assert.strictEqual(store.get('key1'), 'value1')
  })

  it('returns null for non-existent key', () => {
    const store = memstore()
    assert.strictEqual(store.get('nonexistent'), null)
  })

  it('checks if key exists', () => {
    const store = memstore()
    store.set('key1', 'value1')
    assert.strictEqual(store.has('key1'), true)
    assert.strictEqual(store.has('nonexistent'), false)
  })

  it('deletes a key', () => {
    const store = memstore()
    store.set('key1', 'value1')
    assert.strictEqual(store.del('key1'), true)
    assert.strictEqual(store.get('key1'), null)
    assert.strictEqual(store.del('key1'), false)
  })

  it('clears all entries', () => {
    const store = memstore()
    store.set('key1', 'value1')
    store.set('key2', 'value2')
    store.clear()
    assert.strictEqual(store.size(), 0)
  })

  it('returns correct size', () => {
    const store = memstore()
    assert.strictEqual(store.size(), 0)
    store.set('key1', 'value1')
    assert.strictEqual(store.size(), 1)
    store.set('key2', 'value2')
    assert.strictEqual(store.size(), 2)
  })

  it('stores any type of value', () => {
    const store = memstore()
    store.set('string', 'hello')
    store.set('number', 42)
    store.set('boolean', true)
    store.set('object', { a: 1 })
    store.set('array', [1, 2, 3])
    store.set('null', null)
    store.set('undefined', undefined)

    assert.strictEqual(store.get('string'), 'hello')
    assert.strictEqual(store.get('number'), 42)
    assert.strictEqual(store.get('boolean'), true)
    assert.deepStrictEqual(store.get('object'), { a: 1 })
    assert.deepStrictEqual(store.get('array'), [1, 2, 3])
    assert.strictEqual(store.get('null'), null)
    assert.strictEqual(store.get('undefined'), undefined)
  })

  it('supports method chaining for set', () => {
    const store = memstore()
    store.set('key1', 'value1').set('key2', 'value2')
    assert.strictEqual(store.get('key1'), 'value1')
    assert.strictEqual(store.get('key2'), 'value2')
  })

  it('supports method chaining for clear', () => {
    const store = memstore()
    store.set('key1', 'value1')
    const result = store.clear()
    assert.ok(result.set)
    assert.ok(result.get)
  })
})

describe('memstore - TTL (time-to-live)', () => {
  it('expires key after TTL', (t) => {
    t.mock.timers.enable({ apis: ['setTimeout', 'Date'] })

    const store = memstore()
    store.set('key1', 'value1', 1) // 1 second TTL
    assert.strictEqual(store.get('key1'), 'value1')

    t.mock.timers.tick(1100)

    assert.strictEqual(store.get('key1'), null)
  })

  it('does not expire key with TTL -1', (t) => {
    t.mock.timers.enable({ apis: ['setTimeout', 'Date'] })

    const store = memstore()
    store.set('key1', 'value1', -1) // No expiration

    t.mock.timers.tick(100)

    assert.strictEqual(store.get('key1'), 'value1')
  })

  it('uses default TTL when not specified', (t) => {
    t.mock.timers.enable({ apis: ['setTimeout', 'Date'] })

    const store = memstore(1) // 1 second default
    store.set('key1', 'value1') // Uses default TTL
    assert.strictEqual(store.get('key1'), 'value1')

    t.mock.timers.tick(1100)

    assert.strictEqual(store.get('key1'), null)
  })

  it('overrides default TTL with specific TTL', (t) => {
    t.mock.timers.enable({ apis: ['setTimeout', 'Date'] })

    const store = memstore(1) // 1 second default
    store.set('key1', 'value1', 10) // Override with 10 seconds
    assert.strictEqual(store.get('key1'), 'value1')

    t.mock.timers.tick(1500)

    assert.strictEqual(store.get('key1'), 'value1')
  })

  it('has() returns false for expired key', (t) => {
    t.mock.timers.enable({ apis: ['setTimeout', 'Date'] })

    const store = memstore()
    store.set('key1', 'value1', 1)
    assert.strictEqual(store.has('key1'), true)

    t.mock.timers.tick(1100)

    assert.strictEqual(store.has('key1'), false)
  })

  it('size() does not count expired keys', (t) => {
    t.mock.timers.enable({ apis: ['setTimeout', 'Date'] })

    const store = memstore()
    store.set('key1', 'value1', 1)
    store.set('key2', 'value2', 10) // Longer TTL
    assert.strictEqual(store.size(), 2)

    t.mock.timers.tick(1100)

    assert.strictEqual(store.size(), 1)
  })
})

describe('memstore - entries', () => {
  it('returns all valid entries', () => {
    const store = memstore()
    store.set('key1', 'value1')
    store.set('key2', 'value2')

    const entries = [...store.entries()]
    assert.strictEqual(entries.length, 2)
    assert.ok(entries.some(([k, v]) => k === 'key1' && v === 'value1'))
    assert.ok(entries.some(([k, v]) => k === 'key2' && v === 'value2'))
  })

  it('filters out expired entries', (t) => {
    t.mock.timers.enable({ apis: ['setTimeout', 'Date'] })

    const store = memstore()
    store.set('key1', 'value1', 1)
    store.set('key2', 'value2', 10)

    t.mock.timers.tick(1100)

    const entries = [...store.entries()]
    assert.strictEqual(entries.length, 1)
    assert.strictEqual(entries[0][0], 'key2')
  })

  it('returns empty array for empty store', () => {
    const store = memstore()
    const entries = [...store.entries()]
    assert.deepStrictEqual(entries, [])
  })
})

describe('memstore - aliases', () => {
  it('save is alias for set', () => {
    const store = memstore()
    store.save('key1', 'value1')
    assert.strictEqual(store.get('key1'), 'value1')
    assert.strictEqual(store.load('key1'), 'value1')
  })

  it('load is alias for get', () => {
    const store = memstore()
    store.set('key1', 'value1')
    assert.strictEqual(store.load('key1'), 'value1')
  })
})
