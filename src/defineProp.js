/**
 * Defines a property on an object with configurable options.
 * By default, the property is non-writable, non-configurable, and non-enumerable.
 *
 * @param {Object} ob - The object to define the property on.
 * @param {string} key - The name of the property to define.
 * @param {*} val - The value of the property.
 * @param {Object} [config={}] - Configuration options for the property.
 * @param {boolean} [config.writable=false] - Whether the property can be changed.
 * @param {boolean} [config.configurable=false] - Whether the property can be deleted or reconfigured.
 * @param {boolean} [config.enumerable=false] - Whether the property shows up in loops like for...in.
 */
export const defineProp = (ob, key, val, config = {}) => {
  const {
    writable = false,
    configurable = false,
    enumerable = false,
  } = config
  Object.defineProperty(ob, key, {
    value: val,
    writable,
    configurable,
    enumerable,
  })
}
