import { describe, it } from 'node:test'
import assert from 'node:assert'

import { maybe } from '../src/maybe.js'

describe('maybe - basic operations', () => {
  it('creates a Maybe with a value', () => {
    const m = maybe(5)
    assert.ok(m.isNil)
    assert.ok(m.value)
    assert.ok(m.map)
    assert.ok(m.filter)
    assert.ok(m.orElse)
  })

  it('wraps a value correctly', () => {
    assert.strictEqual(maybe(5).value(), 5)
    assert.strictEqual(maybe('hello').value(), 'hello')
    assert.strictEqual(maybe(null).value(), null)
    assert.strictEqual(maybe(undefined).value(), undefined)
  })

  it('checks if value is nil', () => {
    assert.strictEqual(maybe(5).isNil(), false)
    assert.strictEqual(maybe(0).isNil(), false)
    assert.strictEqual(maybe('').isNil(), false)
    assert.strictEqual(maybe(null).isNil(), true)
    assert.strictEqual(maybe(undefined).isNil(), true)
  })

  it('inspects the value', () => {
    assert.strictEqual(maybe(5).inspect(), 'Maybe(5)')
    assert.strictEqual(maybe('hello').inspect(), 'Maybe(hello)')
    assert.strictEqual(maybe(null).inspect(), 'Maybe(null)')
  })

  it('converts to array', () => {
    assert.deepStrictEqual(maybe(5).toArray(), [5])
    assert.deepStrictEqual(maybe(null).toArray(), [])
    assert.deepStrictEqual(maybe(undefined).toArray(), [])
  })
})

describe('maybe - map', () => {
  it('transforms the value', () => {
    const result = maybe(5).map(x => x * 2).value()
    assert.strictEqual(result, 10)
  })

  it('skips transformation if nil', () => {
    const result = maybe(null).map(x => x * 2).value()
    assert.strictEqual(result, null)
  })

  it('chains multiple maps', () => {
    const result = maybe(5)
      .map(x => x + 5)
      .map(x => x * 2)
      .map(x => x - 3)
      .value()
    assert.strictEqual(result, 17)
  })

  it('handles null in chain', () => {
    const result = maybe(5)
      .map(x => x + 5)
      .map(() => null)
      .map(x => x * 2)
      .value()
    assert.strictEqual(result, null)
  })
})

describe('maybe - filter', () => {
  it('keeps value if predicate is true', () => {
    const result = maybe(5).filter(x => x > 3).value()
    assert.strictEqual(result, 5)
  })

  it('returns null if predicate is false', () => {
    const result = maybe(5).filter(x => x > 10).value()
    assert.strictEqual(result, null)
  })

  it('returns null if value is nil', () => {
    const result = maybe(null).filter(x => x > 3).value()
    assert.strictEqual(result, null)
  })

  it('filters with isNumber check', () => {
    const isNumber = (x) => Number(x) === x
    const result1 = maybe(5).filter(isNumber).value()
    assert.strictEqual(result1, 5)

    const result2 = maybe('hello').filter(isNumber).value()
    assert.strictEqual(result2, null)
  })

  it('supports when alias', () => {
    const result = maybe(5).when(x => x > 3).value()
    assert.strictEqual(result, 5)
  })
})

describe('maybe - orElse', () => {
  it('returns value if not nil', () => {
    const result = maybe(5).orElse(() => 0).value()
    assert.strictEqual(result, 5)
  })

  it('returns default if nil', () => {
    const result = maybe(null).orElse(() => 0).value()
    assert.strictEqual(result, 0)
  })

  it('calls function lazily', () => {
    let called = false
    maybe(5).orElse(() => {
      called = true
      return 0
    })
    assert.strictEqual(called, false)
  })

  it('supports getOrElse alias', () => {
    const result = maybe(null).getOrElse(() => 'default').value()
    assert.strictEqual(result, 'default')
  })
})

describe('maybe - tap', () => {
  it('performs side effect', () => {
    let tappedValue = null
    maybe(5)
      .tap(x => { tappedValue = x })
      .value()
    assert.strictEqual(tappedValue, 5)
  })

  it('does not tap if nil', () => {
    let tapped = false
    maybe(null)
      .tap(() => { tapped = true })
      .value()
    assert.strictEqual(tapped, false)
  })

  it('returns same instance for chaining', () => {
    const m = maybe(5)
    const result = m.tap(() => {}).map(x => x * 2)
    assert.strictEqual(result.value(), 10)
  })

  it('taps in the middle of chain', () => {
    let tappedValue = null
    const result = maybe(5)
      .map(x => x + 5)
      .tap(x => { tappedValue = x })
      .map(x => x * 2)
      .value()
    assert.strictEqual(result, 20)
    assert.strictEqual(tappedValue, 10)
  })
})

describe('maybe - complex chains', () => {
  it('handles the original test case (success)', () => {
    const plus5 = (x) => x + 5
    const minus2 = (x) => x - 2
    const isNumber = (x) => Number(x) === x
    const toString = (x) => 'The value is ' + String(x)
    const getDefault = () => 'This is default value'

    const x1 = maybe(5)
      .filter(isNumber)
      .map(plus5)
      .map(minus2)
      .map(toString)
      .orElse(getDefault)
      .value()
    assert.strictEqual(x1, 'The value is 8')
  })

  it('handles the original test case (failure)', () => {
    const plus5 = (x) => x + 5
    const minus2 = (x) => x - 2
    const isNumber = (x) => Number(x) === x
    const toString = (x) => 'The value is ' + String(x)
    const getDefault = () => 'This is default value'

    const x2 = maybe('nothing')
      .filter(isNumber)
      .map(plus5)
      .map(minus2)
      .map(toString)
      .orElse(getDefault)
      .value()
    assert.strictEqual(x2, 'This is default value')
  })

  it('handles object property access', () => {
    const user = { name: 'John', email: 'john@example.com' }
    const result = maybe(user)
      .map(u => u.email)
      .orElse(() => 'default@example.com')
      .value()
    assert.strictEqual(result, 'john@example.com')
  })

  it('handles null object safely', () => {
    const result = maybe(null)
      .map(u => u.email)
      .orElse(() => 'default@example.com')
      .value()
    assert.strictEqual(result, 'default@example.com')
  })
})

describe('maybe - edge cases', () => {
  it('handles falsy values correctly', () => {
    assert.strictEqual(maybe(0).value(), 0)
    assert.strictEqual(maybe('').value(), '')
    assert.strictEqual(maybe(false).value(), false)
    assert.strictEqual(maybe(0).isNil(), false)
    assert.strictEqual(maybe('').isNil(), false)
    assert.strictEqual(maybe(false).isNil(), false)
  })

  it('handles nested maybe', () => {
    const result = maybe(maybe(5))
      .map(m => m.map(x => x * 2))
      .value()
    assert.strictEqual(result.value(), 10)
  })

  it('works with async-style callbacks', () => {
    const result = maybe(5)
      .map(x => ({ value: x }))
      .map(obj => obj.value)
      .value()
    assert.strictEqual(result, 5)
  })
})
