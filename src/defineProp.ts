/** Property definition utility. */

interface DefinePropConfig {
  writable?: boolean;
  configurable?: boolean;
  enumerable?: boolean;
}

/** Defines a non-writable, non-configurable, non-enumerable property by default. */
export const defineProp = (
  ob: object,
  key: string,
  val: any,
  config: DefinePropConfig = {},
): void => {
  const {
    writable = false,
    configurable = false,
    enumerable = false,
  } = config;
  Object.defineProperty(ob, key, {
    value: val,
    writable,
    configurable,
    enumerable,
  });
};
