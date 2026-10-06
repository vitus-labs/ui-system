import { describe, expect, it } from 'vitest'
import createMediaQueries from '~/createMediaQueries'
import { css } from '~/css'
import { parseCSS } from '~/parse'

describe('nested dynamic css', () => {
  it('resolves a nested css result that has its own dynamics', () => {
    const inner = css`width: ${(p: any) => p.size}px;`
    const outer = css`${inner} color: red;`
    expect(outer.dynamics.length).toBeGreaterThan(0)
    expect(outer.resolve({ size: 20 })).toEqual({ width: 20, color: 'red' })
    expect(outer.resolve({ size: 30 })).toEqual({ width: 30, color: 'red' })
  })

  it('treats arrays containing dynamic css as dynamic', () => {
    const inner = css`height: ${(p: any) => p.h}px;`
    const outer = css`${[inner]} color: blue;`
    expect(outer.resolve({ h: 5 })).toEqual({ height: 5, color: 'blue' })
  })

  it('keeps nested static css static', () => {
    const outer = css`${css`width: 1px;`} color: red;`
    expect(outer.dynamics).toEqual([])
    expect(outer.resolve({})).toEqual({ width: 1, color: 'red' })
  })

  it('breakpoint results register as dynamic', () => {
    const bp = createMediaQueries({
      breakpoints: { xs: 0, md: 100 },
      rootSize: 16,
      css,
    })
    const result = bp.md`width: 10px;`
    expect(result.dynamics.length).toBeGreaterThan(0)
    expect(css`${result} color: red;`.dynamics.length).toBeGreaterThan(0)
  })
})

describe('parseCSS regressions', () => {
  it('strips block and line comments', () => {
    expect(parseCSS('/* c */ width:10px; // x\n height:5px')).toEqual({
      width: 10,
      height: 5,
    })
  })

  it('does not treat // inside url() as a comment', () => {
    expect(
      parseCSS('background-image: url(http://x.com/a.png); width: 1px'),
    ).toEqual({ backgroundImage: 'url(http://x.com/a.png)', width: 1 })
  })

  it('does not split on ; inside parens or quotes', () => {
    expect(
      parseCSS('background-image: url(data:image/png;base64,AAA); color: red'),
    ).toEqual({
      backgroundImage: 'url(data:image/png;base64,AAA)',
      color: 'red',
    })
    expect(parseCSS('content: "a;b"; color: red')).toEqual({
      content: '"a;b"',
      color: 'red',
    })
  })

  it('keeps font-weight as a string', () => {
    expect(parseCSS('font-weight: 700; line-height: 20px')).toEqual({
      fontWeight: '700',
      lineHeight: 20,
    })
  })
})
