import { describe, expect, it } from 'vitest'
import { css } from '../css'
import { CSSResult } from '../resolve'

describe('css', () => {
  it('returns a CSSResult instance', () => {
    const result = css`color: red;`
    expect(result).toBeInstanceOf(CSSResult)
  })

  it('captures template strings', () => {
    const result = css`color: red;`
    expect(result.strings[0]).toBe('color: red;')
  })

  it('captures interpolation values', () => {
    const color = 'blue'
    const result = css`color: ${color};`
    expect(result.values).toEqual(['blue'])
  })

  it('captures function interpolations without calling them', () => {
    const fn = () => 'red'
    const result = css`color: ${fn};`
    expect(result.values[0]).toBe(fn)
    expect(typeof result.values[0]).toBe('function')
  })

  it('works when called as a regular function (createMediaQueries pattern)', () => {
    // createMediaQueries calls css(...args) where args come from another tagged template
    const strings = Object.assign(['color: ', ';'], {
      raw: ['color: ', ';'],
    }) as TemplateStringsArray
    const result = css(strings, 'red')
    expect(result).toBeInstanceOf(CSSResult)
    expect(result.values).toEqual(['red'])
  })

  it('supports nesting css results', () => {
    const inner = css`color: red;`
    const outer = css`${inner} display: flex;`
    expect(outer.values[0]).toBeInstanceOf(CSSResult)
  })
})
