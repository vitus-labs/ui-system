import { describe, expect, it } from 'vitest'
import { mergeStyles, parseCSS } from '~/parse'

describe('parseCSS', () => {
  it('converts kebab-case to camelCase', () => {
    expect(parseCSS('background-color: red')).toEqual({
      backgroundColor: 'red',
    })
  })

  it('strips px suffix and returns number', () => {
    expect(parseCSS('width: 100px')).toEqual({ width: 100 })
  })

  it('converts plain numeric strings to numbers', () => {
    expect(parseCSS('flex: 1')).toEqual({ flex: 1 })
    expect(parseCSS('opacity: 0.5')).toEqual({ opacity: 0.5 })
  })

  it('handles negative numbers', () => {
    expect(parseCSS('margin-top: -10px')).toEqual({ marginTop: -10 })
    expect(parseCSS('z-index: -1')).toEqual({ zIndex: -1 })
  })

  it('keeps non-numeric values as strings', () => {
    expect(parseCSS('display: flex')).toEqual({ display: 'flex' })
    expect(parseCSS('color: #ff0000')).toEqual({ color: '#ff0000' })
  })

  it('parses multiple declarations', () => {
    expect(
      parseCSS('width: 100px; height: 50px; background-color: blue'),
    ).toEqual({
      width: 100,
      height: 50,
      backgroundColor: 'blue',
    })
  })

  it('handles trailing semicolons', () => {
    expect(parseCSS('width: 100px;')).toEqual({ width: 100 })
  })

  it('handles empty/whitespace declarations gracefully', () => {
    expect(parseCSS('')).toEqual({})
    expect(parseCSS('  ;  ;  ')).toEqual({})
  })

  it('handles values containing colons', () => {
    // e.g. URLs — colon appears in value
    expect(parseCSS('content: url(http://example.com)')).toEqual({
      content: 'url(http://example.com)',
    })
  })

  it('trims whitespace around props and values', () => {
    expect(parseCSS('  padding  :  20px  ')).toEqual({ padding: 20 })
  })

  it('skips declarations with empty value', () => {
    // rawValue.trim() is empty → skip
    expect(parseCSS('width: ; height: 50px')).toEqual({ height: 50 })
  })

  it('handles non-numeric px values gracefully', () => {
    // NaN.parseFloat('autopx') returns NaN → falls through to string return
    expect(parseCSS('width: autopx')).toEqual({ width: 'autopx' })
  })
})

describe('mergeStyles', () => {
  it('merges multiple style objects', () => {
    expect(mergeStyles({ width: 10 }, { height: 20 })).toEqual({
      width: 10,
      height: 20,
    })
  })

  it('later values override earlier ones', () => {
    expect(mergeStyles({ width: 10 }, { width: 20 })).toEqual({ width: 20 })
  })

  it('skips falsy values', () => {
    expect(mergeStyles(null, undefined, false, { width: 10 })).toEqual({
      width: 10,
    })
  })

  it('flattens arrays', () => {
    expect(mergeStyles([{ width: 10 }, { height: 20 }])).toEqual({
      width: 10,
      height: 20,
    })
  })

  it('handles nested arrays', () => {
    expect(mergeStyles([[{ width: 10 }], { height: 20 }])).toEqual({
      width: 10,
      height: 20,
    })
  })

  it('returns empty object with no sources', () => {
    expect(mergeStyles()).toEqual({})
  })
})
