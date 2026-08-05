/** Type detection utilities. */

const ob2Str = (val: any): string => {
  return {}.toString.call(val);
};

/** Check if value is a number. */
export const isNumber = (val: any): boolean => {
  return Number(val) === val;
};

/** Check if value is an integer. */
export const isInteger = (val: any): boolean => {
  return Number.isInteger(val);
};

/** Check if value is an array. */
export const isArray = (val: any): boolean => {
  return Array.isArray(val);
};

/** Check if value is a string. */
export const isString = (val: any): boolean => {
  return String(val) === val;
};

/** Check if value is a boolean. */
export const isBoolean = (val: any): boolean => {
  return Boolean(val) === val;
};

/** Check if value is null. */
export const isNull = (val: any): boolean => {
  return val === null;
};

/** Check if value is undefined. */
export const isUndefined = (val: any): boolean => {
  return val === undefined;
};

/** Check if value is null or undefined. */
export const isNil = (val: any): boolean => {
  return isUndefined(val) || isNull(val);
};

/** Check if value is a function. */
export const isFunction = (val: any): boolean => {
  return typeof val === "function";
};

/** Check if value is a plain object (not an array). */
export const isObject = (val: any): boolean => {
  return ob2Str(val) === "[object Object]" && !isArray(val);
};

/** Check if value is a valid date. */
export const isDate = (val: any): boolean => {
  return val instanceof Date && !isNaN(val.valueOf());
};

/** Check if value is a valid email address. */
export const isEmail = (val: any): boolean => {
  const re =
    /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  return isString(val) && re.test(val);
};

/** Check if value is empty (null, undefined, empty string, empty array, or empty object). */
export const isEmpty = (val: any): boolean => {
  return !val || isNil(val) ||
    (isString(val) && val === "") ||
    (isArray(val) && val.length === 0) ||
    (isObject(val) && Object.keys(val).length === 0);
};

/** Check if an object has an own property. */
export const hasProperty = (obj: any, prop: string): boolean => {
  return Object.prototype.hasOwnProperty.call(obj, prop);
};

/** Check if a string is a valid URL with HTTP or HTTPS protocol. */
export const isValidUrl = (url = ""): boolean => {
  try {
    const parsed = new URL(url);
    return parsed !== null && !!parsed.protocol &&
      (parsed.protocol === "http:" || parsed.protocol === "https:");
  } catch {
    return false;
  }
};

/** Check if a URL string is absolute (starts with http://, https://, or //). */
export const isAbsoluteUrl = (url = ""): boolean => {
  const u = String(url);
  return u.startsWith("https://") || u.startsWith("http://") ||
    u.startsWith("//");
};
