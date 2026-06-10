import { describe, expect, it } from 'vitest'
import { css } from '~/css'

describe('css', () => {
  describe('static path', () => {
    it('parses static CSS template', () => {
      const result = css`
        width: 100px;
        height: 50px;
      `

      expect(result.__brand).toBe('vl.native.css')
      expect(result.dynamics).toEqual([])
      expect(result.resolve({})).toEqual({ width: 100, height: 50 })
    })

    it('resolves static interpolations', () => {
      const size = 200
      const result = css`
        width: ${size}px;
      `

      expect(result.dynamics).toEqual([])
      expect(result.resolve({})).toEqual({ width: 200 })
    })

    it('returns same object on every resolve call', () => {
      const result = css`
        width: 100px;
      `
      expect(result.resolve({})).toBe(result.resolve({ anything: true }))
    })
  })

  describe('dynamic path', () => {
    it('resolves functions with props', () => {
      const result = css`
        width: ${(props: any) => props.size}px;
      `

      expect(result.dynamics.length).toBe(1)
      expect(result.resolve({ size: 100 })).toEqual({ width: 100 })
      expect(result.resolve({ size: 200 })).toEqual({ width: 200 })
    })

    it('handles mixed static and dynamic interpolations', () => {
      const result = css`
        width: 100px;
        height: ${(props: any) => props.h}px;
        color: red;
      `

      expect(result.resolve({ h: 50 })).toEqual({
        width: 100,
        height: 50,
        color: 'red',
      })
    })
  })

  describe('nested css results', () => {
    it('resolves nested static css', () => {
      const inner = css`
        color: red;
      `
      const outer = css`
        width: 100px;
        ${inner};
      `

      expect(outer.resolve({})).toEqual({ width: 100, color: 'red' })
    })
  })

  // Regression: arrays of interpolations (the per-breakpoint output shape of
  // unistyle's makeItResponsive — [CSSResult, '', CSSResult, …]) previously
  // fell through to the object branch and stringified to "0: [object Object]".
  describe('array interpolations (makeItResponsive output)', () => {
    it('flattens an array of CSSResults and skips falsy entries', () => {
      const a = css`color: red;`
      const b = css`width: 100px;`
      const result = css`${[a, '', b, false, null, undefined]}`
      expect(result.resolve({})).toEqual({ color: 'red', width: 100 })
    })

    it('flattens arrays returned from a function interpolation', () => {
      const a = css`color: blue;`
      const result = css`${() => [a]}`
      expect(result.resolve({})).toEqual({ color: 'blue' })
    })

    it('later array entries override earlier ones (breakpoint cascade)', () => {
      const base = css`color: red;`
      const override = css`color: blue;`
      const result = css`${[base, override]}`
      expect(result.resolve({})).toEqual({ color: 'blue' })
    })
  })

  describe('edge cases', () => {
    it('handles null/undefined/boolean interpolations', () => {
      const result = css`
        width: 100px;
        ${null};
        ${undefined};
        ${false};
      `

      expect(result.resolve({})).toEqual({ width: 100 })
    })

    it('handles object interpolations', () => {
      const result = css`
        ${{ color: 'blue' }};
      `

      expect(result.resolve({})).toEqual({ color: 'blue' })
    })

    it('handles multi-key object interpolations (exercises join branch)', () => {
      // Multi-key input forces the `result += '; ' + …` branch in
      // `styleObjectToString` (the single-key case only hits the first
      // assignment). Without this, the second branch stays uncovered.
      const result = css`
        ${{ color: 'blue', width: '10px', padding: '4px' }};
      `

      expect(result.resolve({})).toEqual({
        color: 'blue',
        width: 10,
        padding: 4,
      })
    })

    it('handles true boolean interpolation', () => {
      const result = css`
        width: 100px;
        ${true};
      `

      expect(result.resolve({})).toEqual({ width: 100 })
    })

    it('handles number interpolation', () => {
      const result = css`
        width: ${42}px;
      `

      expect(result.resolve({})).toEqual({ width: 42 })
    })
  })

  describe('dynamic cache hit', () => {
    it('returns cached result for identical resolved CSS text', () => {
      const result = css`
        width: ${(props: any) => props.w}px;
      `
      const r1 = result.resolve({ w: 100 })
      const r2 = result.resolve({ w: 100 })
      // Same CSS text → cache hit → same object reference
      expect(r1).toBe(r2)
    })
  })

  describe('dynamic cache eviction', () => {
    it('keeps resolving correctly when the cache exceeds 100 entries', () => {
      const result = css`
        width: ${(props: any) => props.w}px;
      `

      // Fill the cache beyond 100 entries
      for (let i = 0; i < 105; i++) {
        result.resolve({ w: i })
      }

      // After exceeding 100, the oldest ~10% were evicted and new entries
      // added — verify it still works correctly
      const output = result.resolve({ w: 999 })
      expect(output).toEqual({ width: 999 })
    })

    // Regression: eviction used to `clear()` the WHOLE cache, throwing away
    // hot recent entries. Now only the oldest ~10% are dropped. The internal
    // Map isn't exported, so cache hits are observed via object identity of
    // resolve() output (same approach as the 'dynamic cache hit' test).
    it('retains recent entries after eviction (only oldest ~10% dropped)', () => {
      const result = css`
        width: ${(props: any) => props.w}px;
      `

      // Fill to 101 entries (w: 0..100) — eviction triggers on the NEXT miss
      const oldest = result.resolve({ w: 0 })
      for (let i = 1; i <= 100; i++) {
        result.resolve({ w: i })
      }
      const recent = result.resolve({ w: 100 }) // cache hit during fill

      // 102nd distinct entry → size 101 > 100 → evicts the oldest ~10%
      result.resolve({ w: 101 })

      // A recent entry survived eviction → same object reference (cache hit)
      expect(result.resolve({ w: 100 })).toBe(recent)
      // The oldest entry was evicted → re-parsed into a fresh object
      expect(result.resolve({ w: 0 })).not.toBe(oldest)
      expect(result.resolve({ w: 0 })).toEqual({ width: 0 })
    })
  })
})
