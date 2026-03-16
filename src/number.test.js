import { describe, it } from 'node:test'
import assert from 'node:assert'

import { formatBytes, formatNumber } from '../src/number.js'

describe('number - formatBytes', () => {
  it('returns "0 Bytes" for zero', () => {
    assert.strictEqual(formatBytes(0), '0 Bytes')
  })

  it('returns "0 Bytes" for falsy values', () => {
    assert.strictEqual(formatBytes(null), '0 Bytes')
    assert.strictEqual(formatBytes(undefined), '0 Bytes')
    assert.strictEqual(formatBytes(''), '0 Bytes')
  })

  it('formats bytes correctly', () => {
    assert.strictEqual(formatBytes(1), '1 Bytes')
    assert.strictEqual(formatBytes(512), '512 Bytes')
  })

  it('formats KiB correctly', () => {
    assert.strictEqual(formatBytes(1024), '1 KiB')
    assert.strictEqual(formatBytes(1536), '1.5 KiB')
    assert.strictEqual(formatBytes(2048), '2 KiB')
  })

  it('formats MiB correctly', () => {
    assert.strictEqual(formatBytes(1048576), '1 MiB')
    assert.strictEqual(formatBytes(1572864), '1.5 MiB')
  })

  it('formats GiB correctly', () => {
    assert.strictEqual(formatBytes(1073741824), '1 GiB')
    assert.strictEqual(formatBytes(1234567890), '1.15 GiB')
  })

  it('formats TiB correctly', () => {
    assert.strictEqual(formatBytes(1099511627776), '1 TiB')
  })

  it('respects decimal places', () => {
    assert.strictEqual(formatBytes(1536, 0), '2 KiB')
    assert.strictEqual(formatBytes(1536, 1), '1.5 KiB')
    assert.strictEqual(formatBytes(1536, 3), '1.5 KiB')
    assert.strictEqual(formatBytes(1234567890, 4), '1.1498 GiB')
  })

  it('handles negative decimals', () => {
    assert.strictEqual(formatBytes(1536, -1), '2 KiB')
  })
})

describe('number - formatNumber', () => {
  it('formats with default 2 decimal places', () => {
    assert.strictEqual(formatNumber(123), '123.00')
    assert.strictEqual(formatNumber(0), '0.00')
  })

  it('formats with specified decimal places', () => {
    assert.strictEqual(formatNumber(123.456, 0), '123')
    assert.strictEqual(formatNumber(123.456, 1), '123.5')
    assert.strictEqual(formatNumber(123.456, 2), '123.46')
    assert.strictEqual(formatNumber(123.456, 3), '123.456')
  })

  it('handles string input', () => {
    assert.strictEqual(formatNumber('45.678', 2), '45.68')
    assert.strictEqual(formatNumber('100', 2), '100.00')
  })

  it('handles negative numbers', () => {
    assert.strictEqual(formatNumber(-123.456, 2), '-123.46')
  })

  it('handles zero decimals', () => {
    assert.strictEqual(formatNumber(1000, 0), '1000')
    assert.strictEqual(formatNumber(999.99, 0), '1000')
  })

  it('uses default values for undefined params', () => {
    assert.strictEqual(formatNumber(), '0.00')
    assert.strictEqual(formatNumber(100), '100.00')
  })
})
