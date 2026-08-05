import { assertEquals } from "https://deno.land/std/assert/mod.ts";

import {
  average,
  bayesianAverage,
  rate,
  rating,
  score,
  viralScore,
  weightedRating,
} from "../src/rating.ts";

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
];

const ratingSamples = [
  { rating: [0, 0, 0, 0, 0], expect: { average: 0, score: 0 } },
  { rating: [1, 1, 1, 1, 1], expect: { average: 3.0, score: 0.17 } },
  { rating: [2, 2, 2, 2, 2], expect: { average: 3.0, score: 0.24 } },
  { rating: [3, 3, 3, 3, 3], expect: { average: 3.0, score: 0.27 } },
  { rating: [4, 4, 4, 4, 4], expect: { average: 3.0, score: 0.3 } },
  { rating: [5, 5, 5, 5, 5], expect: { average: 3.0, score: 0.32 } },
  { rating: [5, 4, 3, 2, 1], expect: { average: 2.3, score: 0.15 } },
  { rating: [5, 0, 0, 0, 5], expect: { average: 3.0, score: 0.24 } },
  { rating: [5, 0, 0, 4, 5], expect: { average: 3.3, score: 0.33 } },
  { rating: [5, 4, 0, 0, 5], expect: { average: 2.7, score: 0.21 } },
  { rating: [0, 0, 0, 0, 5], expect: { average: 5, score: 0.57 } },
  { rating: [0, 0, 0, 4, 5], expect: { average: 4.6, score: 0.56 } },
  { rating: [0, 0, 3, 4, 5], expect: { average: 4.2, score: 0.51 } },
  { rating: [0, 2, 3, 4, 5], expect: { average: 3.9, score: 0.45 } },
  { rating: [1, 2, 3, 4, 5], expect: { average: 3.7, score: 0.42 } },
  {
    rating: [9524, 4158, 10177, 25971, 68669],
    expect: { average: 4.2, score: 0.79 },
  },
  {
    rating: [134055, 57472, 143135, 365957, 1448459],
    expect: { average: 4.4, score: 0.84 },
  },
];

const customRangeSamples = [
  {
    input: [3, 4, 2, 6, 12, 46, 134, 213, 116, 91, 45, 15, 58, 96, 1654],
    expect: 0.85,
  },
  { input: [3, 4, 2, 6, 12, 46, 134, 213, 116, 91], expect: 0.74 },
  {
    input: [1311, 655, 1008, 1847, 4685, 13522, 31570, 34238, 18180, 11029],
    expect: 0.72,
  },
  { input: [125, 166, 17, 290, 400, 310], expect: 0.62 },
  { input: [125, 166, 17, 290, 400, 310, 1800], expect: 0.79 },
];

Deno.test("score - Wilson score for positive/negative", () => {
  for (const sample of scoreSamples) {
    assertEquals(score(sample.p, sample.n), sample.e);
  }
  assertEquals(score(0, 0), 0);
  assertEquals(score(), 0);
});

Deno.test("average - 5-level ratings", () => {
  for (const sample of ratingSamples) {
    assertEquals(average(sample.rating), sample.expect.average);
  }
  assertEquals(average([]), 0);
  assertEquals(average([0, 0, 0, 0, 0]), 0);
  assertEquals(average(), 0);
});

Deno.test("rate - Wilson score for multi-level", () => {
  for (const sample of ratingSamples) {
    assertEquals(rate(sample.rating), sample.expect.score);
  }
  for (const sample of customRangeSamples) {
    assertEquals(rate(sample.input), sample.expect);
  }
  assertEquals(rate([]), 0);
  assertEquals(rate(), 0);
});

Deno.test("rating submodule", () => {
  assertEquals(typeof rating, "object");
  assertEquals(typeof rating.score, "function");
  assertEquals(typeof rating.rate, "function");
  assertEquals(typeof rating.average, "function");
  const { score: s, rate: r, average: a } = rating;
  assertEquals(s(80, 20), 0.71);
  assertEquals(r([134055, 57472, 143135, 365957, 1448459]), 0.84);
  assertEquals(a([134055, 57472, 143135, 365957, 1448459]), 4.4);
});

Deno.test("bayesianAverage", () => {
  assertEquals(bayesianAverage([0, 0, 0, 0, 1000], 5, 3), 4.99);
  assertEquals(bayesianAverage([0, 0, 0, 0, 2], 5, 3), 3.57);
  assertEquals(bayesianAverage([0, 0, 0, 0, 0], 5, 3), 0);
  assertEquals(bayesianAverage([0, 0, 0, 0, 10], 10, 3), 4);
  assertEquals(bayesianAverage([0, 0, 0, 0, 10], 2, 3), 4.67);
  assertEquals(bayesianAverage(), 0);
  assertEquals(bayesianAverage([10, 10, 10, 10, 10], 5, 3), 3.0);
  assertEquals(bayesianAverage([100, 0, 0, 0, 0], 5, 3), 1.1);
});

Deno.test("weightedRating", () => {
  const now = Date.now();
  const ratings = [
    { rating: 5, timestamp: now - 1000 },
    { rating: 3, timestamp: now - 3600000 },
    { rating: 4, timestamp: now - 86400000 },
  ];
  const result = weightedRating(ratings, 24);
  assertEquals(result >= 4, true);
  assertEquals(result <= 5, true);
  assertEquals(weightedRating([]), 0);
  assertEquals(weightedRating(), 0);
  assertEquals(weightedRating([{ rating: 4, timestamp: now }], 24), 4);
});

Deno.test("weightedRating - half-life", () => {
  const now = Date.now();
  const ratings = [
    { rating: 5, timestamp: now - 3600000 },
    { rating: 1, timestamp: now - 48 * 3600000 },
  ];
  const shortHalfLife = weightedRating(ratings, 6);
  const longHalfLife = weightedRating(ratings, 72);
  assertEquals(shortHalfLife > longHalfLife, true);
});

Deno.test("viralScore", () => {
  assertEquals(
    viralScore({
      engagement: 1000,
      rating: 4.5,
      ageInHours: 2,
      windowSize: 24,
    }),
    4153.85,
  );
  const fresh = viralScore({
    engagement: 1000,
    rating: 4.5,
    ageInHours: 1,
    windowSize: 24,
  });
  const old = viralScore({
    engagement: 1000,
    rating: 4.5,
    ageInHours: 48,
    windowSize: 24,
  });
  assertEquals(fresh > old, true);
  assertEquals(viralScore({ engagement: 0, rating: 5 }), 0);
  assertEquals(viralScore({ engagement: 1000, rating: 0 }), 0);
  assertEquals(viralScore(), 0);
});

Deno.test("viralScore - window size", () => {
  const score24h = viralScore({
    engagement: 1000,
    rating: 5,
    ageInHours: 12,
    windowSize: 24,
  });
  const score6h = viralScore({
    engagement: 1000,
    rating: 5,
    ageInHours: 12,
    windowSize: 6,
  });
  assertEquals(score24h > score6h, true);
});
