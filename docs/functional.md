# Functional Utilities

Function composition, piping, currying, and safe null handling.

## Installation

```bash
npm install @pwshub/bellajs
```

## Usage

```javascript
import { 
  compose, 
  pipe, 
  curry,
  maybe 
} from '@pwshub/bellajs'
```

## Function Composition

### `compose(...fns)`

Compose functions from right to left. The result of each function is passed to the next.

**Mathematical notation:** `compose(f, g, h)(x) = f(g(h(x)))`

```javascript
const add1 = x => x + 1
const mul2 = x => x * 2
const sub3 = x => x - 3

const calculate = compose(sub3, mul2, add1)
calculate(5)
// Step by step: add1(5)=6, mul2(6)=12, sub3(12)=9
// Returns: 9
```

**Real-world example:**

```javascript
const processUser = compose(
  user => ({ ...user, processed: true }),
  user => ({ ...user, name: user.name.toUpperCase() }),
  user => ({ ...user, age: user.age + 1 })
)

processUser({ name: 'alice', age: 30 })
// { name: 'ALICE', age: 31, processed: true }
```

### `pipe(...fns)`

Pipe functions from left to right. More readable than compose for many developers.

**Mathematical notation:** `pipe(f, g, h)(x) = h(g(f(x)))`

```javascript
const add1 = x => x + 1
const mul2 = x => x * 2
const sub3 = x => x - 3

const calculate = pipe(add1, mul2, sub3)
calculate(5)
// Step by step: add1(5)=6, mul2(6)=12, sub3(12)=9
// Returns: 9
```

**Real-world example:**

```javascript
const processOrder = pipe(
  order => ({ ...order, validated: true }),
  order => ({ ...order, total: order.price * order.quantity }),
  order => ({ ...order, status: 'processed' })
)

processOrder({ price: 10, quantity: 3 })
// { price: 10, quantity: 3, validated: true, total: 30, status: 'processed' }
```

## Currying

### `curry(fn)`

Transform a function into a curried version that can be called with partial arguments.

```javascript
// Regular function
const add = (a, b, c) => a + b + c

// Curried version
const curriedAdd = curry(add)

// Call with all arguments
curriedAdd(1, 2, 3)  // 6

// Call with partial arguments
const add1 = curriedAdd(1)
add1(2, 3)  // 6

const add1And2 = curriedAdd(1, 2)
add1And2(3)  // 6

// Chain single arguments
curriedAdd(1)(2)(3)  // 6
```

**Real-world example:**

```javascript
// Create specialized functions
const greet = (greeting, name) => `${greeting}, ${name}!`
const curriedGreet = curry(greet)

const sayHello = curriedGreet('Hello')
sayHello('Alice')  // "Hello, Alice!"
sayHello('Bob')    // "Hello, Bob!"

const sayHi = curriedGreet('Hi')
sayHi('Charlie')   // "Hi, Charlie!"
```

## Safe Null Handling

### `maybe(val)`

Create a Maybe instance for safe null/undefined handling with method chaining.

**Methods:**
- `isNil()` - Check if value is null/undefined
- `value()` - Extract the wrapped value
- `map(fn)` - Transform value if not nil
- `filter(fn)` / `when(fn)` - Keep value only if predicate is true
- `orElse(fn)` / `getOrElse(fn)` - Provide default if nil
- `tap(fn)` - Side effect without transformation
- `toArray()` - Convert to array
- `inspect()` - Debug string representation

```javascript
import { maybe } from '@pwshub/bellajs'

// Safe property access
const email = maybe(user)
  .map(u => u.profile)
  .map(p => p.contact)
  .map(c => c.email)
  .orElse(() => 'default@example.com')
  .value()

// Conditional transformation
const adultName = maybe(user)
  .filter(u => u.age >= 18)
  .map(u => u.name)
  .orElse(() => 'Minor')
  .value()

// Debugging with tap
maybe(data)
  .tap(x => console.log('Got:', x))
  .map(x => x.value)
  .value()

// Convert to array
maybe(5).toArray()      // [5]
maybe(null).toArray()   // []
```

**Original test case from bellajs:**

```javascript
const plus5 = x => x + 5
const minus2 = x => x - 2
const isNumber = x => Number(x) === x
const toString = x => 'The value is ' + String(x)
const getDefault = () => 'This is default value'

// Success case
maybe(5)
  .filter(isNumber)
  .map(plus5)
  .map(minus2)
  .map(toString)
  .orElse(getDefault)
  .value()
// "The value is 8"

// Failure case (not a number)
maybe('nothing')
  .filter(isNumber)
  .map(plus5)
  .map(minus2)
  .map(toString)
  .orElse(getDefault)
  .value()
// "This is default value"
```

## Examples

### Data Processing Pipeline

```javascript
import { pipe, filter, map } from '@pwshub/bellajs'

const processUsers = pipe(
  users => users.filter(u => u.active),
  users => users.map(u => ({ name: u.name, email: u.email })),
  users => users.sort((a, b) => a.name.localeCompare(b.name))
)

const activeUsers = processUsers(allUsers)
```

### Create Reusable Transformers

```javascript
import { curry, pipe } from '@pwshub/bellajs'

// Curried property getter
const prop = curry((key, obj) => obj[key])
const getName = prop('name')
const getEmail = prop('email')

// Compose transformers
const getUserInfo = pipe(
  getName,
  name => name.toUpperCase(),
  name => `User: ${name}`
)
```

### Avoid Callback Hell

```javascript
// Without maybe (nested if statements)
let result
if (data && data.user && data.user.profile) {
  if (data.user.profile.settings) {
    result = data.user.profile.settings.theme
  } else {
    result = 'default'
  }
} else {
  result = 'default'
}

// With maybe (clean chaining)
const result = maybe(data)
  .map(d => d.user)
  .map(u => u.profile)
  .map(p => p.settings)
  .map(s => s.theme)
  .orElse(() => 'default')
  .value()
```

## See Also

- [Array utilities](array.md) - Array transformations that work well with pipe/compose
- [Object utilities](object.md) - Object manipulation in pipelines
