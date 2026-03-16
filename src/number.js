/**
 * Converts bytes to a human-readable size string.
 * Automatically selects the appropriate unit (Bytes, KiB, MiB, GiB, etc.).
 *
 * @param {number} bytes - The number of bytes to format.
 * @param {number} [decimals=2] - Number of decimal places.
 * @returns {string} Formatted size string with unit.
 *
 * @example
 * formatBytes(0) // '0 Bytes'
 * formatBytes(1024) // '1 KiB'
 * formatBytes(1536) // '1.5 KiB'
 * formatBytes(1536, 3) // '1.5 KiB'
 * formatBytes(1048576) // '1 MiB'
 * formatBytes(1234567890) // '1.15 GiB'
 */
export const formatBytes = (bytes, decimals = 2) => {
  if (!Number(bytes) || bytes === 0) {
    return '0 Bytes'
  }

  const kbToBytes = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = [
    'Bytes',
    'KiB',
    'MiB',
    'GiB',
    'TiB',
    'PiB',
    'EiB',
    'ZiB',
    'YiB',
  ]

  const index = Math.floor(Math.log(bytes) / Math.log(kbToBytes))

  return `${parseFloat((bytes / Math.pow(kbToBytes, index)).toFixed(dm))} ${sizes[index]}`
}

/**
 * Formats a number as a fixed-point decimal string, typically for financial display.
 *
 * @param {number} [x=0] - The number to format.
 * @param {number} [d=2] - Number of decimal places.
 * @returns {string} Formatted number string with fixed decimal places.
 *
 * @example
 * formatNumber(123) // '123.00'
 * formatNumber(123.456) // '123.46'
 * formatNumber(123.456, 3) // '123.456'
 * formatNumber(1000, 0) // '1000'
 * formatNumber('45.678', 2) // '45.68'
 */
export const formatNumber = (x = 0, d = 2) => {
  return parseFloat(x).toFixed(d)
}
