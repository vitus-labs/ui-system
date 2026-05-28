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

  // Multi-value box shorthands — RN has no `padding: 8px 16px`, so they expand
  // into longhands per CSS box-model rules (previously parsed to first value).
  describe('multi-value box shorthands', () => {
    it('expands 2-value padding (vertical / horizontal)', () => {
      expect(parseCSS('padding: 8px 16px')).toEqual({
        paddingTop: 8,
        paddingRight: 16,
        paddingBottom: 8,
        paddingLeft: 16,
      })
    })

    it('expands 3-value margin (top / horizontal / bottom)', () => {
      expect(parseCSS('margin: 4px 8px 12px')).toEqual({
        marginTop: 4,
        marginRight: 8,
        marginBottom: 12,
        marginLeft: 8,
      })
    })

    it('expands 4-value margin (top right bottom left)', () => {
      expect(parseCSS('margin: 1px 2px 3px 4px')).toEqual({
        marginTop: 1,
        marginRight: 2,
        marginBottom: 3,
        marginLeft: 4,
      })
    })

    it('keeps single-value shorthand as the shorthand prop (RN supports it)', () => {
      expect(parseCSS('padding: 8px')).toEqual({ padding: 8 })
      expect(parseCSS('margin: 0')).toEqual({ margin: 0 })
    })

    it('supports `margin: 0 auto` (mixed numeric + keyword)', () => {
      expect(parseCSS('margin: 0 auto')).toEqual({
        marginTop: 0,
        marginRight: 'auto',
        marginBottom: 0,
        marginLeft: 'auto',
      })
    })

    it('expands inset (RN has no inset shorthand)', () => {
      expect(parseCSS('inset: 0 10px 20px 30px')).toEqual({
        top: 0,
        right: 10,
        bottom: 20,
        left: 30,
      })
    })

    it('expands border-width to per-side widths', () => {
      expect(parseCSS('border-width: 1px 2px')).toEqual({
        borderTopWidth: 1,
        borderRightWidth: 2,
        borderBottomWidth: 1,
        borderLeftWidth: 2,
      })
    })

    it('expands border-radius by corner (TL TR BR BL)', () => {
      expect(parseCSS('border-radius: 4px 8px 12px 16px')).toEqual({
        borderTopLeftRadius: 4,
        borderTopRightRadius: 8,
        borderBottomRightRadius: 12,
        borderBottomLeftRadius: 16,
      })
    })

    it('expands 2-value gap into rowGap / columnGap', () => {
      expect(parseCSS('gap: 8px 16px')).toEqual({ rowGap: 8, columnGap: 16 })
    })

    it('does not split function values like calc()', () => {
      // calc() contains spaces; must not be naively split
      expect(parseCSS('padding: calc(8px + 2px)')).toEqual({
        padding: 'calc(8px + 2px)',
      })
    })

    it('degrades elliptical border-radius to the horizontal radius', () => {
      // RN has no elliptical radii; `10px / 20px` isn't expanded (contains /)
      // and falls back to the single-value path → 10 applied to all corners.
      expect(parseCSS('border-radius: 10px / 20px')).toEqual({
        borderRadius: 10,
      })
    })

    it('does not expand non-box multi-value props (e.g. border)', () => {
      // `border: 1px solid red` is left as a string (RN ignores it); the
      // expander only targets numeric box shorthands.
      expect(parseCSS('border: 1px solid red')).toEqual({
        border: '1px solid red',
      })
    })
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
