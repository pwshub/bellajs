/** Functional programming utilities: curry, compose, pipe. */

type AnyFunction = (...args: any[]) => any;

/** Curries a function, allowing partial application of arguments. */
export const curry = <F extends AnyFunction>(
  fn: F,
): (...args: any[]) => any => {
  const totalArguments = fn.length;

  const next = (argumentLength: number, rest: any[]): any => {
    if (argumentLength > 0) {
      return (...args: any[]): any => {
        return next(argumentLength - args.length, [...rest, ...args]);
      };
    }
    return fn(...rest);
  };

  return next(totalArguments, []);
};

/** Right-to-left function composition. */
export const compose = (...fns: ((arg: any) => any)[]): (arg: any) => any => {
  return fns.reduce((f, g) => (x: any) => f(g(x)));
};

/** Left-to-right function piping. */
export const pipe = (...fns: ((arg: any) => any)[]): (arg: any) => any => {
  return fns.reduce((f, g) => (x: any) => g(f(x)));
};
