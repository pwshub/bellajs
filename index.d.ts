// Type definitions for @pwshub/bellajs

export type AnyObject = { [key: string]: any }

// Detection utilities
export function isNumber(val: any): boolean
export function isInteger(val: any): boolean
export function isArray(val: any): boolean
export function isString(val: any): boolean
export function isBoolean(val: any): boolean
export function isNull(val: any): boolean
export function isUndefined(val: any): boolean
export function isNil(val: any): boolean
export function isFunction(val: any): boolean
export function isObject(val: any): boolean
export function isDate(val: any): boolean
export function isEmail(val: any): boolean
export function isEmpty(val: any): boolean
export function hasProperty(obj: any, prop: string): boolean
export function isValidUrl(url?: string): boolean
export function isAbsoluteUrl(url?: string): boolean

// String utilities
export function truncate(text: string, wordLimit?: number): string
export function stripTags(s: string): string
export function escapeHTML(s: string): string
export function unescapeHTML(s: string): string
export function ucfirst(s: string): string
export function ucwords(s: string): string
export function stripAccent(s: string): string
export function slugify(s: string, delimiter?: string): string
export function getSentences(text: string, lang?: string): string[]
export function getArrayOfWords(text: string, lang?: string): string[]
export function getWordCount(text: string): number
export function findWordsIn(text: string, words?: string[]): string[]
export function findWordsInWithRegExp(text: string, words?: string[]): string[]
export function getWordMap(text: string): Record<string, number>
export function getTTR(text: string, imgcount?: number, wordsPerMinute?: number): number

// Random utilities
export function genid(len?: number, prefix?: string): string
export function randomInt(max: number): number

// Date utilities
export function getTime(t?: Date | number | string): number

export function getIsoDateTime(t?: Date | number | string): string

export function formatDateISO(date: Date | number | string): string

export function formatDate(
  input: Date | number | string,
  locale?: string,
  options?: Intl.DateTimeFormatOptions
): string

export function sec2dur(seconds: number): string

export function getDuration(begin: number, end?: number): string

export function formatRelativeTime(
  input: Date | number | string,
  locale?: string,
  justNowText?: string
): string

// Functional utilities
export function curry<F extends (...args: any[]) => any>(fn: F): (...args: any[]) => any
export function compose<T>(...fns: Array<(arg: T) => T>): (arg: T) => T
export function pipe<T>(...fns: Array<(arg: T) => T>): (arg: T) => T

// Property definition
export interface DefinePropConfig {
  writable?: boolean
  configurable?: boolean
  enumerable?: boolean
}

export function defineProp(
  ob: object,
  key: string,
  val: any,
  config?: DefinePropConfig
): void

// Object utilities
export function clone<T>(val: T): T
export function copies(
  source: AnyObject,
  dest: AnyObject,
  matched?: boolean,
  excepts?: string[]
): AnyObject

// Array utilities
export function unique<T>(arr?: T[]): T[]
export function sort<T>(arr?: T[], sorting?: ((a: T, b: T) => number) | null): T[]
export function sortBy<T extends Record<string, any>>(
  arr?: T[],
  order?: number,
  key?: string
): T[]
export function shuffle<T>(arr?: T[]): T[]
export function pick<T>(arr?: T[], count?: number): T[]
export function chunk<T>(arr?: T[], size?: number): T[][]
export function flatten<T>(arr?: any[], depth?: number): T[]
export function groupBy<T>(arr?: T[], key?: string | ((item: T) => string)): Record<string, T[]>
export function first<T>(arr?: T[], n?: number): T[]
export function last<T>(arr?: T[], n?: number): T[]
export function compact<T>(arr?: T[]): T[]
export function difference<T>(arr1?: T[], arr2?: T[]): T[]
export function intersection<T>(arr1?: T[], arr2?: T[]): T[]
export function zip<T, U>(arr1?: T[], arr2?: U[]): [T, U][]

// String similarity utilities
export function tokenize(text: string): string[]
export function toBow(tokens: string[]): Record<string, number>
export function cosineSimilarity(
  bow1: Record<string, number>,
  bow2: Record<string, number>
): number
export function compareTwoStrings(first: string, second: string): number
export function isSimilar(first: string, second: string, threshold?: number): boolean

// In-memory store
export interface Memstore<T = any> {
  set(key: string, value: T, ttl?: number): Memstore<T>
  get(key: string): T | null
  has(key: string): boolean
  del(key: string): boolean
  clear(): Memstore<T>
  size(): number
  entries(): IterableIterator<[string, T]>
  save(key: string, value: T, ttl?: number): Memstore<T>
  load(key: string): T | null
}

export function memstore<T = any>(defaultTtl?: number): Memstore<T>

// Maybe utility
export interface Maybe<T = any> {
  isNil(): boolean
  value(): T | null
  map<U>(fn: (value: T) => U): Maybe<U>
  filter(fn: (value: T) => boolean): Maybe<T>
  when(fn: (value: T) => boolean): Maybe<T>
  orElse(fn: () => T): Maybe<T>
  getOrElse(fn: () => T): Maybe<T>
  tap(fn: (value: T) => void): Maybe<T>
  toArray(): T[]
  inspect(): string
}

export function maybe<T = any>(val: T | null | undefined): Maybe<T>

// Number utilities
export function formatBytes(bytes: number, decimals?: number): string
export function formatNumber(x?: number, d?: number): string

// Rating utilities
export interface RatingModule {
  score(p?: number, n?: number): number
  rate(rating?: number[]): number
  average(rating?: number[]): number
  bayesianAverage(rating?: number[], prior?: number, priorMean?: number): number
  weightedRating(ratings?: Array<{ rating: number; timestamp: number }>, halfLife?: number): number
  viralScore(options?: { engagement?: number; rating?: number; ageInHours?: number; windowSize?: number }): number
}

export const rating: RatingModule
