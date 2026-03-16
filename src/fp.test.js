import { describe, it } from 'node:test'
import assert from 'node:assert'

import { curry, compose, pipe } from '../src/fp.js'

describe('fp - curry', () => {
  it('check if .curry() works correctly', () => {
    const sum = curry((a, b, c) => {
      return a + b + c
    })
    assert.strictEqual(sum(3)(2)(1), 6)
    assert.strictEqual(sum(1)(2)(3), 6)
    assert.strictEqual(sum(1, 2)(3), 6)
    assert.strictEqual(sum(1)(2, 3), 6)
    assert.strictEqual(sum(1, 2, 3), 6)
  })

  it('curries function with 2 arguments', () => {
    const multiply = curry((a, b) => a * b)
    const double = multiply(2)
    assert.strictEqual(double(5), 10)
    assert.strictEqual(double(10), 20)
  })

  it('curries function with 4 arguments', () => {
    const add = curry((a, b, c, d) => a + b + c + d)
    assert.strictEqual(add(1)(2)(3)(4), 10)
    assert.strictEqual(add(1, 2)(3, 4), 10)
    assert.strictEqual(add(1)(2, 3, 4), 10)
  })
})

describe('fp - compose', () => {
  it('check if .compose() works correctly', () => {
    const f1 = (name) => {
      return `f1 ${name}`
    }
    const f2 = (name) => {
      return `f2 ${name}`
    }
    const f3 = (name) => {
      return `f3 ${name}`
    }

    const addDashes = compose(f1, f2, f3)
    assert.strictEqual(addDashes('Alice'), 'f1 f2 f3 Alice')

    const add3 = (num) => {
      return num + 3
    }

    const mul6 = (num) => {
      return num * 6
    }

    const div2 = (num) => {
      return num / 2
    }

    const sub5 = (num) => {
      return num - 5
    }

    const calculate = compose(sub5, div2, mul6, add3)
    assert.strictEqual(calculate(5), 19)
  })

  it('composes two functions', () => {
    const add1 = x => x + 1
    const mul2 = x => x * 2
    const fn = compose(mul2, add1)
    assert.strictEqual(fn(5), 12)  // (5+1)*2 = 12
  })

  it('composes single function (identity)', () => {
    const identity = x => x
    const fn = compose(identity)
    assert.strictEqual(fn(42), 42)
  })

  it('works with string transformations', () => {
    const uppercase = s => s.toUpperCase()
    const exclaim = s => s + '!'
    const shout = compose(exclaim, uppercase)
    assert.strictEqual(shout('hello'), 'HELLO!')
  })
})

describe('fp - pipe', () => {
  it('check if .pipe() works correctly', () => {
    const f1 = (name) => {
      return `f1 ${name}`
    }
    const f2 = (name) => {
      return `f2 ${name}`
    }
    const f3 = (name) => {
      return `f3 ${name}`
    }

    const addDashes = pipe(f1, f2, f3)
    assert.strictEqual(addDashes('Alice'), 'f3 f2 f1 Alice')

    const add3 = (num) => {
      return num + 3
    }

    const mul6 = (num) => {
      return num * 6
    }

    const div2 = (num) => {
      return num / 2
    }

    const sub5 = (num) => {
      return num - 5
    }

    const calculate = pipe(add3, mul6, div2, sub5)
    assert.strictEqual(calculate(5), 19)
  })

  it('pipes two functions', () => {
    const add1 = x => x + 1
    const mul2 = x => x * 2
    const fn = pipe(add1, mul2)
    assert.strictEqual(fn(5), 12)  // (5+1)*2 = 12
  })

  it('pipes single function (identity)', () => {
    const identity = x => x
    const fn = pipe(identity)
    assert.strictEqual(fn(42), 42)
  })

  it('works with string transformations', () => {
    const uppercase = s => s.toUpperCase()
    const exclaim = s => s + '!'
    const shout = pipe(uppercase, exclaim)
    assert.strictEqual(shout('hello'), 'HELLO!')
  })

  it('pipe is compose in reverse order', () => {
    const add1 = x => x + 1
    const mul2 = x => x * 2
    const pipeResult = pipe(add1, mul2)(5)
    const composeResult = compose(mul2, add1)(5)
    assert.strictEqual(pipeResult, composeResult)
  })
})

describe('fp - integration', () => {
  it('combines curry with pipe', () => {
    const add = curry((a, b) => a + b)
    const multiply = curry((a, b) => a * b)
    
    const add5 = add(5)
    const double = multiply(2)
    
    const process = pipe(add5, double)
    assert.strictEqual(process(10), 30)  // (10+5)*2 = 30
  })

  it('combines curry with compose', () => {
    const add = curry((a, b) => a + b)
    
    const add10 = add(10)
    const add5 = add(5)
    
    const process = compose(add10, add5)
    assert.strictEqual(process(5), 20)  // 5+5=10, 10+10=20
  })

  it('creates complex pipeline', () => {
    const words = 'hello world this is a test'
    
    const process = pipe(
      text => text.split(' '),
      arr => arr.filter(w => w.length > 3),
      arr => arr.map(w => w.toUpperCase()),
      arr => arr.join('-')
    )
    
    assert.strictEqual(process(words), 'HELLO-WORLD-THIS-TEST')
  })
})
