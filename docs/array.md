# Array Utilities

Array transformation, manipulation, and analysis functions.

## Installation

```typescript
import { chunk, difference, groupBy, unique } from "jsr:@pwshub/bellajs";
```

## Basic Operations

### `unique(arr)`

Remove duplicate elements from an array.

```typescript
unique([1, 2, 2, 3, 3, 4]); // [1, 2, 3, 4]
```

### `sort(arr, compareFn)`

Sort array and return new sorted array (does not modify original).

```typescript
sort([3, 1, 4, 1, 5]); // [1, 1, 3, 4, 5]
sort([3, 1, 4], (a, b) => b - a); // [4, 3, 1]
```

### `sortBy(arr, order, key)`

Sort array of objects by property.

```typescript
sortBy(users, 1, "age"); // ascending by age
sortBy(users, -1, "age"); // descending by age
```

### `shuffle(arr)`

Randomly shuffle array elements (Fisher-Yates algorithm).

### `pick(arr, count)`

Randomly pick N elements from array (default 1).

## Transformation

### `chunk(arr, size)`

Split array into chunks of specified size.

```typescript
chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]
```

### `flatten(arr, depth)`

Flatten nested arrays to specified depth (default 1).

```typescript
flatten([1, [2, [3, [4]]]]); // [1, 2, [3, [4]]]
flatten([1, [2, [3, [4]]]], 2); // [1, 2, 3, [4]]
```

### `groupBy(arr, key)`

Group array elements by property or function.

### `first(arr, n)` / `last(arr, n)`

Get first/last N elements (default 1).

### `compact(arr)`

Remove all falsy values (false, null, undefined, 0, "", NaN).

```typescript
compact([0, 1, false, 2, "", null]); // [1, 2]
```

## Set Operations

### `difference(arr1, arr2)`

Get elements in first array but not in second.

```typescript
difference([1, 2, 3, 4], [2, 3]); // [1, 4]
```

### `intersection(arr1, arr2)`

Get elements present in both arrays.

```typescript
intersection([1, 2, 3], [2, 3, 4]); // [2, 3]
```

### `zip(arr1, arr2)`

Combine two arrays into pairs. Stops at shorter array.

```typescript
zip([1, 2], ["a", "b"]); // [[1, "a"], [2, "b"]]
```
