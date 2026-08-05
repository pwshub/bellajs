/** Maybe monad for safe null/undefined handling with method chaining. */

import { isNil } from "./detection.ts";

interface Maybe<T = any> {
  isNil(): boolean;
  value(): T | null;
  map<U>(fn: (value: T) => U): Maybe<U>;
  filter(fn: (value: T) => boolean): Maybe<T>;
  when(fn: (value: T) => boolean): Maybe<T>;
  orElse(fn: () => T): Maybe<T>;
  getOrElse(fn: () => T): Maybe<T>;
  tap(fn: (value: T) => void): Maybe<T>;
  toArray(): T[];
  inspect(): string;
}

/** Wraps a value in a Maybe for safe null/undefined handling. */
export const maybe = <T = any>(val: T | null | undefined): Maybe<T> => {
  const isNilMethod = () => isNil(val);
  const value = () => val as T | null;

  const map = <U>(fn: (value: T) => U): Maybe<U> => {
    return maybe(isNil(val) ? null : fn(val as T));
  };

  const filter = (fn: (value: T) => boolean): Maybe<T> => {
    return maybe(isNil(val) || !fn(val as T) ? null : val as T);
  };

  const orElse = (fn: () => T): Maybe<T> => {
    return maybe(isNil(val) ? fn() : val as T);
  };

  const tap = (fn: (value: T) => void): Maybe<T> => {
    if (!isNil(val)) {
      fn(val as T);
    }
    return maybeInstance;
  };

  const toArray = (): T[] => {
    return isNil(val) ? [] : [val as T];
  };

  const inspect = (): string => {
    return `Maybe(${isNil(val) ? "null" : val})`;
  };

  const maybeInstance: Maybe<T> = {
    isNil: isNilMethod,
    value,
    map,
    filter,
    when: filter,
    orElse,
    getOrElse: orElse,
    tap,
    toArray,
    inspect,
  };

  return maybeInstance;
};
