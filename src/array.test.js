import { describe, it } from 'node:test'
import assert from 'node:assert'

import {
  unique,
  sort,
  sortBy,
  shuffle,
  pick,
  chunk,
  flatten,
  groupBy,
  first,
  last,
  compact,
  difference,
  intersection,
  zip,
} from '../src/array.js'

describe('array - unique', () => {
  it('removes duplicates from array', () => {
    const result = unique([1, 2, 2, 3, 3, 4])
    assert.deepStrictEqual(result, [1, 2, 3, 4])
  })

  it('handles empty array', () => {
    const result = unique([])
    assert.deepStrictEqual(result, [])
  })

  it('handles array with all same elements', () => {
    const result = unique([5, 5, 5, 5])
    assert.deepStrictEqual(result, [5])
  })
})

describe('array - sort', () => {
  it('sorts numbers ascending', () => {
    const result = sort([3, 1, 4, 1, 5])
    assert.deepStrictEqual(result, [1, 1, 3, 4, 5])
  })

  it('sorts strings alphabetically', () => {
    const result = sort(['banana', 'apple', 'cherry'])
    assert.deepStrictEqual(result, ['apple', 'banana', 'cherry'])
  })

  it('sorts with custom function (descending)', () => {
    const result = sort([3, 1, 4], (a, b) => b - a)
    assert.deepStrictEqual(result, [4, 3, 1])
  })

  it('does not modify original array', () => {
    const original = [3, 1, 2]
    sort(original)
    assert.deepStrictEqual(original, [3, 1, 2])
  })

  it('handles empty array', () => {
    const result = sort([])
    assert.deepStrictEqual(result, [])
  })
})

describe('array - sortBy', () => {
  it('sorts objects by property ascending', () => {
    const arr = [{ age: 3 }, { age: 1 }, { age: 2 }]
    const result = sortBy(arr, 1, 'age')
    assert.deepStrictEqual(result, [{ age: 1 }, { age: 2 }, { age: 3 }])
  })

  it('sorts objects by property descending', () => {
    const arr = [{ age: 3 }, { age: 1 }, { age: 2 }]
    const result = sortBy(arr, -1, 'age')
    assert.deepStrictEqual(result, [{ age: 3 }, { age: 2 }, { age: 1 }])
  })

  it('returns original array for empty array', () => {
    const result = sortBy([], 1, 'age')
    assert.deepStrictEqual(result, [])
  })

  it('returns original array for invalid key', () => {
    const arr = [{ age: 3 }, { age: 1 }]
    const result = sortBy(arr, 1, 'name')
    assert.deepStrictEqual(result, arr)
  })

  it('does not modify original array', () => {
    const original = [{ age: 3 }, { age: 1 }]
    sortBy(original, 1, 'age')
    assert.deepStrictEqual(original, [{ age: 3 }, { age: 1 }])
  })
})

describe('array - shuffle', () => {
  it('returns array with same elements', () => {
    const original = [1, 2, 3, 4, 5]
    const result = shuffle(original)
    assert.strictEqual(result.length, original.length)
    assert.deepStrictEqual(result.sort((a, b) => a - b), original)
  })

  it('does not modify original array', () => {
    const original = [1, 2, 3]
    shuffle(original)
    assert.deepStrictEqual(original, [1, 2, 3])
  })

  it('handles empty array', () => {
    const result = shuffle([])
    assert.deepStrictEqual(result, [])
  })

  it('handles single element array', () => {
    const result = shuffle([42])
    assert.deepStrictEqual(result, [42])
  })
})

describe('array - pick', () => {
  it('picks specified number of elements', () => {
    const result = pick([1, 2, 3, 4, 5], 2)
    assert.strictEqual(result.length, 2)
  })

  it('picks all elements when count > length', () => {
    const result = pick([1, 2, 3], 5)
    assert.strictEqual(result.length, 3)
  })

  it('picks one element by default', () => {
    const result = pick([1, 2, 3])
    assert.strictEqual(result.length, 1)
  })

  it('returns empty array for count 0', () => {
    const result = pick([1, 2, 3], 0)
    assert.deepStrictEqual(result, [])
  })

  it('handles empty array', () => {
    const result = pick([], 3)
    assert.deepStrictEqual(result, [])
  })

  it('does not modify original array', () => {
    const original = [1, 2, 3]
    pick(original, 2)
    assert.deepStrictEqual(original, [1, 2, 3])
  })
})

describe('array - chunk', () => {
  it('splits array into chunks of specified size', () => {
    const result = chunk([1, 2, 3, 4, 5], 2)
    assert.deepStrictEqual(result, [[1, 2], [3, 4], [5]])
  })

  it('handles exact division', () => {
    const result = chunk([1, 2, 3, 4], 2)
    assert.deepStrictEqual(result, [[1, 2], [3, 4]])
  })

  it('handles chunk size larger than array', () => {
    const result = chunk([1, 2, 3], 5)
    assert.deepStrictEqual(result, [[1, 2, 3]])
  })

  it('handles empty array', () => {
    const result = chunk([], 3)
    assert.deepStrictEqual(result, [])
  })

  it('handles chunk size of 1', () => {
    const result = chunk([1, 2, 3], 1)
    assert.deepStrictEqual(result, [[1], [2], [3]])
  })
})

describe('array - flatten', () => {
  it('flattens nested array to depth 1', () => {
    const result = flatten([1, [2, [3, 4]]])
    assert.deepStrictEqual(result, [1, 2, [3, 4]])
  })

  it('flattens to specified depth', () => {
    const result = flatten([1, [2, [3, 4]]], 2)
    assert.deepStrictEqual(result, [1, 2, 3, 4])
  })

  it('flattens completely with sufficient depth', () => {
    const result = flatten([1, [2, [3, [4]]]], 3)
    assert.deepStrictEqual(result, [1, 2, 3, 4])
  })

  it('handles flat array', () => {
    const result = flatten([1, 2, 3])
    assert.deepStrictEqual(result, [1, 2, 3])
  })

  it('handles empty array', () => {
    const result = flatten([])
    assert.deepStrictEqual(result, [])
  })
})

describe('array - groupBy', () => {
  it('groups by property name', () => {
    const arr = [
      { role: 'admin', name: 'Alice' },
      { role: 'user', name: 'Bob' },
      { role: 'admin', name: 'Charlie' },
    ]
    const result = groupBy(arr, 'role')
    assert.strictEqual(result.admin.length, 2)
    assert.strictEqual(result.user.length, 1)
  })

  it('groups by function', () => {
    const arr = [1, 2, 3, 4, 5, 6]
    const result = groupBy(arr, n => n % 2 === 0 ? 'even' : 'odd')
    assert.deepStrictEqual(result.even, [2, 4, 6])
    assert.deepStrictEqual(result.odd, [1, 3, 5])
  })

  it('handles empty array', () => {
    const result = groupBy([], 'role')
    assert.deepStrictEqual(result, {})
  })
})

describe('array - first', () => {
  it('gets first n elements', () => {
    const result = first([1, 2, 3, 4, 5], 2)
    assert.deepStrictEqual(result, [1, 2])
  })

  it('gets first element by default', () => {
    const result = first([1, 2, 3])
    assert.deepStrictEqual(result, [1])
  })

  it('handles n larger than array length', () => {
    const result = first([1, 2, 3], 10)
    assert.deepStrictEqual(result, [1, 2, 3])
  })

  it('handles empty array', () => {
    const result = first([], 3)
    assert.deepStrictEqual(result, [])
  })
})

describe('array - last', () => {
  it('gets last n elements', () => {
    const result = last([1, 2, 3, 4, 5], 2)
    assert.deepStrictEqual(result, [4, 5])
  })

  it('gets last element by default', () => {
    const result = last([1, 2, 3])
    assert.deepStrictEqual(result, [3])
  })

  it('handles n larger than array length', () => {
    const result = last([1, 2, 3], 10)
    assert.deepStrictEqual(result, [1, 2, 3])
  })

  it('handles empty array', () => {
    const result = last([], 3)
    assert.deepStrictEqual(result, [])
  })
})

describe('array - compact', () => {
  it('removes falsy values', () => {
    const result = compact([0, 1, false, 2, '', 3, null, undefined])
    assert.deepStrictEqual(result, [1, 2, 3])
  })

  it('keeps truthy values', () => {
    const result = compact([1, 'hello', {}, []])
    assert.deepStrictEqual(result, [1, 'hello', {}, []])
  })

  it('handles all falsy array', () => {
    const result = compact([0, false, null, undefined, ''])
    assert.deepStrictEqual(result, [])
  })

  it('handles empty array', () => {
    const result = compact([])
    assert.deepStrictEqual(result, [])
  })
})

describe('array - difference', () => {
  it('gets elements in first array but not in second', () => {
    const result = difference([1, 2, 3, 4], [2, 3])
    assert.deepStrictEqual(result, [1, 4])
  })

  it('handles no difference', () => {
    const result = difference([1, 2, 3], [1, 2, 3])
    assert.deepStrictEqual(result, [])
  })

  it('handles completely different arrays', () => {
    const result = difference([1, 2, 3], [4, 5, 6])
    assert.deepStrictEqual(result, [1, 2, 3])
  })

  it('handles empty second array', () => {
    const result = difference([1, 2, 3], [])
    assert.deepStrictEqual(result, [1, 2, 3])
  })

  it('handles empty first array', () => {
    const result = difference([], [1, 2, 3])
    assert.deepStrictEqual(result, [])
  })
})

describe('array - intersection', () => {
  it('gets elements present in both arrays', () => {
    const result = intersection([1, 2, 3], [2, 3, 4])
    assert.deepStrictEqual(result, [2, 3])
  })

  it('handles no common elements', () => {
    const result = intersection([1, 2, 3], [4, 5, 6])
    assert.deepStrictEqual(result, [])
  })

  it('handles identical arrays', () => {
    const result = intersection([1, 2, 3], [1, 2, 3])
    assert.deepStrictEqual(result, [1, 2, 3])
  })

  it('handles empty arrays', () => {
    const result = intersection([], [1, 2, 3])
    assert.deepStrictEqual(result, [])
  })
})

describe('array - zip', () => {
  it('combines two arrays into pairs', () => {
    const result = zip([1, 2, 3], ['a', 'b', 'c'])
    assert.deepStrictEqual(result, [[1, 'a'], [2, 'b'], [3, 'c']])
  })

  it('handles arrays of different lengths', () => {
    const result = zip([1, 2], ['a', 'b', 'c'])
    assert.deepStrictEqual(result, [[1, 'a'], [2, 'b']])
  })

  it('handles empty arrays', () => {
    const result = zip([], [1, 2, 3])
    assert.deepStrictEqual(result, [])
  })
})
