import { hasProperty, isArray, isObject } from './detection.js'

/**
 * Creates a deep copy of a value using structuredClone.
 * Handles objects, arrays, Date objects, and circular references.
 *
 * @param {*} val - The value to clone.
 * @returns {*} A deep copy of the input value.
 *
 * @example
 * clone({ a: 1, b: { c: 2 } }) // { a: 1, b: { c: 2 } }
 * clone([1, [2, [3]]]) // [1, [2, [3]]]
 * clone(new Date()) // new Date() with same value
 */
export const clone = (val) => {
  return structuredClone(val)
}

/**
 * Copies properties from a source object to a destination object.
 * Nested objects and arrays are deep copied.
 *
 * @param {Object} source - The source object to copy properties from.
 * @param {Object} dest - The destination object to copy properties to.
 * @param {boolean} [matched=false] - If true, only copy properties that already exist in dest.
 * @param {string[]} [excepts=[]] - Property names to exclude from copying.
 * @returns {Object} The modified destination object.
 *
 * @example
 * copies({ a: 1, b: 2 }, { a: 10 }) // { a: 1, b: 2 }
 * copies({ a: 1, b: 2 }, { a: 10 }, true) // { a: 1 } (only matching)
 * copies({ a: 1, b: 2 }, {}, false, ['b']) // { a: 1 } (except b)
 */
export const copies = (source, dest, matched = false, excepts = []) => {
  for (const k of Object.keys(source)) {
    if (excepts.length > 0 && excepts.includes(k)) {
      continue
    }
    if (!matched || (matched && hasProperty(dest, k))) {
      const oa = source[k]
      const ob = dest[k]
      if ((isObject(ob) && isObject(oa)) || (isArray(ob) && isArray(oa))) {
        dest[k] = copies(oa, dest[k], matched, excepts)
      } else {
        dest[k] = clone(oa)
      }
    }
  }
  return dest
}
