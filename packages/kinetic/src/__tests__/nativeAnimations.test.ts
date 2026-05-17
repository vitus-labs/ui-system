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

const { buildAnimatedStyle } = await import('~/nativeAnimations')

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
