/**
 * Pins `buildAnimatedStyle`'s transform-merge semantics — specifically
 * the behaviour that the O(n·m) `.find()`-in-loop → indexed-Map refactor
 * had to preserve:
 *
 *   - `.find()` returns the FIRST match, so when a transform string
 *     repeats a type (`translateX(10px) translateX(20px)`), the FIRST
 *     value must win. The Map index is built skip-if-present to keep
 *     this exact behaviour.
 *   - A type present only in `to` falls back to `TRANSFORM_IDENTITY`
 *     (or 0) for the `from` value, and vice-versa.
 *   - Equal from/to collapses to a static value (no interpolation).
 */
import { describe, expect, it, vi } from 'vitest'

// kinetic has no global react-native alias (connector-native does its
// own). `buildAnimatedStyle` only needs `Easing` at module load and a
// caller-supplied `progress.interpolate` at runtime — mock minimally.
vi.mock('react-native', () => ({
  Easing: {
    linear: (t: number) => t,
    ease: (t: number) => t,
    in: (fn: unknown) => fn,
    out: (fn: unknown) => fn,
    inOut: (fn: unknown) => fn,
    bezier: () => (t: number) => t,
  },
  Animated: {},
}))

const { buildAnimatedStyle, getPrimaryTransition, mergeStyles } = await import(
  '~/nativeAnimations'
)

// Fake Animated.Value — records the interpolation config so we can
// assert the from/to values picked per transform type.
const makeProgress = () =>
  ({
    interpolate: (cfg: { inputRange: number[]; outputRange: number[] }) =>
      `interp(${cfg.outputRange[0]}→${cfg.outputRange[1]})`,
  }) as any

describe('buildAnimatedStyle — transform merge', () => {
  it('interpolates a single transform per type', () => {
    const style = buildAnimatedStyle(
      makeProgress(),
      { transform: 'translateY(0px) scale(1)' },
      { transform: 'translateY(16px) scale(0.5)' },
    )
    expect(style.transform).toEqual([
      { translateY: 'interp(0→16)' },
      { scale: 'interp(1→0.5)' },
    ])
  })

  it('keeps the FIRST occurrence when a type repeats (find()-first parity)', () => {
    const style = buildAnimatedStyle(
      makeProgress(),
      { transform: 'translateX(10px) translateX(20px)' },
      { transform: 'translateX(99px)' },
    )
    // First `from` value (10) must win, NOT the last (20).
    expect(style.transform).toEqual([{ translateX: 'interp(10→99)' }])
  })

  it('falls back to identity (0) when a type is only in `to`', () => {
    const style = buildAnimatedStyle(
      makeProgress(),
      { transform: 'scale(1)' },
      { transform: 'scale(1) translateY(20px)' },
    )
    expect(style.transform).toContainEqual({ translateY: 'interp(0→20)' })
  })

  it('collapses equal from/to to a static value (no interpolation)', () => {
    const style = buildAnimatedStyle(
      makeProgress(),
      { transform: 'scale(1)' },
      { transform: 'scale(1)' },
    )
    expect(style.transform).toEqual([{ scale: 1 }])
  })
})

describe('buildAnimatedStyle — non-transform style path', () => {
  it('returns {} when both from and to are undefined', () => {
    expect(buildAnimatedStyle(makeProgress(), undefined, undefined)).toEqual({})
  })

  it('interpolates a numeric prop (opacity 0→1)', () => {
    const style = buildAnimatedStyle(
      makeProgress(),
      { opacity: 0 },
      { opacity: 1 },
    )
    expect(style.opacity).toBe('interp(0→1)')
  })

  it('collapses equal numeric props to a static value', () => {
    const style = buildAnimatedStyle(
      makeProgress(),
      { opacity: 0.5 },
      { opacity: 0.5 },
    )
    expect(style.opacity).toBe(0.5)
  })

  it('uses the from value when `to` is undefined (hits `to || {}`)', () => {
    const style = buildAnimatedStyle(
      makeProgress(),
      { backgroundColor: 'red' },
      undefined,
    )
    expect(style.backgroundColor).toBe('red')
  })

  it('uses the to value when `from` is undefined (hits `from || {}`)', () => {
    const style = buildAnimatedStyle(makeProgress(), undefined, {
      backgroundColor: 'blue',
    })
    expect(style.backgroundColor).toBe('blue')
  })

  it('handles a transform present only on `from` (hits `to.transform || ""`)', () => {
    const style = buildAnimatedStyle(
      makeProgress(),
      { transform: 'translateY(10px)' },
      undefined,
    )
    // to-side transform absent → identity 0; interpolates 10→0
    expect(style.transform).toEqual([{ translateY: 'interp(10→0)' }])
  })

  it('handles a transform present only on `to` (hits `from.transform || ""`)', () => {
    const style = buildAnimatedStyle(makeProgress(), undefined, {
      transform: 'scale(0.5)',
    })
    // from-side absent → identity for scale (1); interpolates 1→0.5
    expect(style.transform).toEqual([{ scale: 'interp(1→0.5)' }])
  })

  it('falls back to 0 for a transform type absent from TRANSFORM_IDENTITY', () => {
    // `skewX` is not in TRANSFORM_IDENTITY → `?? ... ?? 0` tail.
    const style = buildAnimatedStyle(
      makeProgress(),
      { transform: 'skewX(5)' },
      undefined,
    )
    expect(style.transform).toEqual([{ skewX: 'interp(5→0)' }])
  })
})

describe('getPrimaryTransition', () => {
  it('parses duration + resolves a known easing fn', () => {
    const { duration, easing } = getPrimaryTransition(
      'opacity 250ms ease-in-out',
    )
    expect(duration).toBe(250)
    expect(typeof easing).toBe('function')
  })

  it('defaults to 300ms/ease when transition is undefined', () => {
    const { duration, easing } = getPrimaryTransition(undefined)
    expect(duration).toBe(300)
    expect(typeof easing).toBe('function')
  })

  it('defaults to 300ms/ease when the string parses to no configs', () => {
    const { duration } = getPrimaryTransition('   ')
    expect(duration).toBe(300)
  })

  it('falls back to ease for an unknown easing name', () => {
    // `linethrough` is not a recognised easing token → toEasing fallback.
    const { easing } = getPrimaryTransition('opacity 100ms linethrough')
    expect(typeof easing).toBe('function')
  })
})

describe('mergeStyles', () => {
  it('returns undefined when both are undefined', () => {
    expect(mergeStyles(undefined, undefined)).toBeUndefined()
  })

  it('returns b when a is undefined', () => {
    expect(mergeStyles(undefined, { color: 'red' })).toEqual({ color: 'red' })
  })

  it('returns a when b is undefined', () => {
    expect(mergeStyles({ color: 'red' }, undefined)).toEqual({ color: 'red' })
  })

  it('shallow-merges with b winning on conflict', () => {
    expect(mergeStyles({ color: 'red', margin: 1 }, { color: 'blue' })).toEqual(
      { color: 'blue', margin: 1 },
    )
  })
})
