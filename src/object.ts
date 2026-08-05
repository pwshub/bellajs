/** Object utilities: deep clone and property copying. */

import { hasProperty, isArray, isObject } from "./detection.ts";

/** Deep copy using structuredClone. Handles objects, arrays, Dates, and circular refs. */
export const clone = <T>(val: T): T => {
  return structuredClone(val);
};

/** Copies properties from source to dest. Nested objects/arrays are deep copied. */
export const copies = (
  source: Record<string, any>,
  dest: Record<string, any>,
  matched = false,
  excepts: string[] = [],
): Record<string, any> => {
  for (const k of Object.keys(source)) {
    if (excepts.length > 0 && excepts.includes(k)) {
      continue;
    }
    if (!matched || (matched && hasProperty(dest, k))) {
      const oa = source[k];
      const ob = dest[k];
      if ((isObject(ob) && isObject(oa)) || (isArray(ob) && isArray(oa))) {
        dest[k] = copies(oa, dest[k], matched, excepts);
      } else {
        dest[k] = clone(oa);
      }
    }
  }
  return dest;
};
