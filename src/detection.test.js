import { describe, it } from 'node:test'
import assert from 'node:assert'

import {
  hasProperty,
  isArray,
  isBoolean,
  isDate,
  isEmail,
  isEmpty,
  isFunction,
  isInteger,
  isNil,
  isNull,
  isNumber,
  isObject,
  isString,
  isUndefined,
  isValidUrl,
  isAbsoluteUrl,
} from '../src/detection.js'

describe('detection', () => {
  describe('isNumber', () => {
    it('test .isNumber() with positives', () => {
      const positives = [1, 1.5, 0, 9999, -2]
      for (const val of positives) {
        assert.strictEqual(isNumber(val), true)
      }
    })

    it('test .isNumber() with negatives', () => {
      const negatives = [{}, [], '', null, undefined]
      for (const val of negatives) {
        assert.strictEqual(isNumber(val), false)
      }
    })
  })

  describe('isInteger', () => {
    it('test .isInteger() with positives', () => {
      const positives = [1, 1000, 9999, 0, -3]
      for (const val of positives) {
        assert.strictEqual(isInteger(val), true)
      }
    })

    it('test .isInteger() with negatives', () => {
      const negatives = [1.5, -3.2, '', undefined]
      for (const val of negatives) {
        assert.strictEqual(isInteger(val), false)
      }
    })
  })

  describe('isArray', () => {
    it('test .isArray() with positives', () => {
      const positives = [[], [1, 2, 3], Array.from(new Set())]
      for (const val of positives) {
        assert.strictEqual(isArray(val), true)
      }
    })

    it('test .isArray() with negatives', () => {
      const negatives = [1.5, '', undefined]
      for (const val of negatives) {
        assert.strictEqual(isArray(val), false)
      }
    })
  })

  describe('isString', () => {
    it('test .isString() with positives', () => {
      const positives = ['', 'abc xyz', '10000']
      for (const val of positives) {
        assert.strictEqual(isString(val), true)
      }
    })

    it('test .isString() with negatives', () => {
      const negatives = [{}, [], 30, 1.5, null, undefined]
      for (const val of negatives) {
        assert.strictEqual(isString(val), false)
      }
    })
  })

  describe('isBoolean', () => {
    it('test .isBoolean() with positives', () => {
      const positives = [true, false]
      for (const val of positives) {
        assert.strictEqual(isBoolean(val), true)
      }
    })

    it('test .isBoolean() with negatives', () => {
      const negatives = [{}, [], '', 1, 0, null, undefined]
      for (const val of negatives) {
        assert.strictEqual(isBoolean(val), false)
      }
    })
  })

  describe('isNull', () => {
    it('test .isNull() with positives', () => {
      const positives = [null]
      for (const val of positives) {
        assert.strictEqual(isNull(val), true)
      }
    })

    it('test .isNull() with negatives', () => {
      const negatives = [{}, [], '', 0, undefined]
      for (const val of negatives) {
        assert.strictEqual(isNull(val), false)
      }
    })
  })

  describe('isUndefined', () => {
    it('test .isUndefined() with positives', () => {
      assert.strictEqual(isUndefined(undefined), true)
      assert.strictEqual(isUndefined(), true)
    })

    it('test .isUndefined() with negatives', () => {
      const negatives = [{}, [], '', 0, null]
      for (const val of negatives) {
        assert.strictEqual(isUndefined(val), false)
      }
    })
  })

  describe('isNil', () => {
    it('test .isNil() with positives', () => {
      assert.strictEqual(isNil(undefined), true)
      assert.strictEqual(isNil(null), true)
    })

    it('test .isNil() with negatives', () => {
      const negatives = [{}, [], '', 0]
      for (const val of negatives) {
        assert.strictEqual(isNil(val), false)
      }
    })
  })

  describe('isFunction', () => {
    it('test .isFunction() with positives', () => {
      const positives = [function () {}, () => {}]
      for (const val of positives) {
        assert.strictEqual(isFunction(val), true)
      }
    })

    it('test .isFunction() with negatives', () => {
      const negatives = [{}, [], '', 0, null]
      for (const val of negatives) {
        assert.strictEqual(isFunction(val), false)
      }
    })
  })

  describe('isObject', () => {
    it('test .isObject() with positives', () => {
      const ob = new Object()
      const positives = [{}, ob, Object.create({})]
      for (const val of positives) {
        assert.strictEqual(isObject(val), true)
      }
    })

    it('test .isObject() with negatives', () => {
      const negatives = [17, [], '', 0, null, () => {}, true]
      for (const val of negatives) {
        assert.strictEqual(isObject(val), false)
      }
    })
  })

  describe('isDate', () => {
    it('test .isDate() with positives', () => {
      const dt = new Date()
      const positives = [dt]
      for (const val of positives) {
        assert.strictEqual(isDate(val), true)
      }
    })

    it('test .isDate() with negatives', () => {
      const negatives = [17, [], '', 0, null, () => {}, true, {}, new Date().toUTCString()]
      for (const val of negatives) {
        assert.strictEqual(isDate(val), false)
      }
    })
  })

  describe('isEmail', () => {
    it('test .isEmail() with positives', () => {
      const positives = ['admin@pwshub.com', 'abc@qtest.com']
      for (const val of positives) {
        assert.strictEqual(isEmail(val), true)
      }
    })

    it('test .isEmail() with negatives', () => {
      const negatives = [{}, [], '', 0, undefined, 'a23b@qtest@com']
      for (const val of negatives) {
        assert.strictEqual(isEmail(val), false)
      }
    })
  })

  describe('isEmpty', () => {
    it('test .isEmpty() with positives', () => {
      const positives = ['', 0, {}, [], undefined, null]
      for (const val of positives) {
        assert.strictEqual(isEmpty(val), true)
      }
    })

    it('test .isEmpty() with negatives', () => {
      const negatives = [{ a: 1 }, '12', 9, [7, 1]]
      for (const val of negatives) {
        assert.strictEqual(isEmpty(val), false)
      }
    })
  })

  describe('hasProperty', () => {
    it('test .hasProperty() with positives', () => {
      const obj = {
        name: 'alice',
        age: 17,
      }
      const positives = ['name', 'age']
      for (const val of positives) {
        assert.strictEqual(hasProperty(obj, val), true)
      }
    })

    it('test .hasProperty() with negatives', () => {
      const obj = {
        name: 'alice',
        age: 17,
      }
      const negatives = ['email', '__proto__']
      for (const val of negatives) {
        assert.strictEqual(hasProperty(obj, val), false)
      }
    })
  })

  describe('isValidUrl', () => {
    it('test .isValidUrl() with valid HTTP/HTTPS URLs', () => {
      const validUrls = [
        'https://example.com',
        'http://example.com',
        'https://example.com/path?query=1',
        'http://localhost:3000',
        'https://sub.example.com/path',
      ]
      for (const url of validUrls) {
        assert.strictEqual(isValidUrl(url), true)
      }
    })

    it('test .isValidUrl() with invalid URLs', () => {
      const invalidUrls = [
        'ftp://example.com',
        'not-a-url',
        '',
        'javascript:alert(1)',
        'mailto:test@example.com',
        undefined,
        {},
        [],
      ]
      for (const url of invalidUrls) {
        assert.strictEqual(isValidUrl(url), false)
      }
    })
  })

  describe('isAbsoluteUrl', () => {
    it('test .isAbsoluteUrl() with absolute URLs', () => {
      const absoluteUrls = [
        'https://example.com',
        'http://example.com',
        '//example.com/path',
        '//cdn.example.com/lib.js',
      ]
      for (const url of absoluteUrls) {
        assert.strictEqual(isAbsoluteUrl(url), true)
      }
    })

    it('test .isAbsoluteUrl() with relative URLs', () => {
      const relativeUrls = [
        '/path/to/resource',
        'relative/path',
        '../parent/path',
        'path/to/file',
        '',
        'ftp://example.com',
      ]
      for (const url of relativeUrls) {
        assert.strictEqual(isAbsoluteUrl(url), false)
      }
    })
  })
})
