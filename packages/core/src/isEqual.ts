/**
 * Order-independent deep equality for plain objects, arrays, and primitives.
 * Handles null, undefined, nested structures, and circular references via
 * cycle detection. Does not handle Date, RegExp, Map, Set — not needed for
 * theme/props comparison.
 */

const isArrayEqual = (
  a: unknown[],
  b: unknown[],
  seen: WeakMap<object, object>,
): boolean => {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    if (!isEqualInner(a[i], b[i], seen)) return false
  }
  return true
}

const isObjectEqual = (
  a: Record<string, unknown>,
  b: Record<string, unknown>,
  seen: WeakMap<object, object>,
): boolean => {
  const aKeys = Object.keys(a)
  if (aKeys.length !== Object.keys(b).length) return false

  for (const key of aKeys) {
    if (!Object.hasOwn(b, key)) return false
    if (!isEqualInner(a[key], b[key], seen)) return false
  }
  return true
}

const isEqualInner = (
  a: unknown,
  b: unknown,
  seen: WeakMap<object, object>,
): boolean => {
  if (Object.is(a, b)) return true
  if (
    typeof a !== typeof b ||
    a == null ||
    b == null ||
    typeof a !== 'object'
  ) {
    return false
  }

  // Cycle detection: if we're already comparing this `a` against this `b`,
  // treat it as equal — the in-progress walk will return false at any
  // genuinely differing leaf. Without this, self-referential objects
  // (`o.x = o`) or mutually-referential pairs (`a.b = b; b.a = a`) blow
  // the stack — observed in the wild when callers pass props that include
  // React internals (fiber owners, refs) through `useStableValue`.
  const aObj = a as object
  if (seen.get(aObj) === b) return true
  seen.set(aObj, b as object)

  if (Array.isArray(a)) {
    return Array.isArray(b) && isArrayEqual(a, b as unknown[], seen)
  }

  if (Array.isArray(b)) return false

  return isObjectEqual(
    a as Record<string, unknown>,
    b as Record<string, unknown>,
    seen,
  )
}

const isEqual = (a: unknown, b: unknown): boolean =>
  isEqualInner(a, b, new WeakMap())

export default isEqual
