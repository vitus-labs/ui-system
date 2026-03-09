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
    it('clears resolveCache when it exceeds 100 entries', () => {
      const result = css`
        width: ${(props: any) => props.w}px;
      `

      // Fill the cache beyond 100 entries
      for (let i = 0; i < 105; i++) {
        result.resolve({ w: i })
      }

      // After exceeding 100, the cache was cleared and new entries added
      // Verify it still works correctly
      const output = result.resolve({ w: 999 })
      expect(output).toEqual({ width: 999 })
    })
  })
})
