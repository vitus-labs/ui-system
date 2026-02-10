/**
 * Order-independent deep equality for plain objects, arrays, and primitives.
 * Handles null, undefined, nested structures. Does not handle Date, RegExp,
 * Map, Set, or circular references — not needed for theme/props comparison.
 */
const isEqual = (a: unknown, b: unknown): boolean => {
  if (Object.is(a, b)) return true
  if (
    typeof a !== typeof b ||
    a == null ||
    b == null ||
    typeof a !== 'object'
  ) {
    return false
  }

  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) {
      if (!isEqual(a[i], b[i])) return false
    }
    return true
  }

  if (Array.isArray(b)) return false

  const aObj = a as Record<string, unknown>
  const bObj = b as Record<string, unknown>
  const aKeys = Object.keys(aObj)
  const bKeys = Object.keys(bObj)

  if (aKeys.length !== bKeys.length) return false

  for (const key of aKeys) {
    if (!Object.prototype.hasOwnProperty.call(bObj, key)) return false
    if (!isEqual(aObj[key], bObj[key])) return false
  }

  return true
}

export default isEqual
