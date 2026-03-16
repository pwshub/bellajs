/**
 * Check if value is a number.
 *
 * @param {*} val - The value to check.
 * @returns {boolean} True if the value is a number, false otherwise.
 */
export const isNumber = (val) => {
  return Number(val) === val
}

/**
 * Check if value is an integer.
 *
 * @param {*} val - The value to check.
 * @returns {boolean} True if the value is an integer, false otherwise.
 */
export const isInteger = (val) => {
  return Number.isInteger(val)
}

/**
 * Check if value is an array.
 *
 * @param {*} val - The value to check.
 * @returns {boolean} True if the value is an array, false otherwise.
 */
export const isArray = (val) => {
  return Array.isArray(val)
}

/**
 * Check if value is a string.
 *
 * @param {*} val - The value to check.
 * @returns {boolean} True if the value is a string, false otherwise.
 */
export const isString = (val) => {
  return String(val) === val
}

/**
 * Check if value is a boolean.
 *
 * @param {*} val - The value to check.
 * @returns {boolean} True if the value is a boolean, false otherwise.
 */
export const isBoolean = (val) => {
  return Boolean(val) === val
}

/**
 * Check if value is null.
 *
 * @param {*} val - The value to check.
 * @returns {boolean} True if the value is null, false otherwise.
 */
export const isNull = (val) => {
  return val === null
}

/**
 * Check if value is undefined.
 *
 * @param {*} val - The value to check.
 * @returns {boolean} True if the value is undefined, false otherwise.
 */
export const isUndefined = (val) => {
  return val === undefined
}

/**
 * Check if value is null or undefined.
 *
 * @param {*} val - The value to check.
 * @returns {boolean} True if the value is null or undefined, false otherwise.
 */
export const isNil = (val) => {
  return isUndefined(val) || isNull(val)
}

/**
 * Check if value is a function.
 *
 * @param {*} val - The value to check.
 * @returns {boolean} True if the value is a function, false otherwise.
 */
export const isFunction = (val) => {
  return typeof val === 'function'
}

/**
 * Check if value is a plain object (not an array).
 *
 * @param {*} val - The value to check.
 * @returns {boolean} True if the value is a plain object, false otherwise.
 */
export const isObject = (val) => {
  return {}.toString.call(val) === '[object Object]' && !isArray(val)
}

/**
 * Check if value is a valid date.
 *
 * @param {*} val - The value to check.
 * @returns {boolean} True if the value is a valid date, false otherwise.
 */
export const isDate = (val) => {
  return val instanceof Date && !isNaN(val.valueOf())
}

/**
 * Check if value is a valid email address.
 *
 * @param {*} val - The value to check.
 * @returns {boolean} True if the value is a valid email, false otherwise.
 */
export const isEmail = (val) => {
  const re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
  return isString(val) && re.test(val)
}

/**
 * Check if value is empty (null, undefined, empty string, empty array, or empty object).
 *
 * @param {*} val - The value to check.
 * @returns {boolean} True if the value is empty, false otherwise.
 */
export const isEmpty = (val) => {
  return !val || isNil(val) ||
    (isString(val) && val === '') ||
    (isArray(val) && val.length === 0) ||
    (isObject(val) && Object.keys(val).length === 0)
}

/**
 * Check if an object has an own property (not inherited).
 *
 * @param {Object} obj - The object to check.
 * @param {string} prop - The property name to look for.
 * @returns {boolean} True if the object has the property, false otherwise.
 */
export const hasProperty = (obj, prop) => {
  return Object.prototype.hasOwnProperty.call(obj, prop)
}

/**
 * Check if a string is a valid URL with HTTP or HTTPS protocol.
 *
 * @param {string} [url=''] - The URL string to validate.
 * @returns {boolean} True if the URL is valid and uses HTTP/HTTPS protocol, false otherwise.
 *
 * @example
 * isValidUrl('https://example.com') // true
 * isValidUrl('http://example.com') // true
 * isValidUrl('ftp://example.com') // false
 * isValidUrl('not-a-url') // false
 */
export const isValidUrl = (url = '') => {
  try {
    const parsed = new URL(url)
    return parsed !== null && parsed.protocol && (parsed.protocol === 'http:' || parsed.protocol === 'https:')
  } catch {
    return false
  }
}

/**
 * Check if a URL string is absolute (starts with http://, https://, or //).
 *
 * @param {string} [url=''] - The URL string to check.
 * @returns {boolean} True if the URL is absolute, false otherwise.
 *
 * @example
 * isAbsoluteUrl('https://example.com') // true
 * isAbsoluteUrl('http://example.com') // true
 * isAbsoluteUrl('//example.com/path') // true
 * isAbsoluteUrl('/path/to/resource') // false
 * isAbsoluteUrl('relative/path') // false
 */
export const isAbsoluteUrl = (url = '') => {
  const u = String(url)
  return u.startsWith('https://') || u.startsWith('http://') || u.startsWith('//')
}
