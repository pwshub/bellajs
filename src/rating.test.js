import { describe, it } from 'node:test'
import assert from 'node:assert'

import { average, rate, score, rating, bayesianAverage, weightedRating, viralScore } from '../src/rating.js'

const scoreSamples = [
  { p: 0, n: 1, e: 0 },
  { p: 0, n: 5, e: 0 },
  { p: 0, n: 10, e: 0 },
  { p: 0, n: 20, e: 0 },
  { p: 0, n: 100, e: 0 },
  { p: 0, n: 1000, e: 0 },
  { n: 0, p: 1, e: 0.21 },
  { n: 0, p: 5, e: 0.57 },
  { n: 0, p: 10, e: 0.72 },
  { n: 0, p: 20, e: 0.84 },
  { n: 0, p: 100, e: 0.96 },
  { n: 0, p: 1000, e: 1 },
  { n: 1, p: 1, e: 0.09 },
  { n: 5, p: 5, e: 0.24 },
  { n: 500, p: 500, e: 0.47 },
  { n: 1000, p: 1000, e: 0.48 },
]

const ratingSamples = [
  {
    rating: [0, 0, 0, 0, 0],
    expect: { average: 0, score: 0 },
  },
  {
    rating: [1, 1, 1, 1, 1],
    expect: { average: 3.0, score: 0.17 },
  },
  {
    rating: [2, 2, 2, 2, 2],
    expect: { average: 3.0, score: 0.24 },
  },
  {
    rating: [3, 3, 3, 3, 3],
    expect: { average: 3.0, score: 0.27 },
  },
  {
    rating: [4, 4, 4, 4, 4],
    expect: { average: 3.0, score: 0.3 },
  },
  {
    rating: [5, 5, 5, 5, 5],
    expect: { average: 3.0, score: 0.32 },
  },
  {
    rating: [5, 4, 3, 2, 1],
    expect: { average: 2.3, score: 0.15 },
  },
  {
    rating: [5, 0, 0, 0, 5],
    expect: { average: 3.0, score: 0.24 },
  },
  {
    rating: [5, 0, 0, 4, 5],
    expect: { average: 3.3, score: 0.33 },
  },
  {
    rating: [5, 4, 0, 0, 5],
    expect: { average: 2.7, score: 0.21 },
  },
  {
    rating: [0, 0, 0, 0, 5],
    expect: { average: 5, score: 0.57 },
  },
  {
    rating: [0, 0, 0, 4, 5],
    expect: { average: 4.6, score: 0.56 },
  },
  {
    rating: [0, 0, 3, 4, 5],
    expect: { average: 4.2, score: 0.51 },
  },
  {
    rating: [0, 2, 3, 4, 5],
    expect: { average: 3.9, score: 0.45 },
  },
  {
    rating: [1, 2, 3, 4, 5],
    expect: { average: 3.7, score: 0.42 },
  },
  {
    rating: [9524, 4158, 10177, 25971, 68669],
    expect: { average: 4.2, score: 0.79 },
  },
  {
    rating: [134055, 57472, 143135, 365957, 1448459],
    expect: { average: 4.4, score: 0.84 },
  },
]

const customRangeSamples = [
  { input: [3, 4, 2, 6, 12, 46, 134, 213, 116, 91, 45, 15, 58, 96, 1654], expect: 0.85 },
  { input: [3, 4, 2, 6, 12, 46, 134, 213, 116, 91], expect: 0.74 },
  { input: [1311, 655, 1008, 1847, 4685, 13522, 31570, 34238, 18180, 11029], expect: 0.72 },
  { input: [125, 166, 17, 290, 400, 310], expect: 0.62 },
  { input: [125, 166, 17, 290, 400, 310, 1800], expect: 0.79 },
]

describe('rating - score', () => {
  it('calculates Wilson score for positive/negative ratings', () => {
    scoreSamples.forEach((sample) => {
      const actual = score(sample.p, sample.n)
      assert.strictEqual(sample.e, actual)
    })
  })

  it('returns 0 when both p and n are 0', () => {
    assert.strictEqual(score(0, 0), 0)
  })

  it('handles default parameters', () => {
    assert.strictEqual(score(), 0)
  })
})

describe('rating - average', () => {
  it('calculates average for 5-level ratings', () => {
    ratingSamples.forEach((sample) => {
      const actual = average(sample.rating)
      assert.strictEqual(sample.expect.average, actual)
    })
  })

  it('returns 0 for empty array', () => {
    assert.strictEqual(average([]), 0)
  })

  it('returns 0 when all ratings are 0', () => {
    assert.strictEqual(average([0, 0, 0, 0, 0]), 0)
  })

  it('handles default parameters', () => {
    assert.strictEqual(average(), 0)
  })
})

describe('rating - rate', () => {
  it('calculates Wilson score for 5-level ratings', () => {
    ratingSamples.forEach((sample) => {
      const actual = rate(sample.rating)
      assert.strictEqual(sample.expect.score, actual)
    })
  })

  it('handles custom range ratings (more than 5 levels)', () => {
    customRangeSamples.forEach((sample) => {
      const actual = rate(sample.input)
      assert.strictEqual(sample.expect, actual)
    })
  })

  it('returns 0 for empty array', () => {
    assert.strictEqual(rate([]), 0)
  })

  it('handles default parameters', () => {
    assert.strictEqual(rate(), 0)
  })
})

describe('rating - submodule', () => {
  it('exports rating object with score, rate, and average', () => {
    assert.strictEqual(typeof rating, 'object')
    assert.strictEqual(typeof rating.score, 'function')
    assert.strictEqual(typeof rating.rate, 'function')
    assert.strictEqual(typeof rating.average, 'function')
  })

  it('works with destructuring from rating object', () => {
    const { score, rate, average } = rating
    assert.strictEqual(score(80, 20), 0.71)
    assert.strictEqual(rate([134055, 57472, 143135, 365957, 1448459]), 0.84)
    assert.strictEqual(average([134055, 57472, 143135, 365957, 1448459]), 4.4)
  })
})

describe('rating - bayesianAverage', () => {
  it('calculates Bayesian average for 5-level ratings', () => {
    // Product with many 5-star ratings
    assert.strictEqual(bayesianAverage([0, 0, 0, 0, 1000], 5, 3), 4.99)
  })

  it('pulls toward prior mean for small samples', () => {
    // Product with few 5-star ratings (should be pulled toward prior mean of 3)
    assert.strictEqual(bayesianAverage([0, 0, 0, 0, 2], 5, 3), 3.57)
  })

  it('returns 0 for no ratings', () => {
    assert.strictEqual(bayesianAverage([0, 0, 0, 0, 0], 5, 3), 0)
  })

  it('handles custom prior values', () => {
    // Higher prior = more conservative
    assert.strictEqual(bayesianAverage([0, 0, 0, 0, 10], 10, 3), 4)
    assert.strictEqual(bayesianAverage([0, 0, 0, 0, 10], 2, 3), 4.67)
  })

  it('handles default parameters', () => {
    assert.strictEqual(bayesianAverage(), 0)
  })

  it('handles mixed ratings', () => {
    // Mixed ratings averaging around 3
    assert.strictEqual(bayesianAverage([10, 10, 10, 10, 10], 5, 3), 3.0)
  })

  it('handles low ratings', () => {
    // Mostly 1-star ratings
    assert.strictEqual(bayesianAverage([100, 0, 0, 0, 0], 5, 3), 1.1)
  })
})

describe('rating - weightedRating', () => {
  it('calculates time-weighted rating with recent ratings weighted higher', () => {
    const now = Date.now()
    const ratings = [
      { rating: 5, timestamp: now - 1000 },           // 1 second ago (weight ~1)
      { rating: 3, timestamp: now - 3600000 },        // 1 hour ago
      { rating: 4, timestamp: now - 86400000 },       // 24 hours ago
    ]
    const result = weightedRating(ratings, 24)
    assert.strictEqual(result >= 4, true) // Recent 5-star should pull it up
    assert.strictEqual(result <= 5, true)
  })

  it('handles empty array', () => {
    assert.strictEqual(weightedRating([]), 0)
  })

  it('handles default parameters', () => {
    assert.strictEqual(weightedRating(), 0)
  })

  it('handles single rating', () => {
    const now = Date.now()
    const result = weightedRating([{ rating: 4, timestamp: now }], 24)
    assert.strictEqual(result, 4)
  })

  it('respects half-life parameter', () => {
    const now = Date.now()
    const ratings = [
      { rating: 5, timestamp: now - 3600000 },        // 1 hour ago
      { rating: 1, timestamp: now - 48 * 3600000 },   // 48 hours ago
    ]
    // Short half-life = old ratings decay faster
    const shortHalfLife = weightedRating(ratings, 6)
    // Long half-life = old ratings still matter
    const longHalfLife = weightedRating(ratings, 72)
    assert.strictEqual(shortHalfLife > longHalfLife, true)
  })

  it('handles ratings from different times', () => {
    const now = Date.now()
    const ratings = [
      { rating: 5, timestamp: now - 1000 },
      { rating: 5, timestamp: now - 1000 },
      { rating: 1, timestamp: now - 100000000 },
    ]
    const result = weightedRating(ratings, 24)
    assert.strictEqual(result >= 4, true) // Recent 5-stars should dominate
  })
})

describe('rating - viralScore', () => {
  it('calculates viral score based on engagement, rating, and time', () => {
    const result = viralScore({
      engagement: 1000,
      rating: 4.5,
      ageInHours: 2,
      windowSize: 24,
    })
    assert.strictEqual(result, 4153.85)
  })

  it('decreases score for older content', () => {
    const fresh = viralScore({
      engagement: 1000,
      rating: 4.5,
      ageInHours: 1,
      windowSize: 24,
    })
    const old = viralScore({
      engagement: 1000,
      rating: 4.5,
      ageInHours: 48,
      windowSize: 24,
    })
    assert.strictEqual(fresh > old, true)
  })

  it('returns 0 for zero engagement', () => {
    assert.strictEqual(viralScore({ engagement: 0, rating: 5 }), 0)
  })

  it('returns 0 for zero rating', () => {
    assert.strictEqual(viralScore({ engagement: 1000, rating: 0 }), 0)
  })

  it('handles default parameters', () => {
    assert.strictEqual(viralScore(), 0)
  })

  it('handles custom window size', () => {
    // 24-hour window
    const score24h = viralScore({
      engagement: 1000,
      rating: 5,
      ageInHours: 12,
      windowSize: 24,
    })
    // 6-hour window (same content is "older" relative to window)
    const score6h = viralScore({
      engagement: 1000,
      rating: 5,
      ageInHours: 12,
      windowSize: 6,
    })
    assert.strictEqual(score24h > score6h, true)
  })

  it('ranks viral content correctly', () => {
    // New viral post vs old popular post
    const newViral = viralScore({
      engagement: 5000,
      rating: 4.5,
      ageInHours: 3,
      windowSize: 24,
    })
    const oldPopular = viralScore({
      engagement: 10000,
      rating: 4.5,
      ageInHours: 72,
      windowSize: 24,
    })
    // New viral should rank higher despite fewer total engagements
    assert.strictEqual(newViral > oldPopular, true)
  })
})
