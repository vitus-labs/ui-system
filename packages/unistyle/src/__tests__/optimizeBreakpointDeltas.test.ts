import { describe, expect, it } from 'vitest'
import { optimizeBreakpointDeltas } from '../responsive/optimizeBreakpointDeltas'

/** Trim + collapse internal whitespace for stable comparisons. */
const norm = (s: string) => s.trim().replace(/\s+/g, ' ')

describe('optimizeBreakpointDeltas', () => {
  describe('passthrough', () => {
    it('returns input unchanged when only one breakpoint', () => {
      expect(optimizeBreakpointDeltas(['color: red;'])).toEqual(['color: red;'])
    })

    it('returns input unchanged when empty', () => {
      expect(optimizeBreakpointDeltas([])).toEqual([])
    })

    it('preserves the first breakpoint exactly (modulo canonical formatting)', () => {
      const [base] = optimizeBreakpointDeltas([
        'color: red; padding: 0;',
        'color: red;',
      ])
      expect(norm(base!)).toBe('color: red; padding: 0;')
    })
  })

  describe('declaration deltas', () => {
    it('drops declarations whose value matches the cascade', () => {
      const [, sm] = optimizeBreakpointDeltas([
        'color: red; padding: 0;',
        'color: red; padding: 1rem;',
      ])
      expect(norm(sm!)).toBe('padding: 1rem;')
    })

    it('emits a declaration when its value differs from the cascade', () => {
      const [, sm] = optimizeBreakpointDeltas(['color: red;', 'color: blue;'])
      expect(norm(sm!)).toBe('color: blue;')
    })

    it('updates the cascade so a later breakpoint only emits new deltas', () => {
      const [, sm, md] = optimizeBreakpointDeltas([
        'color: red;',
        'color: blue;',
        'color: blue;', // matches sm now → drop
      ])
      expect(norm(sm!)).toBe('color: blue;')
      expect(md).toBe('')
    })

    it('handles values containing colons (URLs, pseudo-args)', () => {
      const [, sm] = optimizeBreakpointDeltas([
        'background: url(http://example.com/a.png);',
        'background: url(http://example.com/b.png);',
      ])
      expect(norm(sm!)).toBe('background: url(http://example.com/b.png);')
    })

    it('handles values containing commas inside parens', () => {
      const [, sm] = optimizeBreakpointDeltas([
        'background: linear-gradient(red 0%, blue 100%);',
        'background: linear-gradient(red 0%, blue 100%);',
      ])
      expect(sm).toBe('')
    })

    it('handles values containing quoted semicolons', () => {
      const [, sm] = optimizeBreakpointDeltas([
        'content: ";";',
        'content: ";";',
      ])
      expect(sm).toBe('')
    })

    it('does not trip on malformed empty declarations', () => {
      const [first] = optimizeBreakpointDeltas(['color: red;;;', 'color: red;'])
      expect(norm(first!)).toContain('color: red;')
    })

    it('preserves declarations whose prop or value would be empty after trim', () => {
      // ":foo;" → empty prop (colonIdx = 0), "bar:;" → empty value.
      // Neither parses as a declaration; both pass through as opaque so
      // a future cascade pass doesn't accidentally drop them.
      const [out] = optimizeBreakpointDeltas([
        ':foo; bar:;',
        'color: red;', // second arg keeps us out of the length<=1 fast path
      ])
      expect(norm(out!)).toContain(':foo;')
      expect(norm(out!)).toContain('bar:;')
    })

    it('handles escaped characters inside quoted strings', () => {
      // The backslash in `content: "\""` must not end the quote prematurely.
      const [, sm] = optimizeBreakpointDeltas([
        'content: "\\"";',
        'content: "\\"";',
      ])
      expect(sm).toBe('')
    })

    it('keeps unbalanced trailing input as opaque (malformed CSS guard)', () => {
      // Missing closing brace — the trailing segment lives at depth > 0 and
      // must survive intact rather than be dropped.
      const [out] = optimizeBreakpointDeltas([
        'color: red; &:hover { color: blue;',
        'color: red;',
      ])
      expect(out).toContain('color: red')
      expect(out).toContain('&:hover')
      expect(out).toContain('color: blue')
    })
  })

  describe('opaque blocks (nested selectors / at-rules)', () => {
    it('keeps a nested block when not previously seen', () => {
      const [base] = optimizeBreakpointDeltas([
        'color: red; &:hover { color: blue; }',
      ])
      expect(norm(base!)).toContain('&:hover { color: blue; }')
    })

    it('dedupes a nested block by exact text match', () => {
      const [, sm] = optimizeBreakpointDeltas([
        '&:hover { color: blue; }',
        '&:hover { color: blue; }',
      ])
      expect(sm).toBe('')
    })

    it('keeps a nested block whose body changes', () => {
      const [, sm] = optimizeBreakpointDeltas([
        '&:hover { color: blue; }',
        '&:hover { color: green; }',
      ])
      expect(norm(sm!)).toContain('&:hover { color: green; }')
    })

    it('mixes declarations and blocks correctly', () => {
      const [base, sm] = optimizeBreakpointDeltas([
        'color: red; &:hover { color: blue; } padding: 0;',
        'color: red; &:hover { color: blue; } padding: 1rem;',
      ])
      expect(norm(base!)).toContain('color: red;')
      expect(norm(base!)).toContain('&:hover { color: blue; }')
      expect(norm(base!)).toContain('padding: 0;')
      expect(norm(sm!)).toBe('padding: 1rem;')
    })
  })

  describe("user's responsive Wrapper sample (mobile-first cascade)", () => {
    it('reproduces the expected delta output for the reported case', () => {
      // Same shape the user reported (re-ordered mobile-first).
      const xs = [
        'position: absolute;',
        'bottom: -4.375rem;',
        'right: -12.5rem;',
        'height: 28.75rem;',
      ].join(' ')
      const sm = [
        'position: absolute;',
        'bottom: -4.375rem;',
        'right: -11.25rem;',
        'height: 28.75rem;',
      ].join(' ')
      const md = [
        'position: absolute;',
        'bottom: 0px;',
        'right: -11.25rem;',
        'height: 40rem;',
      ].join(' ')
      const lg = [
        'position: absolute;',
        'bottom: 0px;',
        'right: -6.25rem;',
        'height: 40rem;',
      ].join(' ')
      const xl = [
        'position: absolute;',
        'bottom: 0px;',
        'left: 55%;',
        'right: initial;',
        'height: 40rem;',
      ].join(' ')

      const [outXs, outSm, outMd, outLg, outXl] = optimizeBreakpointDeltas([
        xs,
        sm,
        md,
        lg,
        xl,
      ])

      // xs gets everything (it's the base)
      expect(norm(outXs!)).toContain('position: absolute;')
      expect(norm(outXs!)).toContain('bottom: -4.375rem;')
      expect(norm(outXs!)).toContain('right: -12.5rem;')
      expect(norm(outXs!)).toContain('height: 28.75rem;')

      // sm only changes `right`
      expect(norm(outSm!)).toBe('right: -11.25rem;')

      // md changes `bottom` and `height` (right unchanged from sm)
      expect(norm(outMd!)).toBe('bottom: 0px; height: 40rem;')

      // lg only changes `right`
      expect(norm(outLg!)).toBe('right: -6.25rem;')

      // xl introduces `left`, resets `right`, no other changes
      expect(norm(outXl!)).toBe('left: 55%; right: initial;')
    })
  })
})
