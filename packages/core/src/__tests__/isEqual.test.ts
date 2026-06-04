import isEqual from '~/isEqual'

describe('isEqual', () => {
  // Primitives
  it('should return true for identical primitives', () => {
    expect(isEqual(1, 1)).toBe(true)
    expect(isEqual('a', 'a')).toBe(true)
    expect(isEqual(true, true)).toBe(true)
  })

  it('should return false for different primitives', () => {
    expect(isEqual(1, 2)).toBe(false)
    expect(isEqual('a', 'b')).toBe(false)
    expect(isEqual(true, false)).toBe(false)
  })

  it('should handle NaN', () => {
    expect(isEqual(NaN, NaN)).toBe(true)
  })

  it('should distinguish 0 and -0', () => {
    expect(isEqual(0, -0)).toBe(false)
  })

  // Null / undefined
  it('should return true for null === null and undefined === undefined', () => {
    expect(isEqual(null, null)).toBe(true)
    expect(isEqual(undefined, undefined)).toBe(true)
  })

  it('should return false for null vs undefined', () => {
    expect(isEqual(null, undefined)).toBe(false)
  })

  it('should return false for null vs object', () => {
    expect(isEqual(null, {})).toBe(false)
    expect(isEqual({}, null)).toBe(false)
  })

  // Objects
  it('should return true for deeply equal objects', () => {
    expect(isEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true)
  })

  it('should return true regardless of key order', () => {
    expect(isEqual({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true)
  })

  it('should return false for objects with different values', () => {
    expect(isEqual({ a: 1 }, { a: 2 })).toBe(false)
  })

  it('should return false for objects with different keys', () => {
    expect(isEqual({ a: 1 }, { b: 1 })).toBe(false)
  })

  it('should return false for objects with different key counts', () => {
    expect(isEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false)
  })

  // Nested objects
  it('should deeply compare nested objects', () => {
    const a = { a: { b: { c: 1 } } }
    expect(isEqual(a, { a: { b: { c: 1 } } })).toBe(true)
    expect(isEqual(a, { a: { b: { c: 2 } } })).toBe(false)
  })

  it('should handle nested key order differences', () => {
    expect(
      isEqual({ x: { b: 2, a: 1 }, y: 3 }, { y: 3, x: { a: 1, b: 2 } }),
    ).toBe(true)
  })

  // Arrays
  it('should return true for identical arrays', () => {
    expect(isEqual([1, 2, 3], [1, 2, 3])).toBe(true)
  })

  it('should return false for arrays with different values', () => {
    expect(isEqual([1, 2], [1, 3])).toBe(false)
  })

  it('should return false for arrays with different lengths', () => {
    expect(isEqual([1, 2], [1, 2, 3])).toBe(false)
  })

  it('should not treat array and object as equal', () => {
    expect(isEqual([1], { 0: 1 })).toBe(false)
    expect(isEqual({ 0: 1 }, [1])).toBe(false)
  })

  // Mixed nested
  it('should deeply compare arrays of objects', () => {
    expect(isEqual([{ a: 1 }, { b: 2 }], [{ a: 1 }, { b: 2 }])).toBe(true)
    expect(isEqual([{ a: 1 }], [{ a: 2 }])).toBe(false)
  })

  it('should deeply compare objects with array values', () => {
    expect(isEqual({ a: [1, 2] }, { a: [1, 2] })).toBe(true)
    expect(isEqual({ a: [1, 2] }, { a: [1, 3] })).toBe(false)
  })

  // Same reference
  it('should return true for the same reference', () => {
    const obj = { a: 1 }
    expect(isEqual(obj, obj)).toBe(true)
  })

  // Type mismatches
  it('should return false for different types', () => {
    expect(isEqual(1, '1')).toBe(false)
    expect(isEqual([], {})).toBe(false)
    expect(isEqual(0, false)).toBe(false)
  })

  // Cycle detection — regression for "Maximum call stack size exceeded"
  // observed when consumer apps pass props with self/mutual references
  // (e.g. React internals: fiber owners, refs back to elements) through
  // `useStableValue`.
  it('handles self-referential objects without stack overflow', () => {
    const a: Record<string, unknown> = { x: 1 }
    a.self = a
    const b: Record<string, unknown> = { x: 1 }
    b.self = b
    expect(isEqual(a, b)).toBe(true)
  })

  it('handles mutually-referential object pairs', () => {
    const a1: Record<string, unknown> = {}
    const b1: Record<string, unknown> = {}
    a1.other = b1
    b1.other = a1
    const a2: Record<string, unknown> = {}
    const b2: Record<string, unknown> = {}
    a2.other = b2
    b2.other = a2
    expect(isEqual(a1, a2)).toBe(true)
  })

  it('still detects differences inside cyclic structures', () => {
    const a: Record<string, unknown> = { x: 1 }
    a.self = a
    const b: Record<string, unknown> = { x: 2 }
    b.self = b
    expect(isEqual(a, b)).toBe(false)
  })

  it('handles self-referential arrays', () => {
    const a: unknown[] = [1, 2]
    a.push(a)
    const b: unknown[] = [1, 2]
    b.push(b)
    expect(isEqual(a, b)).toBe(true)
  })

  // Asymmetric cycle — `a` cycles to itself; `b1` and `b2` cycle to each
  // other. Naive seen-by-`a`-only tracking overwrites between
  // `(a, b1)` and `(a, b2)` and infinite-recurses. Real consumer-side
  // graphs hit this (React internals back-refs, mutually-referential
  // contexts). We accept treating these as "equal" — structural
  // inequality in cyclic graphs is graph isomorphism (NP-hard); the
  // contract is "do not crash".
  it('handles asymmetric cycles without stack overflow', () => {
    const a: Record<string, unknown> = {}
    a.next = a
    const b1: Record<string, unknown> = {}
    const b2: Record<string, unknown> = {}
    b1.next = b2
    b2.next = b1
    expect(() => isEqual(a, b1)).not.toThrow()
  })

  it('handles long cyclic chains', () => {
    const head1: Record<string, unknown> = {}
    let cur1 = head1
    const head2: Record<string, unknown> = {}
    let cur2 = head2
    for (let i = 0; i < 50; i++) {
      const next1: Record<string, unknown> = { i }
      cur1.next = next1
      cur1 = next1
      const next2: Record<string, unknown> = { i }
      cur2.next = next2
      cur2 = next2
    }
    cur1.next = head1
    cur2.next = head2
    expect(isEqual(head1, head2)).toBe(true)
  })
})
