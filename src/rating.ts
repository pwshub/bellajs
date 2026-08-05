/** Rating and scoring utilities using Wilson Score and other algorithms. */

/** Calculate score for Positive/Negative ratings using Wilson Score Equation (0 to 1). */
export const score = (p = 0, n = 0): number => {
  if (p === 0 && n === 0) {
    return 0;
  }

  const r = ((p + 1.9208) / (p + n) -
    1.96 * Math.sqrt(p * n / (p + n) + 0.9604) / (p + n)) /
    (1 + 3.8416 / (p + n));

  return Number(r.toFixed(2));
};

/** Calculate score for multi-level ratings (e.g., 1-5 stars) using Wilson Score (0 to 1). */
export const rate = (rating: number[] = []): number => {
  const size = rating.length;

  if (size === 0) {
    return 0;
  }

  let n = rating[0];
  let p = rating[size - 1];

  const step = Number((1 / (size - 1)).toFixed(2));
  const totalStep = size - 1;

  for (let i = 1; i < totalStep; i++) {
    const ep = Number((step * i).toFixed(2));
    p += rating[i] * ep;
    n += rating[totalStep - i] * ep;
  }

  return score(p, n);
};

/** Calculate weighted average for multi-level ratings (0 to 5 scale). */
export const average = (rating: number[] = []): number => {
  const total = rating.reduce((prev, current) => prev + current, 0);

  if (total === 0) {
    return 0;
  }

  let sum = 0;
  let k = 1;

  rating.forEach((item) => {
    sum += item * k;
    k++;
  });

  const r = sum / total;
  return Number(r.toFixed(1));
};

/**
 * Calculate Bayesian Average rating.
 * Balances between item average and global average.
 */
export const bayesianAverage = (
  ratings: number[] = [],
  prior = 5,
  priorMean = 3,
): number => {
  const total = ratings.reduce((prev, current) => prev + current, 0);

  if (total === 0) {
    return 0;
  }

  const n = total;
  let sum = 0;
  let k = 1;

  ratings.forEach((item) => {
    sum += item * k;
    k++;
  });

  const R = sum / n;
  const result = (prior * priorMean + n * R) / (prior + n);

  return Number(result.toFixed(2));
};

/** Calculate time-decay weighted rating using exponential decay. */
export const weightedRating = (
  ratings: Array<{ rating: number; timestamp: number }> = [],
  halfLife = 24,
): number => {
  if (!Array.isArray(ratings) || ratings.length === 0) {
    return 0;
  }

  const now = Date.now();
  let weightedSum = 0;
  let totalWeight = 0;

  ratings.forEach(({ rating, timestamp }) => {
    const ageInHours = (now - timestamp) / (1000 * 60 * 60);
    const weight = Math.exp(-ageInHours / halfLife);

    weightedSum += rating * weight;
    totalWeight += weight;
  });

  if (totalWeight === 0) {
    return 0;
  }

  return Number((weightedSum / totalWeight).toFixed(2));
};

/** Calculate viral score for trending content combining engagement with time decay. */
export const viralScore = ({
  engagement = 0,
  rating = 1,
  ageInHours = 0,
  windowSize = 24,
}: {
  engagement?: number;
  rating?: number;
  ageInHours?: number;
  windowSize?: number;
} = {}): number => {
  if (engagement <= 0 || rating <= 0) {
    return 0;
  }

  const timeFactor = ageInHours / windowSize;
  const s = (engagement * rating) / (timeFactor + 1);

  return Number(s.toFixed(2));
};

/** Rating submodule containing all rating and scoring functions. */
export const rating = {
  score,
  rate,
  average,
  bayesianAverage,
  weightedRating,
  viralScore,
};
