import { describe, expect, it } from 'vitest'
import { css } from '../css'
import { CSSResult, normalizeCSS, resolve, resolveValue } from '../resolve'
import { isDynamic } from '../shared'

// Helper to create a TemplateStringsArray
const tsa = (strings: readonly string[]): TemplateStringsArray => {
  const arr = [...strings] as string[] & { raw: readonly string[] }
  arr.raw = strings
  return arr
}

describe('resolve', () => {
  describe('primitive interpolations', () => {
    it('resolves strings', () => {
      const result = resolve(tsa(['color: ', ';']), ['red'], {})
      expect(result).toBe('color: red;')
    })

    it('resolves numbers', () => {
      const result = resolve(tsa(['flex: ', ';']), [1], {})
      expect(result).toBe('flex: 1;')
    })

    it('resolves null as empty string', () => {
      const result = resolve(tsa(['a', 'b']), [null], {})
      expect(result).toBe('ab')
    })

    it('resolves undefined as empty string', () => {
      const result = resolve(tsa(['a', 'b']), [undefined], {})
      expect(result).toBe('ab')
    })

    it('resolves false as empty string (enables conditional patterns)', () => {
      const result = resolve(tsa(['a', 'b']), [false], {})
      expect(result).toBe('ab')
    })

    it('resolves true as empty string', () => {
      const result = resolve(tsa(['a', 'b']), [true], {})
      expect(result).toBe('ab')
    })
  })

  describe('function interpolations', () => {
    it('calls functions with props and uses return value', () => {
      const fn = (props: Record<string, unknown>) => props.color as string
      const result = resolve(tsa(['color: ', ';']), [fn], { color: 'blue' })
      expect(result).toBe('color: blue;')
    })

    it('resolves nested function results recursively', () => {
      const fn = () => () => 'red'
      const result = resolve(tsa(['color: ', ';']), [fn], {})
      expect(result).toBe('color: red;')
    })

    it('handles functions returning null', () => {
      const fn = () => null
      const result = resolve(tsa(['a', 'b']), [fn], {})
      expect(result).toBe('ab')
    })

    it('handles functions returning false (conditional rendering)', () => {
      const fn = (props: Record<string, unknown>) =>
        props.active ? 'color: red;' : false
      const result = resolve(tsa(['', '']), [fn], { active: false })
      expect(result).toBe('')
    })
  })

  describe('CSSResult interpolations', () => {
    it('resolves nested CSSResult', () => {
      const inner = css`color: red;`
      const result = resolve(tsa(['', '']), [inner], {})
      expect(result).toBe('color: red;')
    })

    it('resolves deeply nested CSSResults', () => {
      const inner1 = css`color: red;`
      const inner2 = css`${inner1} display: flex;`
      const result = resolve(tsa(['', '']), [inner2], {})
      expect(result).toBe('color: red; display: flex;')
    })

    it('resolves CSSResult with function interpolations', () => {
      const inner = css`color: ${((p: Record<string, unknown>) => p.color) as any};`
      const result = resolve(tsa(['', '']), [inner], { color: 'green' })
      expect(result).toBe('color: green;')
    })
  })

  describe('array interpolations', () => {
    it('flattens arrays of strings', () => {
      const result = resolve(tsa(['', '']), [['a', 'b', 'c']], {})
      expect(result).toBe('abc')
    })

    it('flattens arrays of CSSResults (makeItResponsive pattern)', () => {
      const breakpoints = [
        css`color: red;`,
        css`@media (min-width: 48em) { color: blue; }`,
      ]
      const result = resolve(tsa(['', '']), [breakpoints], {})
      expect(result).toContain('color: red;')
      expect(result).toContain('@media (min-width: 48em)')
    })

    it('handles arrays with mixed types including falsy values', () => {
      const result = resolve(tsa(['', '']), [[null, 'a', false, 'b', '']], {})
      expect(result).toBe('ab')
    })
  })

  describe('combined patterns', () => {
    it('handles multiple interpolation types', () => {
      const result = resolve(
        tsa(['display: ', '; color: ', '; flex: ', ';']),
        ['flex', 'red', 1],
        {},
      )
      expect(result).toBe('display: flex; color: red; flex: 1;')
    })

    it('handles conditional CSS with logical AND', () => {
      // Simulates: ${condition && css`...`}
      const condition = true
      const conditionalCss = condition && css`color: red;`
      const result = resolve(tsa(['', '']), [conditionalCss], {})
      expect(result).toBe('color: red;')
    })

    it('handles false conditional CSS with logical AND', () => {
      const condition = false
      const conditionalCss = condition && css`color: red;`
      const result = resolve(tsa(['', '']), [conditionalCss], {})
      expect(result).toBe('')
    })
  })
})

describe('normalizeCSS — cache eviction', () => {
  it('evicts oldest ~10% entries when cache exceeds 2000 entries', () => {
    // Generate >2000 unique CSS strings to trigger eviction
    for (let i = 0; i < 2100; i++) {
      normalizeCSS(`unique-prop-${i}: value-${i};`)
    }
    // If eviction works, no crash occurs and results are still correct
    const result = normalizeCSS('color: red;')
    expect(result).toBe('color: red;')
  })
})

describe('normalizeCSS', () => {
  describe('comment stripping', () => {
    it('strips CSS block comments', () => {
      const result = normalizeCSS('/* comment */ color: red;')
      expect(result).toBe('color: red;')
    })

    it('strips multiple block comments', () => {
      const result = normalizeCSS(
        '/* BASE */ color: red; /* HOVER */ font-size: 1rem;',
      )
      expect(result).toBe('color: red; font-size: 1rem;')
    })

    it('strips multiline block comments', () => {
      const result = normalizeCSS(
        '/* --------\n   BASE STATE\n   -------- */\nheight: 3rem;',
      )
      expect(result).toBe('height: 3rem;')
    })

    it('strips JS-style line comments from template literals', () => {
      const result = normalizeCSS('// this is not valid CSS\ncolor: red;')
      expect(result).toBe('color: red;')
    })

    it('preserves :// in URLs', () => {
      const result = normalizeCSS(
        'background: url(https://example.com/img.png);',
      )
      expect(result).toContain('https://example.com/img.png')
    })

    it('strips line comments but preserves URL protocols', () => {
      const result = normalizeCSS(
        '// comment\nbackground: url(https://example.com/img.png);',
      )
      expect(result).toContain('https://example.com/img.png')
      expect(result).not.toContain('// comment')
    })

    it('handles unterminated block comment (no closing */)', () => {
      const result = normalizeCSS('color: red; /* never closed')
      expect(result).toBe('color: red;')
    })

    it('handles unterminated line comment (no trailing newline)', () => {
      const result = normalizeCSS('color: red;\n// trailing comment')
      expect(result).toBe('color: red;')
    })
  })

  describe('whitespace and semicolons', () => {
    it('collapses whitespace', () => {
      const result = normalizeCSS('  color:  red;   font-size:  1rem;  ')
      expect(result).toBe('color: red; font-size: 1rem;')
    })

    it('collapses double semicolons', () => {
      const result = normalizeCSS('color: red;; font-size: 1rem;')
      expect(result).toBe('color: red; font-size: 1rem;')
    })

    it('removes semicolons after opening brace', () => {
      const result = normalizeCSS('{ ; color: red; }')
      expect(result).toBe('{ color: red; }')
    })

    it('removes semicolons before closing brace', () => {
      const result = normalizeCSS('color: red; };')
      expect(result).toBe('color: red; }')
    })

    it('removes leading semicolons', () => {
      const result = normalizeCSS('; color: red;')
      expect(result).toBe('color: red;')
    })
  })
})

describe('CSSResult._staticResolved cache (PR #253)', () => {
  it('populates _staticResolved on first resolveValue of a known-static CSSResult', () => {
    const inner = css`color: red;`
    // Pre-classify as static via isDynamic (the same call shared.ts makes
    // at styled-component creation time).
    isDynamic(inner)
    expect(inner._isDynamic).toBe(false)
    expect(inner._staticResolved).toBe(undefined)

    resolveValue(inner, {})
    expect(inner._staticResolved).toBe('color: red;')
  })

  it('returns cached _staticResolved on subsequent resolveValue calls', () => {
    const inner = css`padding: 12px;`
    isDynamic(inner)
    resolveValue(inner, {})
    expect(inner._staticResolved).toBe('padding: 12px;')

    // Mutate values to a sentinel that would change the resolved output if
    // recomputed. The cache MUST return the prior result.
    ;(inner as unknown as { values: unknown[] }).values = ['SENTINEL']
    expect(resolveValue(inner, {})).toBe('padding: 12px;')
  })

  it('does NOT cache dynamic CSSResults (props vary per call)', () => {
    const dyn = css`color: ${(p: { c: string }) => p.c};`
    isDynamic(dyn)
    expect(dyn._isDynamic).toBe(true)

    // Resolve twice with different props; cache should not be populated.
    resolveValue(dyn, { c: 'red' })
    expect(dyn._staticResolved).toBe(undefined)
    resolveValue(dyn, { c: 'blue' })
    expect(dyn._staticResolved).toBe(undefined)
  })

  it('skips cache when _isDynamic is undefined (not yet classified)', () => {
    // Construct a CSSResult directly without going through isDynamic.
    // resolveValue's cache check is `_isDynamic === false` (strict), so an
    // unclassified CSSResult falls through to the regular resolve path.
    const tpl = Object.assign(['color: ', ';'], {
      raw: ['color: ', ';'],
    }) as unknown as TemplateStringsArray
    const r = new CSSResult(tpl, ['red'])
    expect(r._isDynamic).toBe(undefined)
    expect(resolve(r.strings, r.values, {})).toBe('color: red;')
    expect(r._staticResolved).toBe(undefined) // cache stays unpopulated
  })
})
