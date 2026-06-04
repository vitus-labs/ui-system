/**
 * Order-independent deep equality for plain objects, arrays, and primitives.
 * Handles null, undefined, nested structures, and circular references via
 * cycle detection. Does not handle Date, RegExp, Map, Set — not needed for
 * theme/props comparison.
 */

type Seen = WeakMap<object, WeakSet<object>>

const isArrayEqual = (a: unknown[], b: unknown[], seen: Seen): boolean => {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    if (!isEqualInner(a[i], b[i], seen)) return false
  }
  return true
}

const isObjectEqual = (
  a: Record<string, unknown>,
  b: Record<string, unknown>,
  seen: Seen,
): boolean => {
  const aKeys = Object.keys(a)
  if (aKeys.length !== Object.keys(b).length) return false

  for (const key of aKeys) {
    if (!Object.hasOwn(b, key)) return false
    if (!isEqualInner(a[key], b[key], seen)) return false
  }
  return true
}

const isEqualInner = (a: unknown, b: unknown, seen: Seen): boolean => {
  if (Object.is(a, b)) return true
  if (
    typeof a !== typeof b ||
    a == null ||
    b == null ||
    typeof a !== 'object'
  ) {
    return false
  }

  // Cycle detection: if we're already comparing this `(a, b)` pair, treat
  // it as equal — the in-progress walk will return false at any genuinely
  // differing leaf. WeakMap<a, WeakSet<b>> tracks every `b` we've started
  // comparing each `a` against, so asymmetric cycles (e.g. `a.next = a` vs
  // `b1.next = b2; b2.next = b1`) terminate cleanly.
  //
  // Without this, real consumer code triggers stack overflow — observed
  // when props include React internals (fiber owners, refs back to
  // elements) or context-shaped back-references, passed through
  // `useStableValue` in attrs/coolgrid/core.
  const aObj = a as object
  const bObj = b as object
  let bSet = seen.get(aObj)
  if (bSet !== undefined) {
    if (bSet.has(bObj)) return true
    bSet.add(bObj)
  } else {
    bSet = new WeakSet()
    bSet.add(bObj)
    seen.set(aObj, bSet)
  }

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
