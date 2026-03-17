/**
 * Calculate score for systems with Positive/Negative ratings using Wilson Score Equation.
 * Returns a normalized value between 0 and 1.
 * Applicable for systems with only positive and negative ratings (like/dislike, thumbs up/thumbs down).
 *
 * @param {number} [p=0] - Positive rating value.
 * @param {number} [n=0] - Negative rating value.
 * @returns {number} A float value from 0 to 1.
 *
 * @example
 * score(80, 20) // => 0.71
 * score(0, 100) // => 0
 * score(100, 0) // => 0.96
 */
export const score = (p = 0, n = 0) => {
  if (p === 0 && n === 0) {
    return 0
  }

  const r = ((p + 1.9208) / (p + n) -
    1.96 * Math.sqrt(p * n / (p + n) + 0.9604) / (p + n)) /
    (1 + 3.8416 / (p + n))

  return Number(r.toFixed(2))
}

/**
 * Calculate score for systems with 5 or more rating levels using Wilson Score Equation.
 * Returns a normalized value between 0 and 1.
 * Commonly used in rating systems with 5 levels (Google Play Store, Amazon, etc.).
 *
 * @param {number[]} [rating=[]] - An array of rating values (e.g., [1-star, 2-star, 3-star, 4-star, 5-star]).
 * @returns {number} A float value from 0 to 1.
 *
 * @example
 * rate([134055, 57472, 143135, 365957, 1448459]) // => 0.84
 * rate([0, 0, 0, 0, 0]) // => 0
 * rate([5, 4, 3, 2, 1]) // => 0.15
 */
export const rate = (rating = []) => {
  const size = rating.length

  if (size === 0) {
    return 0
  }

  let n = rating[0]
  let p = rating[size - 1]

  const step = Number((1 / (size - 1)).toFixed(2))
  const totalStep = size - 1

  for (let i = 1; i < totalStep; i++) {
    const ep = Number((step * i).toFixed(2))
    p += rating[i] * ep
    n += rating[totalStep - i] * ep
  }

  return score(p, n)
}

/**
 * Calculate average value for systems with 5 or more rating levels.
 * Returns a value from 0 to 5 (or higher for custom ranges).
 *
 * @param {number[]} [rating=[]] - An array of rating values (e.g., [1-star, 2-star, 3-star, 4-star, 5-star]).
 * @returns {number} A float value from 0 to 5 (or higher for custom ranges).
 *
 * @example
 * average([134055, 57472, 143135, 365957, 1448459]) // => 4.4
 * average([0, 0, 0, 0, 0]) // => 0
 * average([5, 4, 3, 2, 1]) // => 2.3
 */
export const average = (rating = []) => {
  const total = rating.reduce((prev, current) => prev + current, 0)

  if (total === 0) {
    return 0
  }

  let sum = 0
  let k = 1

  rating.forEach((item) => {
    sum += item * k
    k++
  })

  const r = sum / total
  return Number(r.toFixed(1))
}

/**
 * Calculate Bayesian Average rating.
 * Returns a value that balances between the item's average and the global average.
 * Useful for ranking items with different numbers of ratings.
 *
 * Formula: (C + n * R) / (C + n)
 * Where:
 *   - C = prior count (confidence constant, number of "virtual" ratings)
 *   - n = total number of ratings
 *   - R = average rating of the item
 *
 * @param {number[]} ratings - An array of rating values (e.g., [1-star, 2-star, 3-star, 4-star, 5-star]).
 * @param {number} [prior=5] - Prior count (confidence constant). Higher = more conservative.
 * @param {number} [priorMean=3] - Prior mean (global average rating). Typically mid-scale value.
 * @returns {number} A float value representing the Bayesian average (typically 0-5 scale).
 *
 * @example
 * // Product with few ratings (5 stars, 2 votes)
 * bayesianAverage([0, 0, 0, 0, 2], 5, 3) // => 2.7
 *
 * // Product with many ratings (5 stars, 1000 votes)
 * bayesianAverage([0, 0, 0, 0, 1000], 5, 3) // => 4.99
 *
 * // Item with no ratings returns 0
 * bayesianAverage([0, 0, 0, 0, 0], 5, 3) // => 0
 */
export const bayesianAverage = (ratings = [], prior = 5, priorMean = 3) => {
  const total = ratings.reduce((prev, current) => prev + current, 0)

  if (total === 0) {
    return 0
  }

  const n = total
  let sum = 0
  let k = 1

  ratings.forEach((item) => {
    sum += item * k
    k++
  })

  const R = sum / n
  const result = (prior * priorMean + n * R) / (prior + n)

  return Number(result.toFixed(2))
}

/**
 * Calculate time-decay weighted rating.
 * Recent ratings are weighted higher than older ones using exponential decay.
 * Useful for trending posts, viral content, or time-sensitive rankings.
 *
 * Formula: sum(rating * weight) / sum(weights)
 * Where: weight = exp(-ageInHours / halfLife)
 *
 * @param {Array<{rating: number, timestamp: number}>} ratings - Array of rating objects with rating value and timestamp (ms).
 * @param {number} [halfLife=24] - Half-life in hours. After this time, weight is reduced by 50%.
 * @returns {number} A float value representing the time-weighted average rating.
 *
 * @example
 * // Ratings with timestamps (rating, timestamp in ms)
 * const ratings = [
 *   { rating: 5, timestamp: Date.now() - 1000 },           // 1 second ago
 *   { rating: 3, timestamp: Date.now() - 3600000 },        // 1 hour ago
 *   { rating: 4, timestamp: Date.now() - 86400000 }        // 24 hours ago
 * ]
 * weightedRating(ratings, 24) // => ~4.3 (recent 5-star weighs more)
 *
 * @example
 * // Viral post ranking (24-hour window)
 * const postRatings = [
 *   { rating: 100, timestamp: Date.now() - 3600000 },   // 100 upvotes, 1 hour ago
 *   { rating: 50, timestamp: Date.now() - 7200000 }     // 50 upvotes, 2 hours ago
 * ]
 * weightedRating(postRatings, 12) // => ~89 (recent votes count more)
 */
export const weightedRating = (ratings = [], halfLife = 24) => {
  if (!Array.isArray(ratings) || ratings.length === 0) {
    return 0
  }

  const now = Date.now()
  let weightedSum = 0
  let totalWeight = 0

  ratings.forEach(({ rating, timestamp }) => {
    const ageInHours = (now - timestamp) / (1000 * 60 * 60)
    const weight = Math.exp(-ageInHours / halfLife)

    weightedSum += rating * weight
    totalWeight += weight
  })

  if (totalWeight === 0) {
    return 0
  }

  return Number((weightedSum / totalWeight).toFixed(2))
}

/**
 * Calculate viral score for trending content.
 * Combines rating/engagement with time decay to rank trending items.
 * Useful for "hot" posts, trending articles, or viral content within a time window.
 *
 * Formula: (engagement * rating) / (timeFactor + 1)
 * Where: timeFactor = ageInHours / windowSize
 *
 * @param {Object} options - Options object.
 * @param {number} [options.engagement=0] - Total engagement (views, votes, comments, etc.).
 * @param {number} [options.rating=1] - Average rating (1-5 scale, or any positive value).
 * @param {number} [options.ageInHours=0] - Age of the content in hours.
 * @param {number} [options.windowSize=24] - Time window in hours for trending calculation.
 * @returns {number} A float value representing the viral/trending score.
 *
 * @example
 * // Post with 1000 views, 4.5 rating, posted 2 hours ago
 * viralScore({ engagement: 1000, rating: 4.5, ageInHours: 2, windowSize: 24 }) // => 4153.85
 *
 * @example
 * // Post with 5000 views, 3.5 rating, posted 48 hours ago (trending window 24h)
 * viralScore({ engagement: 5000, rating: 3.5, ageInHours: 48, windowSize: 24 }) // => 5833.33
 */
export const viralScore = ({
  engagement = 0,
  rating = 1,
  ageInHours = 0,
  windowSize = 24,
} = {}) => {
  if (engagement <= 0 || rating <= 0) {
    return 0
  }

  const timeFactor = ageInHours / windowSize
  const score = (engagement * rating) / (timeFactor + 1)

  return Number(score.toFixed(2))
}

/**
 * Rating submodule object containing all rating and scoring functions.
 */
export const rating = {
  score,
  rate,
  average,
  bayesianAverage,
  weightedRating,
  viralScore,
}
