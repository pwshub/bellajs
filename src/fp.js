/**
 * Curries a function, allowing it to be called with partial arguments.
 * The curried function can be invoked with one or more arguments at a time.
 *
 * @param {Function} fn - The function to curry.
 * @returns {Function} A new curried function.
 *
 * @example
 * const sum = curry((a, b, c) => a + b + c)
 * sum(3)(2)(1)  // 6
 * sum(1)(2, 3)  // 6
 * sum(1, 2, 3)  // 6
 */
export const curry = (fn) => {
  const totalArguments = fn.length

  const next = (argumentLength, rest) => {
    if (argumentLength > 0) {
      return (...args) => {
        return next(argumentLength - args.length, [...rest, ...args])
      }
    }
    return fn(...rest)
  }

  return next(totalArguments, [])
}

/**
 * Performs right-to-left function composition.
 * The result of each function is passed as the argument to the next function.
 *
 * @param {...Function} fns - The list of functions to compose.
 * @returns {Function} A new function representing the composition.
 *
 * @example
 * const add1 = x => x + 1
 * const mul2 = x => x * 2
 * const calculate = compose(mul2, add1)
 * calculate(5)  // 12 (5+1=6, 6*2=12)
 */
export const compose = (...fns) => {
  return fns.reduce((f, g) => (x) => f(g(x)))
}

/**
 * Performs left-to-right function piping.
 * The result of each function is passed as the argument to the next function.
 *
 * @param {...Function} fns - The list of functions to pipe.
 * @returns {Function} A new function representing the pipe.
 *
 * @example
 * const add1 = x => x + 1
 * const mul2 = x => x * 2
 * const calculate = pipe(add1, mul2)
 * calculate(5)  // 12 (5+1=6, 6*2=12)
 */
export const pipe = (...fns) => {
  return fns.reduce((f, g) => (x) => g(f(x)))
}
