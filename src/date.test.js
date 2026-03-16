import { describe, it } from 'node:test'
import assert from 'node:assert'

import {
  getTime,
  getIsoDateTime,
  formatDateISO,
  formatDate,
  sec2dur,
  getDuration,
  formatRelativeTime,
} from '../src/date.js'

describe('date - getTime', () => {
  it('check .getTime() returns current timestamp', () => {
    const result = getTime()
    assert.strictEqual(typeof result, 'number')
    assert.strictEqual(result > 0, true)
  })

  it('check .getTime() with date string', () => {
    const result = getTime('2026-01-01')
    assert.strictEqual(result, new Date('2026-01-01').getTime())
  })

  it('check .getTime() with Date object', () => {
    const d = new Date('2026-06-15')
    const result = getTime(d)
    assert.strictEqual(result, d.getTime())
  })
})

describe('date - getIsoDateTime', () => {
  it('check .getIsoDateTime() returns current ISO string', () => {
    const result = getIsoDateTime()
    assert.strictEqual(typeof result, 'string')
    assert.strictEqual(result.includes('T'), true)
    assert.strictEqual(result.endsWith('Z'), true)
  })

  it('check .getIsoDateTime() with date string', () => {
    const result = getIsoDateTime('2026-01-15')
    assert.strictEqual(result, '2026-01-15T00:00:00.000Z')
  })
})

describe('date - formatDateISO', () => {
  it('check .formatDateISO() returns YYYY-MM-DD format', () => {
    const result = formatDateISO(new Date('2026-01-16'))
    assert.strictEqual(result, '2026-01-16')
  })

  it('check .formatDateISO() with datetime string', () => {
    const result = formatDateISO('2026-01-16T10:30:00')
    assert.strictEqual(result, '2026-01-16')
  })

  it('check .formatDateISO() with timestamp', () => {
    const d = new Date('2026-06-15')
    const result = formatDateISO(d.getTime())
    assert.strictEqual(result, '2026-06-15')
  })
})

describe('date - formatDate', () => {
  it('check .formatDate() with default options', () => {
    const d = new Date()
    const result = formatDate(d)
    const reg = /^\w+\s\d+,\s+\d{4},\s\d+:\d+:\d+\s(AM|PM)+/
    assert.strictEqual(result.match(reg) !== null, true)
  })

  it('check .formatDate() with custom options', () => {
    const d = new Date()
    const result = formatDate(d, 'en', {
      dateStyle: 'full',
      timeStyle: 'medium',
      hour12: true,
    })
    const reg = /^\w+,\s\w+\s\d+,\s+\d{4}\sat\s\d+:\d+:\d+\s(AM|PM)$/
    assert.strictEqual(result.match(reg) !== null, true)
  })

  it('check .formatDate() with Vietnamese locale', () => {
    const d = new Date()
    const result = formatDate(d, 'vi')
    assert.strictEqual(typeof result, 'string')
    assert.strictEqual(result.length > 0, true)
  })

  it('check .formatDate() with invalid date', () => {
    assert.throws(() => {
      formatDate({})
    }, /InvalidInput/)
  })
})

describe('date - sec2dur', () => {
  it('check .sec2dur() with 3661 seconds', () => {
    const result = sec2dur(3661)
    assert.strictEqual(result, '01:01:01')
  })

  it('check .sec2dur() with 90 seconds', () => {
    const result = sec2dur(90)
    assert.strictEqual(result, '00:01:30')
  })

  it('check .sec2dur() with 5 seconds', () => {
    const result = sec2dur(5)
    assert.strictEqual(result, '00:00:05')
  })

  it('check .sec2dur() with 0 seconds', () => {
    const result = sec2dur(0)
    assert.strictEqual(result, '00:00:00')
  })

  it('check .sec2dur() with 25 hours', () => {
    const result = sec2dur(25 * 3600)
    assert.strictEqual(result, '25:00:00')
  })
})

describe('date - getDuration', () => {
  it('check .getDuration() returns duration from begin to now', () => {
    const start = Date.now() - 5000
    const result = getDuration(start)
    assert.strictEqual(result.length, 8) // HH:MM:SS format
    assert.strictEqual(result.includes(':'), true)
  })

  it('check .getDuration() with explicit end time', () => {
    const start = 0
    const end = 3661000
    const result = getDuration(start, end)
    assert.strictEqual(result, '01:01:01')
  })
})

describe('date - formatRelativeTime', () => {
  it('check .formatRelativeTime() returns "just now" for current time', () => {
    const result = formatRelativeTime(new Date())
    assert.strictEqual(result, 'just now')
  })

  it('check .formatRelativeTime() after 5 seconds', () => {
    const fiveSecondsAgo = new Date(Date.now() - 5000)
    const result = formatRelativeTime(fiveSecondsAgo)
    assert.strictEqual(result, '5 seconds ago')
  })

  it('check .formatRelativeTime() after 5 minutes', () => {
    const fiveMinutesAgo = new Date(Date.now() - 6e4 * 5)
    const result = formatRelativeTime(fiveMinutesAgo)
    assert.strictEqual(result, '5 minutes ago')
  })

  it('check .formatRelativeTime() after 5 hours', () => {
    const fiveHoursAgo = new Date(Date.now() - 6e4 * 60 * 5)
    const result = formatRelativeTime(fiveHoursAgo)
    assert.strictEqual(result, '5 hours ago')
  })

  it('check .formatRelativeTime() after 5 days', () => {
    const fiveDaysAgo = new Date(Date.now() - 6e4 * 60 * 24 * 5)
    const result = formatRelativeTime(fiveDaysAgo)
    assert.strictEqual(result, '5 days ago')
  })

  it('check .formatRelativeTime() with Vietnamese locale', () => {
    const fiveMinutesAgo = new Date(Date.now() - 6e4 * 5)
    const result = formatRelativeTime(fiveMinutesAgo, 'vi')
    assert.strictEqual(result.includes('phút'), true)
  })

  it('check .formatRelativeTime() with invalid date', () => {
    assert.throws(() => {
      formatRelativeTime({})
    }, /InvalidInput/)
  })
})
