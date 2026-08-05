# Rating Utilities

Calculate ratings and scores based on Wilson Score Equation, Bayesian Average,
and time-decay weighting.

## Installation

```typescript
import { rating } from "jsr:@pwshub/bellajs";
const { score, rate, average, bayesianAverage, weightedRating, viralScore } =
  rating;
```

## Functions

### `score(p, n)`

Wilson Score for positive/negative ratings (e.g., thumbs up/down). Returns 0–1.

```typescript
score(80, 20); // 0.71 (80 likes, 20 dislikes)
score(0, 100); // 0
score(100, 0); // 0.96
score(500, 500); // 0.47
```

### `rate(ratings)`

Wilson Score for 5+ rating levels (e.g., 1–5 stars). Returns 0–1.

```typescript
rate([134055, 57472, 143135, 365957, 1448459]); // 0.84
rate([0, 0, 0, 0, 0]); // 0
rate([5, 4, 3, 2, 1]); // 0.15
```

### `average(ratings)`

Simple average for 5+ rating levels.

```typescript
average([134055, 57472, 143135, 365957, 1448459]); // 4.4
average([5, 4, 3, 2, 1]); // 3.0
```

### `bayesianAverage(ratings, prior, priorMean)`

Bayesian Average rating. Balances item average with global average.

```typescript
// Many ratings — close to true average
bayesianAverage([0, 0, 0, 0, 1000], 5, 3); // 4.99

// Few ratings — pulled toward prior mean of 3
bayesianAverage([0, 0, 0, 0, 2], 5, 3); // 3.57

// No ratings
bayesianAverage([0, 0, 0, 0, 0], 5, 3); // 0

// Higher prior = more conservative
bayesianAverage([0, 0, 0, 0, 10], 10, 3); // 4.0
```

Parameters:

- `prior` (default: 5) — Confidence constant. Higher = more conservative
- `priorMean` (default: 3) — Global average rating

### `weightedRating(ratings, halfLife)`

Time-decay weighted rating. Recent ratings weighted higher.

```typescript
const ratings = [
  { rating: 5, timestamp: Date.now() - 1000 }, // 1 second ago
  { rating: 3, timestamp: Date.now() - 3600000 }, // 1 hour ago
  { rating: 4, timestamp: Date.now() - 86400000 }, // 24 hours ago
];
weightedRating(ratings, 24); // ~4.3 (recent 5-star weighs more)
```

Parameters:

- `halfLife` (default: 24) — Half-life in hours

### `viralScore(options)`

Viral/trending score combining engagement with time decay.

```typescript
viralScore({
  engagement: 1000,
  rating: 4.5,
  ageInHours: 2,
  windowSize: 24,
}); // 4153.85
```

Parameters: `engagement`, `rating`, `ageInHours`, `windowSize`

## Algorithm Comparison

| Algorithm         | Best For                | Conservative | Time-Aware |
| ----------------- | ----------------------- | ------------ | ---------- |
| `score` / `rate`  | Rankings, competitions  | Yes          | No         |
| `bayesianAverage` | E-commerce, app stores  | Moderate     | No         |
| `weightedRating`  | Reviews, time-sensitive | Moderate     | Yes        |
| `viralScore`      | Trending content        | No           | Yes        |
