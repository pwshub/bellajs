import { describe, it } from 'node:test'
import assert from 'node:assert'

import { clone, copies } from '../src/object.js'

describe('object - clone', () => {
  describe('primitive values', () => {
    it('clone number returns same value', () => {
      const original = 42
      const cloned = clone(original)
      assert.strictEqual(cloned, original)
    })

    it('clone string returns same value', () => {
      const original = 'hello'
      const cloned = clone(original)
      assert.strictEqual(cloned, original)
    })

    it('clone boolean returns same value', () => {
      const original = true
      const cloned = clone(original)
      assert.strictEqual(cloned, original)
    })

    it('clone null returns null', () => {
      const original = null
      const cloned = clone(original)
      assert.strictEqual(cloned, null)
    })

    it('clone undefined returns undefined', () => {
      const original = undefined
      const cloned = clone(original)
      assert.strictEqual(cloned, undefined)
    })

    it('clone NaN returns NaN', () => {
      const original = NaN
      const cloned = clone(original)
      assert.strictEqual(Number.isNaN(cloned), true)
    })
  })

  describe('plain objects', () => {
    it('clone simple object', () => {
      const original = { a: 1, b: 2 }
      const cloned = clone(original)
      assert.deepStrictEqual(cloned, original)
      assert.notStrictEqual(cloned, original)
    })

    it('clone nested object', () => {
      const original = {
        a: 1,
        b: {
          c: 2,
          d: {
            e: 3,
          },
        },
      }
      const cloned = clone(original)
      assert.deepStrictEqual(cloned, original)
      assert.notStrictEqual(cloned, original)
      assert.notStrictEqual(cloned.b, original.b)
      assert.notStrictEqual(cloned.b.d, original.b.d)
    })

    it('cloned object is immutable', () => {
      const original = { a: 1, b: { c: 2 } }
      const cloned = clone(original)
      cloned.a = 100
      cloned.b.c = 200
      assert.strictEqual(original.a, 1)
      assert.strictEqual(original.b.c, 2)
    })

    it('clone object with undefined values', () => {
      const original = { a: 1, b: undefined }
      const cloned = clone(original)
      assert.deepStrictEqual(cloned, original)
    })

    it('clone empty object', () => {
      const original = {}
      const cloned = clone(original)
      assert.deepStrictEqual(cloned, original)
      assert.notStrictEqual(cloned, original)
    })
  })

  describe('arrays', () => {
    it('clone simple array', () => {
      const original = [1, 2, 3]
      const cloned = clone(original)
      assert.deepStrictEqual(cloned, original)
      assert.notStrictEqual(cloned, original)
    })

    it('clone nested array', () => {
      const original = [1, [2, [3, [4]]]]
      const cloned = clone(original)
      assert.deepStrictEqual(cloned, original)
      assert.notStrictEqual(cloned, original)
      assert.notStrictEqual(cloned[1], original[1])
    })

    it('clone array with objects', () => {
      const original = [
        { a: 1 },
        { b: 2 },
      ]
      const cloned = clone(original)
      assert.deepStrictEqual(cloned, original)
      assert.notStrictEqual(cloned[0], original[0])
    })

    it('cloned array is immutable', () => {
      const original = [1, { a: 2 }, [3]]
      const cloned = clone(original)
      cloned[0] = 100
      cloned[1].a = 200
      cloned[2][0] = 300
      assert.strictEqual(original[0], 1)
      assert.strictEqual(original[1].a, 2)
      assert.strictEqual(original[2][0], 3)
    })

    it('clone empty array', () => {
      const original = []
      const cloned = clone(original)
      assert.deepStrictEqual(cloned, original)
      assert.notStrictEqual(cloned, original)
    })

    it('clone sparse array', () => {
      const original = [1, undefined, 3]
      const cloned = clone(original)
      assert.strictEqual(cloned.length, 3)
      assert.strictEqual(cloned[0], 1)
      assert.strictEqual(cloned[2], 3)
    })
  })

  describe('Date objects', () => {
    it('clone Date object', () => {
      const original = new Date('2026-01-16T10:30:00Z')
      const cloned = clone(original)
      assert.deepStrictEqual(cloned, original)
      assert.notStrictEqual(cloned, original)
    })

    it('cloned Date is immutable', () => {
      const original = new Date('2026-01-16T10:30:00Z')
      const cloned = clone(original)
      cloned.setFullYear(2027)
      assert.strictEqual(original.getFullYear(), 2026)
      assert.strictEqual(cloned.getFullYear(), 2027)
    })

    it('clone invalid Date', () => {
      const original = new Date('invalid')
      const cloned = clone(original)
      assert.strictEqual(cloned.toString(), original.toString())
    })
  })

  describe('circular references', () => {
    it('clone object with circular reference', () => {
      const original = { a: 1 }
      original.self = original
      const cloned = clone(original)
      assert.strictEqual(cloned.a, 1)
      assert.strictEqual(cloned.self, cloned)
    })

    it('clone nested circular references', () => {
      const a = { name: 'a' }
      const b = { name: 'b', ref: a }
      a.ref = b
      const cloned = clone(a)
      assert.strictEqual(cloned.name, 'a')
      assert.strictEqual(cloned.ref.name, 'b')
      assert.strictEqual(cloned.ref.ref, cloned)
    })

    it('clone array with circular reference', () => {
      const original = [1, 2]
      original.push(original)
      const cloned = clone(original)
      assert.strictEqual(cloned[0], 1)
      assert.strictEqual(cloned[1], 2)
      assert.strictEqual(cloned[2], cloned)
    })
  })

  describe('special objects', () => {
    it('clone RegExp object', () => {
      const original = /test/gi
      const cloned = clone(original)
      assert.strictEqual(cloned.source, original.source)
      assert.strictEqual(cloned.flags, original.flags)
    })

    it('clone Error object', () => {
      const original = new Error('test error')
      const cloned = clone(original)
      assert.strictEqual(cloned.message, original.message)
      assert.strictEqual(cloned.name, original.name)
    })

    it('clone Map object', () => {
      const original = new Map([['a', 1], ['b', 2]])
      const cloned = clone(original)
      assert.deepStrictEqual(cloned, original)
      assert.notStrictEqual(cloned, original)
    })

    it('clone Set object', () => {
      const original = new Set([1, 2, 3])
      const cloned = clone(original)
      assert.deepStrictEqual(cloned, original)
      assert.notStrictEqual(cloned, original)
    })
  })

  describe('mixed structures', () => {
    it('clone complex nested structure', () => {
      const original = {
        name: 'test',
        date: new Date('2026-01-16'),
        items: [1, 2, { nested: true }],
        metadata: new Map([['key', 'value']]),
        tags: new Set(['a', 'b']),
      }
      const cloned = clone(original)
      assert.deepStrictEqual(cloned, original)
      assert.notStrictEqual(cloned, original)
      assert.notStrictEqual(cloned.items, original.items)
      assert.notStrictEqual(cloned.date, original.date)
    })
  })
})

describe('object - copies', () => {
  describe('basic copying', () => {
    it('copies simple properties', () => {
      const source = { a: 1, b: 2, c: 3 }
      const dest = { a: 10, b: 20, d: 40 }
      const result = copies(source, dest)
      assert.deepStrictEqual(result, { a: 1, b: 2, c: 3, d: 40 })
    })

    it('copies nested objects', () => {
      const source = { a: 1, b: { c: 2, d: 3 } }
      const dest = { a: 10, b: { c: 20, e: 30 } }
      const result = copies(source, dest)
      assert.deepStrictEqual(result, { a: 1, b: { c: 2, d: 3, e: 30 } })
    })

    it('copies nested arrays', () => {
      const source = { a: [1, 2], b: [3, 4] }
      const dest = { a: [10, 20], c: [50] }
      const result = copies(source, dest)
      assert.deepStrictEqual(result, { a: [1, 2], b: [3, 4], c: [50] })
    })

    it('modifies destination object in place', () => {
      const source = { a: 1, b: 2 }
      const dest = { a: 10, c: 30 }
      const result = copies(source, dest)
      assert.strictEqual(result, dest)
    })
  })

  describe('matched option', () => {
    it('copies only matching properties when matched=true', () => {
      const source = { a: 1, b: 2, c: 3 }
      const dest = { a: 10, b: 20, d: 40 }
      const result = copies(source, dest, true)
      assert.deepStrictEqual(result, { a: 1, b: 2, d: 40 })
    })

    it('copies nested matching properties', () => {
      const source = { a: { b: 1, c: 2 } }
      const dest = { a: { b: 10, d: 20 } }
      const result = copies(source, dest, true)
      assert.deepStrictEqual(result, { a: { b: 1, d: 20 } })
    })
  })

  describe('excepts option', () => {
    it('skips properties in excepts list', () => {
      const source = { a: 1, b: 2, c: 3 }
      const dest = { a: 10 }
      const result = copies(source, dest, false, ['b', 'c'])
      assert.deepStrictEqual(result, { a: 1 })
    })

    it('works with matched and excepts together', () => {
      const source = { a: 1, b: 2, c: 3 }
      const dest = { a: 10, b: 20, d: 40 }
      const result = copies(source, dest, true, ['b'])
      assert.deepStrictEqual(result, { a: 1, b: 20, d: 40 })
    })
  })

  describe('immutability', () => {
    it('source object is not modified', () => {
      const source = { a: 1, b: { c: 2 } }
      const dest = { a: 10, b: { c: 20 } }
      copies(source, dest)
      assert.strictEqual(source.a, 1)
      assert.strictEqual(source.b.c, 2)
    })

    it('nested objects are deep copied', () => {
      const source = { a: { b: { c: 1 } } }
      const dest = { a: { b: { d: 2 } } }
      const result = copies(source, dest)
      result.a.b.c = 100
      assert.strictEqual(source.a.b.c, 1)
    })
  })

  describe('edge cases', () => {
    it('copies from empty source', () => {
      const source = {}
      const dest = { a: 1 }
      const result = copies(source, dest)
      assert.deepStrictEqual(result, { a: 1 })
    })

    it('copies to empty dest', () => {
      const source = { a: 1 }
      const dest = {}
      const result = copies(source, dest)
      assert.deepStrictEqual(result, { a: 1 })
    })

    it('handles null values', () => {
      const source = { a: null, b: 1 }
      const dest = { a: 10 }
      const result = copies(source, dest)
      assert.deepStrictEqual(result, { a: null, b: 1 })
    })

    it('handles undefined values', () => {
      const source = { a: undefined, b: 1 }
      const dest = { a: 10 }
      const result = copies(source, dest)
      assert.deepStrictEqual(result, { a: undefined, b: 1 })
    })

    it('handles Date objects', () => {
      const source = { date: new Date('2026-01-16') }
      const dest = { date: new Date('2025-01-01') }
      const result = copies(source, dest)
      assert.deepStrictEqual(result.date, source.date)
      assert.notStrictEqual(result.date, source.date)
    })
  })
})
