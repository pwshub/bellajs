import { isDate } from './detection.js'

const TIME_CONVERSIONS = {
  millisecond: 1,
  second: 1000,
  minute: 60,
  hour: 60,
  day: 24,
  month: 30,
  year: 12
}

/**
 * Get timestamp in milliseconds.
 * Returns current time if no input provided.
 *
 * @param {Date|number|string} [t] - The date to get timestamp from.
 * @returns {number} Timestamp in milliseconds.
 *
 * @example
 * getTime() // 1705395600000 (current time)
 * getTime('2026-01-01') // 1735689600000
 * getTime(new Date()) // 1705395600000
 */
export const getTime = (t) => {
  return t === undefined ? Date.now() : new Date(t).getTime()
}

/**
 * Get ISO 8601 datetime string.
 *
 * @param {Date|number|string} [t] - The date to format.
 * @returns {string} ISO 8601 formatted datetime string.
 *
 * @example
 * getIsoDateTime() // "2026-01-16T10:30:00.000Z"
 * getIsoDateTime('2026-01-01') // "2026-01-01T00:00:00.000Z"
 */
export const getIsoDateTime = (t) => {
  const d = t === undefined ? new Date() : new Date(t)
  return d.toISOString()
}

/**
 * Format date as YYYY-MM-DD string.
 *
 * @param {Date|number|string} date - The date to format.
 * @returns {string} Date in YYYY-MM-DD format.
 *
 * @example
 * formatDateISO(new Date('2026-01-16')) // "2026-01-16"
 * formatDateISO('2026-01-16T10:30:00') // "2026-01-16"
 */
export const formatDateISO = (date) => {
  const d = new Date(date)
  const parts = new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).formatToParts(d)

  const values = parts.map(p => p.value).filter(v => v !== '/')
  return `${values[2]}-${values[0]}-${values[1]}`
}

/**
 * Formats a date using the Intl.DateTimeFormat API for multi-language support.
 *
 * @param {Date|number|string} input - The date to format (Date object, timestamp, or date string).
 * @param {string} [locale='en'] - The locale to use for formatting (e.g., 'en', 'vi', 'zh', 'ja').
 * @param {Intl.DateTimeFormatOptions} [options] - Formatting options. Defaults to medium date + long time.
 * @returns {string} The formatted date string.
 * @throws {Error} If input is not a valid date, number, or Date object.
 *
 * @example
 * // Basic usage
 * formatDate(new Date()) // "Jan 3, 2026, 8:34:28 PM"
 *
 * @example
 * // With locale
 * formatDate(new Date(), 'vi') // "20:34:28, 3 thg 1, 2026"
 *
 * @example
 * // With custom options
 * formatDate(new Date(), 'en', { dateStyle: 'full', timeStyle: 'short' })
 * // "Saturday, January 3, 2026 at 8:34 PM"
 */
export const formatDate = (input, locale = 'en', options) => {
  const date = isDate(input) ? input : new Date(input)
  if (!isDate(date)) {
    throw new Error('InvalidInput: Number or Date required.')
  }

  const defaultOptions = {
    dateStyle: 'medium',
    timeStyle: 'long',
  }

  const formatOptions = options || defaultOptions
  const dtf = new Intl.DateTimeFormat(locale, formatOptions)
  return dtf.format(date)
}

/**
 * Convert seconds to duration string (HH:MM:SS).
 *
 * @param {number} seconds - The number of seconds to convert.
 * @returns {string} Duration string in HH:MM:SS format.
 *
 * @example
 * sec2dur(3661) // "01:01:01"
 * sec2dur(90) // "00:01:30"
 * sec2dur(5) // "00:00:05"
 */
export const sec2dur = (seconds) => {
  const format = (n) => {
    return (~~n).toString().padStart(2, '0')
  }
  return [
    format(seconds / 60 / 60),
    format(seconds / 60 % 60),
    format(seconds % 60),
  ].join(':')
}

/**
 * Get duration string from a start time to now (or end time).
 *
 * @param {number} begin - The start timestamp in milliseconds.
 * @param {number} [end] - The end timestamp in milliseconds (defaults to now).
 * @returns {string} Duration string in HH:MM:SS format.
 *
 * @example
 * const start = Date.now()
 * // ... do something that takes 5 seconds
 * getDuration(start) // "00:00:05"
 */
export const getDuration = (begin, end) => {
  const t = end === undefined ? Date.now() : end
  return sec2dur((t - begin) / 1000)
}

/**
 * Formats a date as a relative time string using the Intl.RelativeTimeFormat API.
 * This provides proper localization for relative times in different languages.
 *
 * @param {Date|number|string} input - The date to format (Date object, timestamp, or date string).
 * @param {string} [locale='en'] - The locale to use for formatting (e.g., 'en', 'vi', 'zh', 'ja').
 * @param {string} [justNowText='just now'] - Custom message for times less than a second ago.
 * @returns {string} A localized relative time string.
 * @throws {Error} If input is not a valid date, number, or Date object.
 *
 * @example
 * // English
 * formatRelativeTime(Date.now() - 5000) // "5 seconds ago"
 *
 * @example
 * // Vietnamese
 * formatRelativeTime(Date.now() - 5000, 'vi') // "5 giây trước"
 *
 * @example
 * // Japanese
 * formatRelativeTime(Date.now() - 5000, 'ja') // "5 秒前"
 */
export const formatRelativeTime = (input, locale = 'en', justNowText = 'just now') => {
  const date = isDate(input) ? input : new Date(input)
  if (!isDate(date)) {
    throw new Error('InvalidInput: Number or Date required.')
  }

  let delta = Date.now() - date.getTime()
  if (delta <= 1000) {
    return justNowText
  }

  let unit = 'second'
  for (const key in TIME_CONVERSIONS) {
    if (delta < TIME_CONVERSIONS[key]) {
      break
    } else {
      unit = key
      delta /= TIME_CONVERSIONS[key]
    }
  }
  delta = Math.floor(delta)

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  return rtf.format(-delta, unit)
}
