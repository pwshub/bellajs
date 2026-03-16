# Array Utilities

Array transformation, manipulation, and analysis functions.

## Installation

```bash
npm install @pwshub/bellajs
```

## Usage

```javascript
import { 
  unique,
  chunk,
  groupBy,
  difference
} from '@pwshub/bellajs'
```

## Basic Operations

### `unique(arr)`

Remove duplicate elements from an array.

```javascript
unique([1, 2, 2, 3, 3, 4])
// [1, 2, 3, 4]

unique(['a', 'b', 'a', 'c'])
// ['a', 'b', 'c']
```

### `sort(arr, compareFn)`

Sort array and return new sorted array (doesn't modify original).

```javascript
sort([3, 1, 4, 1, 5])
// [1, 1, 3, 4, 5]

// Custom sort (descending)
sort([3, 1, 4], (a, b) => b - a)
// [4, 3, 1]
```

### `sortBy(arr, order, key)`

Sort array of objects by property.

```javascript
const users = [
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 },
  { name: 'Charlie', age: 35 }
]

sortBy(users, 1, 'age')
// [{ name: 'Bob', age: 25 }, { name: 'Alice', age: 30 }, { name: 'Charlie', age: 35 }]

// Descending
sortBy(users, -1, 'age')
// [{ name: 'Charlie', age: 35 }, { name: 'Alice', age: 30 }, { name: 'Bob', age: 25 }]
```

### `shuffle(arr)`

Randomly shuffle array elements.

```javascript
shuffle([1, 2, 3, 4, 5])
// [3, 1, 5, 2, 4] (random order)
```

### `pick(arr, count)`

Randomly pick N elements from array.

```javascript
pick([1, 2, 3, 4, 5], 2)
// [3, 5] (random 2 elements)

pick(['a', 'b', 'c', 'd'])
// ['b'] (random 1 element by default)
```

## Transformation

### `chunk(arr, size)`

Split array into chunks of specified size.

```javascript
chunk([1, 2, 3, 4, 5], 2)
// [[1, 2], [3, 4], [5]]

chunk([1, 2, 3, 4, 5], 3)
// [[1, 2, 3], [4, 5]]

chunk([1, 2], 5)
// [[1, 2]] (single chunk if size > length)
```

### `flatten(arr, depth)`

Flatten nested arrays to specified depth.

```javascript
flatten([1, [2, [3, 4]]])
// [1, 2, [3, 4]] (depth 1 by default)

flatten([1, [2, [3, [4]]]], 2)
// [1, 2, 3, [4]]

flatten([1, [2, [3, [4]]]], 3)
// [1, 2, 3, 4]
```

### `groupBy(arr, key)`

Group array elements by property or function.

```javascript
const users = [
  { name: 'Alice', role: 'admin' },
  { name: 'Bob', role: 'user' },
  { name: 'Charlie', role: 'admin' }
]

groupBy(users, 'role')
// {
//   admin: [{ name: 'Alice', role: 'admin' }, { name: 'Charlie', role: 'admin' }],
//   user: [{ name: 'Bob', role: 'user' }]
// }

// Group by function
groupBy([1, 2, 3, 4, 5, 6], n => n % 2 === 0 ? 'even' : 'odd')
// { even: [2, 4, 6], odd: [1, 3, 5] }
```

### `first(arr, n)`

Get first N elements.

```javascript
first([1, 2, 3, 4, 5], 2)
// [1, 2]

first([1, 2, 3])
// [1] (1 element by default)
```

### `last(arr, n)`

Get last N elements.

```javascript
last([1, 2, 3, 4, 5], 2)
// [4, 5]

last([1, 2, 3])
// [3] (1 element by default)
```

### `compact(arr)`

Remove all falsy values (false, null, undefined, 0, '', NaN).

```javascript
compact([0, 1, false, 2, '', 3, null, undefined])
// [1, 2, 3]
```

## Set Operations

### `difference(arr1, arr2)`

Get elements in first array but not in second.

```javascript
difference([1, 2, 3, 4], [2, 3])
// [1, 4]

difference(['a', 'b', 'c'], ['b', 'c', 'd'])
// ['a']
```

### `intersection(arr1, arr2)`

Get elements present in both arrays.

```javascript
intersection([1, 2, 3], [2, 3, 4])
// [2, 3]

intersection(['a', 'b'], ['b', 'c'])
// ['b']
```

### `zip(arr1, arr2)`

Combine two arrays into pairs.

```javascript
zip([1, 2, 3], ['a', 'b', 'c'])
// [[1, 'a'], [2, 'b'], [3, 'c']]

zip([1, 2], ['a', 'b', 'c'])
// [[1, 'a'], [2, 'b']] (stops at shorter array)
```

## Examples

### Process API Response

```javascript
import { unique, sortBy, chunk } from '@pwshub/bellajs'

// Remove duplicates, sort, and paginate
const userIds = response.data.map(user => user.id)
const uniqueIds = unique(userIds)
const sorted = sortBy(uniqueIds.map(id => ({ id })), 1, 'id')
const pages = chunk(sorted, 10)  // 10 per page
```

### Group and Transform

```javascript
import { groupBy, compact } from '@pwshub/bellajs'

// Group users by role, filter out empty groups
const grouped = groupBy(users, 'role')
const nonEmptyGroups = Object.entries(grouped)
  .filter(([_, users]) => users.length > 0)
  .map(([role, users]) => ({ role, count: users.length }))
```

### Random Sampling

```javascript
import { shuffle, pick } from '@pwshub/bellajs'

// Pick 5 random winners
const winners = pick(contestants, 5)

// Or shuffle and take top N
const shuffled = shuffle(allEntries)
const sample = shuffled.slice(0, 10)
```

## See Also

- [Object utilities](object.md) - clone, copies
- [Functional utilities](functional.md) - compose, pipe for chaining operations
