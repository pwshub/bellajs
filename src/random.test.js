import { describe, it } from 'node:test'
import assert from 'node:assert'

import { genid, randomInt } from '../src/random.js'

describe('random - genid', () => {
  it('generates ID with default length (32)', () => {
    const id = genid()
    assert.strictEqual(id.length, 32)
  })

  it('generates ID with specified length', () => {
    const id = genid(16)
    assert.strictEqual(id.length, 16)
  })

  it('generates ID with prefix', () => {
    const id = genid(16, 'user_')
    assert.strictEqual(id.length, 16)
    assert.ok(id.startsWith('user_'))
  })

  it('handles prefix longer than length', () => {
    const id = genid(5, 'prefix_is_longer')
    assert.strictEqual(id.length, 5)
    assert.strictEqual(id, 'prefi')
  })

  it('generates unique IDs', () => {
    const ids = new Set()
    for (let i = 0; i < 100; i++) {
      ids.add(genid())
    }
    assert.strictEqual(ids.size, 100)
  })

  it('uses only alphanumeric characters (A-Za-z0-9)', () => {
    const id = genid(100)
    assert.match(id, /^[A-Za-z0-9]+$/)
  })

  it('handles length of 1', () => {
    const id = genid(1)
    assert.strictEqual(id.length, 1)
  })

  it('handles length equal to prefix', () => {
    const id = genid(4, 'test')
    assert.strictEqual(id, 'test')
  })
})

describe('random - randomInt', () => {
  it('generates number between 0 and max', () => {
    for (let i = 0; i < 100; i++) {
      const result = randomInt(100)
      assert.strictEqual(result >= 0, true)
      assert.strictEqual(result <= 100, true)
    }
  })

  it('generates 0 when max is 0', () => {
    const result = randomInt(0)
    assert.strictEqual(result, 0)
  })

  it('generates 0 or 1 when max is 1', () => {
    const results = new Set()
    for (let i = 0; i < 100; i++) {
      results.add(randomInt(1))
    }
    // Should have both 0 and 1 in 100 tries
    assert.strictEqual(results.size, 2)
    assert.ok(results.has(0))
    assert.ok(results.has(1))
  })

  it('handles large max values', () => {
    const result = randomInt(1000000)
    assert.strictEqual(result >= 0, true)
    assert.strictEqual(result <= 1000000, true)
  })

  it('throws error for negative max', () => {
    assert.throws(() => {
      randomInt(-1)
    }, /max must be a non-negative integer/)
  })

  it('throws error for non-integer max', () => {
    assert.throws(() => {
      randomInt(1.5)
    }, /max must be a non-negative integer/)
  })

  it('generates all values in range over many iterations', () => {
    const results = new Set()
    for (let i = 0; i < 1000; i++) {
      results.add(randomInt(5))
    }
    // Should have all values 0-5
    assert.strictEqual(results.size, 6)
    for (let i = 0; i <= 5; i++) {
      assert.ok(results.has(i))
    }
  })
})
