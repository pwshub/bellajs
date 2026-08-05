/** Array manipulation utilities. */

import { hasProperty, isString } from "./detection.ts";
import { randomInt } from "./random.ts";

const fnSort = (a: any, b: any): number => {
  return a > b ? 1 : (a < b ? -1 : 0);
};

/** Removes duplicate elements from an array. */
export const unique = <T>(arr: T[] = []): T[] => {
  return [...new Set(arr)];
};

/** Sorts an array and returns a new sorted array. */
export const sort = <T>(
  arr: T[] = [],
  sorting: ((a: T, b: T) => number) | null = null,
): T[] => {
  const tmp: T[] = [...arr];
  const fn: (a: T, b: T) => number = sorting || fnSort;
  tmp.sort(fn);
  return tmp;
};

/** Sorts an array of objects by a specified property. */
export const sortBy = <T extends Record<string, any>>(
  arr: T[] = [],
  order = 1,
  key = "",
): T[] => {
  if (!isString(key) || arr.length === 0 || !hasProperty(arr[0], key)) {
    return arr;
  }
  return sort(arr, (m, n) => {
    return m[key] > n[key] ? order : (m[key] < n[key] ? (-1 * order) : 0);
  });
};

/** Randomly shuffles array elements using Fisher-Yates algorithm. */
export const shuffle = <T>(arr: T[] = []): T[] => {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = randomInt(i);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

/** Randomly picks N elements from an array. */
export const pick = <T>(arr: T[] = [], count = 1): T[] => {
  const a = shuffle(arr);
  const c = Math.max(0, Math.min(count, a.length));
  return a.slice(0, c);
};

/** Splits an array into chunks of specified size. */
export const chunk = <T>(arr: T[] = [], size = 1): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

/** Flattens a nested array to specified depth. */
export const flatten = <T>(arr: any[] = [], depth = 1): T[] => {
  const result: T[] = [];
  for (const item of arr) {
    if (Array.isArray(item) && depth > 0) {
      result.push(...(flatten(item, depth - 1) as T[]));
    } else {
      result.push(item);
    }
  }
  return result;
};

/** Groups array elements by a specified key or function. */
export const groupBy = <T>(
  arr: T[] = [],
  key: string | ((item: T) => string),
): Record<string, T[]> => {
  return arr.reduce((acc: Record<string, T[]>, item) => {
    const groupKey = typeof key === "function" ? key(item) : (item as any)[key];
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(item);
    return acc;
  }, {});
};

/** Gets the first n elements of an array. */
export const first = <T>(arr: T[] = [], n = 1): T[] => {
  return arr.slice(0, n);
};

/** Gets the last n elements of an array. */
export const last = <T>(arr: T[] = [], n = 1): T[] => {
  return arr.slice(-n);
};

/** Removes all falsy values from an array. */
export const compact = <T>(arr: T[] = []): T[] => {
  return arr.filter(Boolean);
};

/** Gets elements in arr1 but not in arr2. */
export const difference = <T>(arr1: T[] = [], arr2: T[] = []): T[] => {
  const set2 = new Set(arr2);
  return arr1.filter((item) => !set2.has(item));
};

/** Gets elements present in both arrays. */
export const intersection = <T>(arr1: T[] = [], arr2: T[] = []): T[] => {
  const set2 = new Set(arr2);
  return arr1.filter((item) => set2.has(item));
};

/** Combines two arrays into pairs. */
export const zip = <T, U>(arr1: T[] = [], arr2: U[] = []): [T, U][] => {
  const length = Math.min(arr1.length, arr2.length);
  const result: [T, U][] = [];
  for (let i = 0; i < length; i++) {
    result.push([arr1[i], arr2[i]]);
  }
  return result;
};
