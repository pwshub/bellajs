# Rating Utilities

Calculate ratings and scores based on Wilson Score Equation, Bayesian Average, and time-decay weighting.

## Installation

```bash
npm install @pwshub/bellajs
```

## Usage

```javascript
import { rating } from '@pwshub/bellajs'

const { score, rate, average, bayesianAverage, weightedRating, viralScore } = rating

// Or import directly
import { score, rate, average, bayesianAverage, weightedRating, viralScore } from '@pwshub/bellajs'
```

## Functions

### `score(p, n)`

Calculate score for systems with Positive/Negative ratings using Wilson Score Equation.

Returns a normalized value between 0 and 1. Applicable for systems with only positive and negative ratings (like/dislike, thumbs up/thumbs down).

**Parameters:**
- `p` (number, default: 0) - Positive rating value
- `n` (number, default: 0) - Negative rating value

**Returns:** number (0 to 1)

```javascript
// 80 likes, 20 dislikes
score(80, 20)
// => 0.71

// All negative
score(0, 100)
// => 0

// All positive
score(100, 0)
// => 0.96

// Equal ratings
score(500, 500)
// => 0.47
```

### `rate(ratings)`

Calculate score for systems with 5 or more rating levels using Wilson Score Equation.

Returns a normalized value between 0 and 1. Commonly used in rating systems with 5 levels (Google Play Store, Amazon, etc.).

**Parameters:**
- `ratings` (number[]) - Array of rating values (e.g., [1-star, 2-star, 3-star, 4-star, 5-star])

**Returns:** number (0 to 1)

```javascript
// Product with many reviews
// [1-star: 134055, 2-star: 57472, 3-star: 143135, 4-star: 365957, 5-star: 1448459]
rate([134055, 57472, 143135, 365957, 1448459])
// => 0.84

// All zeros
rate([0, 0, 0, 0, 0])
// => 0

// Mixed ratings
rate([5, 4, 3, 2, 1])
// => 0.15

// Custom range (15 levels)
rate([3, 4, 2, 6, 12, 46, 134, 213, 116, 91, 45, 15, 58, 96, 1654])
// => 0.85
```

### `average(ratings)`

Calculate average value for systems with 5 or more rating levels.

Returns a value from 0 to 5 (or higher for custom ranges).

**Parameters:**
- `ratings` (number[]) - Array of rating values (e.g., [1-star, 2-star, 3-star, 4-star, 5-star])

**Returns:** number (0 to 5, or higher for custom ranges)

```javascript
// Product with many reviews
average([134055, 57472, 143135, 365957, 1448459])
// => 4.4

// All zeros
average([0, 0, 0, 0, 0])
// => 0

// Mixed ratings
average([5, 4, 3, 2, 1])
// => 2.3

// Perfect score
average([0, 0, 0, 0, 5])
// => 5.0
```

### `bayesianAverage(ratings, prior, priorMean)`

Calculate Bayesian Average rating.

Returns a value that balances between the item's average and the global average. Useful for ranking items with different numbers of ratings. Less conservative than Wilson Score.

**Formula:** `(C + n * R) / (C + n)`

Where:
- `C` = prior count (confidence constant)
- `n` = total number of ratings
- `R` = average rating of the item

**Parameters:**
- `ratings` (number[]) - Array of rating values
- `prior` (number, default: 5) - Prior count (confidence constant). Higher = more conservative
- `priorMean` (number, default: 3) - Prior mean (global average rating). Typically mid-scale value

**Returns:** number (typically 0-5 scale)

```javascript
// Product with many 5-star ratings (1000 votes)
bayesianAverage([0, 0, 0, 0, 1000], 5, 3)
// => 4.99 (close to true average)

// Product with few 5-star ratings (2 votes)
bayesianAverage([0, 0, 0, 0, 2], 5, 3)
// => 3.57 (pulled toward prior mean of 3)

// Item with no ratings
bayesianAverage([0, 0, 0, 0, 0], 5, 3)
// => 0 (not prior mean, to distinguish from items with ratings)

// Higher prior = more conservative ranking
bayesianAverage([0, 0, 0, 0, 10], 10, 3)
// => 4.0

// Lower prior = less conservative
bayesianAverage([0, 0, 0, 0, 10], 2, 3)
// => 4.67
```

**When to use:**
- E-commerce product rankings
- App store ratings
- When you want smoother transitions for new items
- Less conservative than Wilson Score

### `weightedRating(ratings, halfLife)`

Calculate time-decay weighted rating.

Recent ratings are weighted higher than older ones using exponential decay. Useful for trending posts, viral content, or time-sensitive rankings.

**Formula:** `sum(rating * weight) / sum(weights)`

Where: `weight = exp(-ageInHours / halfLife)`

**Parameters:**
- `ratings` (Array<{rating: number, timestamp: number}>) - Array of rating objects with rating value and timestamp (milliseconds)
- `halfLife` (number, default: 24) - Half-life in hours. After this time, weight is reduced by 50%

**Returns:** number (time-weighted average rating)

```javascript
// Ratings with timestamps
const ratings = [
  { rating: 5, timestamp: Date.now() - 1000 },           // 1 second ago
  { rating: 3, timestamp: Date.now() - 3600000 },        // 1 hour ago
  { rating: 4, timestamp: Date.now() - 86400000 }        // 24 hours ago
]

weightedRating(ratings, 24)
// => ~4.3 (recent 5-star weighs more)

// Short half-life (6 hours) = old ratings decay faster
weightedRating(ratings, 6)
// => ~4.7 (very recent ratings dominate)

// Long half-life (72 hours) = old ratings still matter
weightedRating(ratings, 72)
// => ~4.0 (all ratings considered more equally)
```

**When to use:**
- Trending content ranking
- Time-sensitive product reviews (software, apps)
- News article ratings
- Event feedback (recent opinions matter more)

### `viralScore(options)`

Calculate viral score for trending content.

Combines engagement with time decay to rank trending items. Useful for "hot" posts, trending articles, or viral content within a time window.

**Formula:** `(engagement * rating) / (timeFactor + 1)`

Where: `timeFactor = ageInHours / windowSize`

**Parameters:**
- `options` (Object) - Options object
  - `engagement` (number, default: 0) - Total engagement (views, votes, comments, etc.)
  - `rating` (number, default: 1) - Average rating (1-5 scale, or any positive value)
  - `ageInHours` (number, default: 0) - Age of the content in hours
  - `windowSize` (number, default: 24) - Time window in hours for trending calculation

**Returns:** number (viral/trending score)

```javascript
// Post with 1000 views, 4.5 rating, posted 2 hours ago
viralScore({
  engagement: 1000,
  rating: 4.5,
  ageInHours: 2,
  windowSize: 24
})
// => 4153.85

// Same post 48 hours later (trending score drops)
viralScore({
  engagement: 1000,
  rating: 4.5,
  ageInHours: 48,
  windowSize: 24
})
// => 1500

// New viral post vs old popular post
const newViral = viralScore({
  engagement: 5000,
  rating: 4.5,
  ageInHours: 3,
  windowSize: 24
})
// => 20000

const oldPopular = viralScore({
  engagement: 10000,
  rating: 4.5,
  ageInHours: 72,
  windowSize: 24
})
// => 11250

// New viral ranks higher despite fewer total engagements
newViral > oldPopular // true
```

**When to use:**
- "Trending now" sections
- Hot posts within 24-hour window
- Viral content discovery
- Real-time ranking feeds

## Examples

### Product Ranking (Bayesian vs Wilson)

```javascript
import { rating } from '@pwshub/bellajs'

const { rate, bayesianAverage } = rating

// New product: 5 stars, 3 votes
const newProduct = [0, 0, 0, 0, 3]

// Established product: 4.5 stars, 1000 votes
const established = [50, 30, 100, 300, 520]

// Wilson Score (conservative, penalizes small samples)
rate(newProduct)      // => 0.32
rate(established)     // => 0.82

// Bayesian Average (smoother, more intuitive)
bayesianAverage(newProduct, 5, 3)    // => 3.0 (pulled toward mean)
bayesianAverage(established, 5, 3)   // => 4.4
```

### Trending Posts (24-Hour Window)

```javascript
import { rating } from '@pwshub/bellajs'

const { weightedRating, viralScore } = rating

// Post A: 100 upvotes, posted 2 hours ago
const postA = {
  engagement: 100,
  rating: 5,
  ageInHours: 2,
  windowSize: 24
}

// Post B: 200 upvotes, posted 48 hours ago
const postB = {
  engagement: 200,
  rating: 5,
  ageInHours: 48,
  windowSize: 24
}

// Viral score ranks Post A higher (trending now)
viralScore(postA) // => 461.54
viralScore(postB) // => 333.33

// For "Trending" section, sort by viralScore descending
```

### Time-Weighted Product Reviews

```javascript
import { rating } from '@pwshub/bellajs'

const { weightedRating } = rating

// Software with version updates
const reviews = [
  { rating: 2, timestamp: Date.now() - 90 * 24 * 3600000 }, // 90 days ago (old version)
  { rating: 3, timestamp: Date.now() - 60 * 24 * 3600000 }, // 60 days ago
  { rating: 5, timestamp: Date.now() - 7 * 24 * 3600000 },  // 7 days ago (new version)
  { rating: 5, timestamp: Date.now() - 1 * 24 * 3600000 },  // 1 day ago
]

// Recent reviews (new version) weigh more
weightedRating(reviews, 30) // => ~4.5 (reflects current quality)

// Simple average would be lower
// (2 + 3 + 5 + 5) / 4 = 3.75
```

## Algorithm Comparison

| Algorithm | Best For | Conservative | Time-Aware |
|-----------|----------|--------------|------------|
| `score()` / `rate()` | Rankings, competitions, hall of fame | ✅ Yes | ❌ No |
| `bayesianAverage()` | E-commerce, app stores, general display | ⚠️ Moderate | ❌ No |
| `weightedRating()` | Reviews, time-sensitive products | ⚠️ Moderate | ✅ Yes |
| `viralScore()` | Trending content, hot posts, real-time feeds | ❌ No | ✅ Yes |

## See Also

- [Number utilities](number.md) - formatNumber, formatBytes
