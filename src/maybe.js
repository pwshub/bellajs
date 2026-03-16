import { isNil } from './detection.js'

/**
 * Creates a Maybe instance for safe null/undefined handling with method chaining.
 * Maybe is a functional programming pattern for handling optional values without
 * explicit null checks.
 *
 * @param {*} val - The value to wrap in Maybe.
 * @returns {Object} A Maybe instance with chainable methods.
 *
 * @example
 * // Basic usage
 * maybe(5)
 *   .map(x => x + 5)
 *   .map(x => x * 2)
 *   .value() // 20
 *
 * @example
 * // Handle null safely
 * maybe(null)
 *   .map(x => x + 5) // Skipped because value is null
 *   .orElse(() => 0)
 *   .value() // 0
 *
 * @example
 * // Conditional transformation
 * maybe(user)
 *   .filter(u => u.isActive)
 *   .map(u => u.email)
 *   .orElse(() => 'default@example.com')
 *   .value()
 */
export const maybe = (val) => {
  /**
   * Checks if the wrapped value is null or undefined.
   * @returns {boolean} True if value is null or undefined.
   */
  const isNilMethod = () => isNil(val)

  /**
   * Extracts the wrapped value.
   * @returns {*} The wrapped value.
   */
  const value = () => val

  /**
   * Transforms the value using the provided function if not nil.
   * @param {Function} fn - Transformation function.
   * @returns {Object} A new Maybe instance with transformed value.
   *
   * @example
   * maybe(5).map(x => x * 2).value() // 10
   * maybe(null).map(x => x * 2).value() // null
   */
  const map = (fn) => {
    return maybe(isNil(val) ? null : fn(val))
  }

  /**
   * Filters the value based on a predicate. Returns null if predicate is false.
   * @param {Function} fn - Predicate function that returns boolean.
   * @returns {Object} A new Maybe instance (value or null).
   *
   * @example
   * maybe(5).filter(x => x > 3).value() // 5
   * maybe(2).filter(x => x > 3).value() // null
   */
  const filter = (fn) => {
    return maybe(isNil(val) || !fn(val) ? null : val)
  }

  /**
   * Provides a default value if the current value is nil.
   * @param {Function} fn - Function that returns default value.
   * @returns {Object} A new Maybe instance with value or default.
   *
   * @example
   * maybe(null).orElse(() => 0).value() // 0
   * maybe(5).orElse(() => 0).value() // 5
   */
  const orElse = (fn) => {
    return maybe(isNil(val) ? fn() : val)
  }

  /**
   * Performs a side effect if the value is not nil.
   * Useful for logging or debugging without transforming the value.
   * @param {Function} fn - Side effect function.
   * @returns {Object} The same Maybe instance for chaining.
   *
   * @example
   * maybe(5)
   *   .tap(x => console.log('Value:', x))
   *   .map(x => x * 2)
   *   .value()
   */
  const tap = (fn) => {
    if (!isNil(val)) {
      fn(val)
    }
    return maybeInstance
  }

  /**
   * Converts the Maybe to an array.
   * Returns empty array if nil, single-element array if value exists.
   * @returns {Array} Array containing the value or empty array.
   *
   * @example
   * maybe(5).toArray() // [5]
   * maybe(null).toArray() // []
   */
  const toArray = () => {
    return isNil(val) ? [] : [val]
  }

  /**
   * Returns a string representation for debugging.
   * @returns {string} String representation.
   *
   * @example
   * maybe(5).inspect() // 'Maybe(5)'
   * maybe(null).inspect() // 'Maybe(null)'
   */
  const inspect = () => {
    return `Maybe(${isNil(val) ? 'null' : val})`
  }

  const maybeInstance = {
    isNil: isNilMethod,
    value,
    map,
    filter,
    when: filter, // Alias for filter
    orElse,
    getOrElse: orElse, // Alias for orElse
    tap,
    toArray,
    inspect,
  }

  return maybeInstance
}
