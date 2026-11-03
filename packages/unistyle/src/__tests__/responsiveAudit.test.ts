/**
 * Regression tests for the 2026-11 unistyle audit — responsive pipeline
 * correctness (repro scripts turned into tests).
 */
import { config } from '@vitus-labs/core'
import createMediaQueries from '../responsive/createMediaQueries'
import makeItResponsive, {
  stringifyResult,
} from '../responsive/makeItResponsive'
import normalizeTheme from '../responsive/normalizeTheme'
import sortBreakpoints from '../responsive/sortBreakpoints'
import transformTheme from '../responsive/transformTheme'
import extendCss from '../styles/extendCss'

const { css } = config as any

const norm = (s: string) => s.trim().replace(/\s+/g, ' ')

/**
 * Engine-agnostic resolver for template results (`strings` + `values`),
 * arrays and function interpolations — resolves with REAL props, the way
 * the engine does at render time.
 */
const resolveWith = (v: any, props: Record<string, any>): string => {
  if (v == null || v === false || v === true) return ''
  if (typeof v === 'function') return resolveWith(v(props), props)
  if (Array.isArray(v)) return v.map((x) => resolveWith(x, props)).join('')
  if (typeof v === 'object' && 'strings' in v && Array.isArray(v.values)) {
    let out = ''
    for (let i = 0; i < v.strings.length; i++) {
      out += v.strings[i]
      if (i < v.values.length) out += resolveWith(v.values[i], props)
    }
    return out
  }
  return String(v)
}

const bps = { xs: 0, sm: 576, md: 768, lg: 992, xl: 1200 }
const makeOuter = (breakpoints: Record<string, number> = bps) => ({
  rootSize: 16,
  breakpoints,
  colors: { primary: 'tomato' },
  __VITUS_LABS__: {
    media: createMediaQueries({ breakpoints, rootSize: 16, css }),
    sortedBreakpoints: sortBreakpoints(breakpoints),
  },
})

// ─────────────────────────────────────────────────────────────────────
// Finding: function interpolations resolved with {} props (HIGH)
// ─────────────────────────────────────────────────────────────────────
describe('makeItResponsive — function interpolations keep real props', () => {
  const outer = makeOuter({ xs: 0, md: 768 })
  const stylesCb = ({ theme: t, css: c }: any) =>
    c`width: ${t.w}; ${extendCss(t.extraStyles)};`

  it('extendCss callback reading props.theme resolves at render time', () => {
    const R = makeItResponsive({ key: '$x', css, styles: stylesCb })
    const extra = (c: any) =>
      c`color: ${(p: any) => p.theme?.colors?.primary ?? 'MISSING'};`
    const out = R({
      theme: outer,
      $x: { w: { xs: 1, md: 2 }, extraStyles: extra },
    })
    const text = norm(resolveWith(out, { theme: outer }))
    expect(text).toContain('color: tomato')
    expect(text).not.toContain('MISSING')
    expect(text).toContain('width: 1')
    expect(text).toContain('width: 2')
  })

  it('a css result with a destructuring interpolation is not dropped', () => {
    const R = makeItResponsive({ key: '$x', css, styles: stylesCb })
    const extra = css`color: ${({ theme }: any) => theme.colors.primary};`
    let out: unknown
    expect(() => {
      out = R({ theme: outer, $x: { w: { xs: 3, md: 4 }, extraStyles: extra } })
    }).not.toThrow()
    const text = norm(resolveWith(out, { theme: outer }))
    expect(text).toContain('color: tomato')
  })

  it('a static css result as a theme value is not treated as a breakpoint map', () => {
    const R = makeItResponsive({ key: '$x', css, styles: stylesCb })
    const out = R({
      theme: outer,
      $x: { w: { xs: 1, md: 2 }, extraStyles: css`color: red;` },
    })
    const text = norm(resolveWith(out, { theme: outer }))
    expect(text).toContain('color: red')
  })

  it('static templates still go through the delta optimizer', () => {
    const R = makeItResponsive({ key: '$x', css, styles: stylesCb })
    const out = R({
      theme: outer,
      $x: { w: { xs: 1, md: 2 }, extraStyles: 'color: red;' },
    })
    const text = norm(resolveWith(out, { theme: outer }))
    // color: red emitted once (xs), not repeated inside the md media query
    expect(text.match(/color: red/g)).toHaveLength(1)
  })

  describe('stringifyResult per engine result shape', () => {
    it.each([
      ['nullish', null, ''],
      ['false', false, ''],
      ['string', 'color: red;', 'color: red;'],
    ])('%s → string', (_, input, expected) => {
      expect(stringifyResult(input)).toBe(expected)
    })

    it.each([
      // Emotion dynamic css → (props) => string
      ['function', () => 'color: red;'],
      // styled-components RuleSet — String() would join with commas
      ['string array', ['color: ', 'red', ';']],
      ['array with function', ['color: ', () => 'red', ';']],
      // Emotion SerializedStyles
      ['serialized styles', { name: 'abc', styles: 'color: red;' }],
      // connector-native CSSResult
      [
        'native result',
        { __brand: 'vl.native.css', statics: {}, dynamics: [], resolve() {} },
      ],
      ['array with object', ['color: red;', { a: 1 }]],
    ])('%s → null (unoptimized fallback)', (_, input) => {
      expect(stringifyResult(input)).toBeNull()
    })

    it('template result: static → string, function anywhere → null', () => {
      expect(stringifyResult(css`color: ${'red'};`)).toBe('color: red;')
      const nestedStatic = css`a: 1; ${css`b: ${2};`} ${['c: 3;']}`
      expect(norm(stringifyResult(nestedStatic) as string)).toBe(
        'a: 1; b: 2; c: 3;',
      )
      const deepFn = css`a: 1; ${[css`b: ${(p: any) => p.x};`]}`
      expect(stringifyResult(deepFn)).toBeNull()
      // memoized nested result answers consistently
      const shared = css`c: ${() => 1};`
      expect(stringifyResult(css`${shared}`)).toBeNull()
      expect(stringifyResult(css`${shared}`)).toBeNull()
    })
  })
})

// ─────────────────────────────────────────────────────────────────────
// Finding: cache keyed only by internal theme (MED)
// ─────────────────────────────────────────────────────────────────────
describe('makeItResponsive — cache is scoped per styles / normalize', () => {
  const outer = makeOuter({ xs: 0, md: 768 })

  it('two instances sharing one theme object keep their own output', () => {
    const A = makeItResponsive({
      key: '$a',
      css,
      styles: ({ theme: t, css: c }: any) => c`color: ${t.c};`,
    })
    const B = makeItResponsive({
      key: '$b',
      css,
      styles: ({ theme: t, css: c }: any) => c`background: ${t.c};`,
    })
    const shared = { c: { xs: 'red', md: 'blue' } }
    const a = norm(resolveWith(A({ theme: outer, $a: shared }), {}))
    const b = norm(resolveWith(B({ theme: outer, $b: shared }), {}))
    expect(a).toContain('color: red')
    expect(a).not.toContain('background')
    expect(b).toContain('background: red')
    expect(b).toContain('background: blue')
  })

  it('normalize flag is part of the cache key', () => {
    const stylesCb = ({ theme: t, css: c }: any) => c`w: ${t.w}; h: ${t.h};`
    const N1 = makeItResponsive({
      key: '$a',
      css,
      normalize: true,
      styles: stylesCb,
    })
    const N2 = makeItResponsive({
      key: '$a',
      css,
      normalize: false,
      styles: stylesCb,
    })
    const shared = { w: [1, 2], h: 5 }
    const n1 = norm(resolveWith(N1({ theme: outer, $a: shared }), {}))
    const n2 = norm(resolveWith(N2({ theme: outer, $a: shared }), {}))
    expect(n1).not.toBe(n2)
    // without normalize, md only gets `w` → `h` renders empty there
    expect(n2).toMatch(/h:\s*;/)
    expect(n1).not.toMatch(/h:\s*;/)
  })
})

// ─────────────────────────────────────────────────────────────────────
// Finding: array holes (MED) / missing rootSize (LOW)
// ─────────────────────────────────────────────────────────────────────
describe('normalizeTheme — array holes inherit the previous breakpoint', () => {
  const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl']

  it('[12, null, 15] → sm inherits xs', () => {
    expect(
      normalizeTheme({ theme: { p: [12, null, 15] }, breakpoints }),
    ).toEqual({
      p: { xs: 12, sm: 12, md: 15, lg: 15, xl: 15 },
    })
  })

  it('past the array end the last value carries forward', () => {
    expect(
      normalizeTheme({ theme: { p: [1, undefined] }, breakpoints }).p,
    ).toEqual({ xs: 1, sm: 1, md: 1, lg: 1, xl: 1 })
  })

  it('a leading hole has nothing to inherit', () => {
    expect(normalizeTheme({ theme: { p: [null, 4] }, breakpoints }).p).toEqual({
      xs: undefined,
      sm: 4,
      md: 4,
      lg: 4,
      xl: 4,
    })
  })

  it('non-plain objects are scalars in normalize + transform', () => {
    const result = css`color: red;`
    const n = normalizeTheme({ theme: { extendCss: result }, breakpoints })
    expect((n.extendCss as any).md).toBe(result)
    const t = transformTheme({ theme: { extendCss: result }, breakpoints })
    expect(t.xs.extendCss).toBe(result)
  })
})

describe('createMediaQueries — missing rootSize defaults to 16', () => {
  it('emits em values instead of NaNem', () => {
    const m = createMediaQueries({ breakpoints: { xs: 0, md: 768 }, css })
    const text = norm(resolveWith((m as any).md`color: red;`, {}))
    expect(text).toContain('min-width: 48em')
    expect(text).not.toContain('NaN')
  })
})
