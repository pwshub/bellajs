import { hasProperty, isString } from './detection.js'
import { randomInt } from './random.js'

const fnSort = (a, b) => {
  return a > b ? 1 : (a < b ? -1 : 0)
}

/**
 * Removes duplicate elements from an array.
 *
 * @param {Array} [arr=[]] - The array to deduplicate.
 * @returns {Array} A new array with only unique elements.
 *
 * @example
 * unique([1, 2, 2, 3, 3, 4]) // [1, 2, 3, 4]
 */
export const unique = (arr = []) => {
  return [...new Set(arr)]
}

/**
 * Sorts an array and returns a new sorted array (does not modify the original).
 *
 * @param {Array} [arr=[]] - The array to sort.
 * @param {Function} [sorting=null] - Optional custom compare function. If not provided, default sorting is used.
 * @returns {Array} A new sorted array.
 *
 * @example
 * sort([3, 1, 4, 1, 5]) // [1, 1, 3, 4, 5]
 * sort([3, 1, 4], (a, b) => b - a) // [4, 3, 1]
 */
export const sort = (arr = [], sorting = null) => {
  const tmp = [...arr]
  const fn = sorting || fnSort
  tmp.sort(fn)
  return tmp
}

/**
 * Sorts an array of objects by a specified property.
 *
 * @param {Array} [arr=[]] - The array of objects to sort.
 * @param {number} [order=1] - Sort order: 1 for ascending, -1 for descending.
 * @param {string} [key=''] - The property name to sort by.
 * @returns {Array} A new sorted array, or the original array if key is invalid.
 *
 * @example
 * sortBy([{ age: 3 }, { age: 1 }, { age: 2 }], 1, 'age')
 * // [{ age: 1 }, { age: 2 }, { age: 3 }]
 */
export const sortBy = (arr = [], order = 1, key = '') => {
  if (!isString(key) || arr.length === 0 || !hasProperty(arr[0], key)) {
    return arr
  }
  return sort(arr, (m, n) => {
    return m[key] > n[key] ? order : (m[key] < n[key] ? (-1 * order) : 0)
  })
}

/**
 * Randomly shuffles the elements of an array using Fisher-Yates algorithm.
 *
 * @param {Array} [arr=[]] - The array to shuffle.
 * @returns {Array} A new array with elements in random order.
 *
 * @example
 * shuffle([1, 2, 3, 4, 5]) // e.g., [3, 1, 5, 2, 4]
 */
export const shuffle = (arr = []) => {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = randomInt(i)
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * Randomly picks N elements from an array.
 *
 * @param {Array} [arr=[]] - The array to pick elements from.
 * @param {number} [count=1] - The number of elements to pick.
 * @returns {Array} An array containing the picked elements.
 *
 * @example
 * pick([1, 2, 3, 4, 5], 2) // e.g., [3, 5]
 * pick([1, 2, 3], 5) // e.g., [2, 1, 3] (all elements if count > length)
 */
export const pick = (arr = [], count = 1) => {
  const a = shuffle(arr)
  const c = Math.max(0, Math.min(count, a.length))
  return a.slice(0, c)
}

/**
 * Splits an array into chunks of specified size.
 *
 * @param {Array} [arr=[]] - The array to chunk.
 * @param {number} [size=1] - The size of each chunk.
 * @returns {Array} An array of chunks.
 *
 * @example
 * chunk([1, 2, 3, 4, 5], 2) // [[1, 2], [3, 4], [5]]
 * chunk([1, 2, 3], 5) // [[1, 2, 3]]
 */
export const chunk = (arr = [], size = 1) => {
  const result = []
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size))
  }
  return result
}

/**
 * Flattens a nested array to specified depth.
 *
 * @param {Array} [arr=[]] - The array to flatten.
 * @param {number} [depth=1] - The depth to flatten.
 * @returns {Array} A new flattened array.
 *
 * @example
 * flatten([1, [2, [3, 4]]]) // [1, 2, [3, 4]]
 * flatten([1, [2, [3, 4]]], 2) // [1, 2, 3, 4]
 */
export const flatten = (arr = [], depth = 1) => {
  const result = []
  for (const item of arr) {
    if (Array.isArray(item) && depth > 0) {
      result.push(...flatten(item, depth - 1))
    } else {
      result.push(item)
    }
  }
  return result
}

/**
 * Groups array elements by a specified key or function.
 *
 * @param {Array} [arr=[]] - The array to group.
 * @param {string|Function} key - The property name or function to group by.
 * @returns {Object} An object with grouped elements.
 *
 * @example
 * groupBy([{ role: 'admin' }, { role: 'user' }], 'role')
 * // { admin: [{ role: 'admin' }], user: [{ role: 'user' }] }
 */
export const groupBy = (arr = [], key) => {
  return arr.reduce((acc, item) => {
    const groupKey = typeof key === 'function' ? key(item) : item[key]
    if (!acc[groupKey]) {
      acc[groupKey] = []
    }
    acc[groupKey].push(item)
    return acc
  }, {})
}

/**
 * Gets the first n elements of an array.
 *
 * @param {Array} [arr=[]] - The array to query.
 * @param {number} [n=1] - The number of elements to take.
 * @returns {Array} A new array with the first n elements.
 *
 * @example
 * first([1, 2, 3, 4, 5], 2) // [1, 2]
 * first([1, 2, 3]) // [1]
 */
export const first = (arr = [], n = 1) => {
  return arr.slice(0, n)
}

/**
 * Gets the last n elements of an array.
 *
 * @param {Array} [arr=[]] - The array to query.
 * @param {number} [n=1] - The number of elements to take.
 * @returns {Array} A new array with the last n elements.
 *
 * @example
 * last([1, 2, 3, 4, 5], 2) // [4, 5]
 * last([1, 2, 3]) // [3]
 */
export const last = (arr = [], n = 1) => {
  return arr.slice(-n)
}

/**
 * Removes all falsy values from an array.
 *
 * @param {Array} [arr=[]] - The array to compact.
 * @returns {Array} A new array with truthy values only.
 *
 * @example
 * compact([0, 1, false, 2, '', 3, null, undefined]) // [1, 2, 3]
 */
export const compact = (arr = []) => {
  return arr.filter(Boolean)
}

/**
 * Gets elements that are in the first array but not in the second.
 *
 * @param {Array} [arr1=[]] - The first array.
 * @param {Array} [arr2=[]] - The second array.
 * @returns {Array} Elements present in arr1 but not in arr2.
 *
 * @example
 * difference([1, 2, 3, 4], [2, 3]) // [1, 4]
 */
export const difference = (arr1 = [], arr2 = []) => {
  const set2 = new Set(arr2)
  return arr1.filter(item => !set2.has(item))
}

/**
 * Gets elements that are present in both arrays.
 *
 * @param {Array} [arr1=[]] - The first array.
 * @param {Array} [arr2=[]] - The second array.
 * @returns {Array} Elements present in both arrays.
 *
 * @example
 * intersection([1, 2, 3], [2, 3, 4]) // [2, 3]
 */
export const intersection = (arr1 = [], arr2 = []) => {
  const set2 = new Set(arr2)
  return arr1.filter(item => set2.has(item))
}

/**
 * Combines two arrays into pairs.
 *
 * @param {Array} [arr1=[]] - The first array.
 * @param {Array} [arr2=[]] - The second array.
 * @returns {Array} An array of paired elements.
 *
 * @example
 * zip([1, 2, 3], ['a', 'b', 'c']) // [[1, 'a'], [2, 'b'], [3, 'c']]
 * zip([1, 2], ['a', 'b', 'c']) // [[1, 'a'], [2, 'b']]
 */
export const zip = (arr1 = [], arr2 = []) => {
  const length = Math.min(arr1.length, arr2.length)
  const result = []
  for (let i = 0; i < length; i++) {
    result.push([arr1[i], arr2[i]])
  }
  return result
}
