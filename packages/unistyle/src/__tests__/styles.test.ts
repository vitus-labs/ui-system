import { config } from '@vitus-labs/core'
import styles from '../styles/styles'

const { css } = config

describe('styles', () => {
  it('returns css output for simple properties', () => {
    const result = styles({
      theme: { display: 'flex', color: 'red' } as any,
      css,
      rootSize: 16,
    })
    expect(result).toBeDefined()
    const flat = Array.isArray(result) ? result.flat().join('') : String(result)
    expect(flat).toContain('display: flex')
    expect(flat).toContain('color: red')
  })

  // Regression: borderCollapse was declared in ITheme but had no propertyMap
  // descriptor, so it type-checked yet emitted nothing. Lock in that it now
  // produces CSS.
  it('emits border-collapse (was typed but unmapped)', () => {
    const result = styles({
      theme: { borderCollapse: 'collapse' } as any,
      css,
      rootSize: 16,
    })
    const flat = Array.isArray(result) ? result.flat().join('') : String(result)
    expect(flat).toContain('border-collapse: collapse')
  })

  it('converts number values to rem', () => {
    const result = styles({
      theme: { fontSize: 16 } as any,
      css,
      rootSize: 16,
    })
    const flat = Array.isArray(result) ? result.flat().join('') : String(result)
    expect(flat).toContain('font-size: 1rem')
  })

  it('handles margin edge shorthand', () => {
    const result = styles({
      theme: { margin: 16 } as any,
      css,
      rootSize: 16,
    })
    const flat = Array.isArray(result) ? result.flat().join('') : String(result)
    expect(flat).toContain('margin: 1rem')
  })

  it('handles border-radius shorthand', () => {
    const result = styles({
      theme: { borderRadius: 8 } as any,
      css,
      rootSize: 16,
    })
    const flat = Array.isArray(result) ? result.flat().join('') : String(result)
    expect(flat).toContain('border-radius: 0.5rem')
  })

  it('handles fullScreen special', () => {
    const result = styles({
      theme: { fullScreen: true } as any,
      css,
      rootSize: 16,
    })
    const flat = Array.isArray(result) ? result.flat().join('') : String(result)
    expect(flat).toContain('position: fixed')
  })

  it('handles empty theme', () => {
    const result = styles({
      theme: {} as any,
      css,
      rootSize: 16,
    })
    expect(result).toBeDefined()
  })

  it('handles convert_fallback with size', () => {
    const result = styles({
      theme: { size: 100 } as any,
      css,
      rootSize: 16,
    })
    const flat = Array.isArray(result) ? result.flat().join('') : String(result)
    // size maps to both width and height via convert_fallback
    expect(flat).toContain('width')
    expect(flat).toContain('height')
  })

  it('handles backgroundImage special', () => {
    const result = styles({
      theme: { backgroundImage: 'test.png' } as any,
      css,
      rootSize: 16,
    })
    const flat = Array.isArray(result) ? result.flat().join('') : String(result)
    expect(flat).toContain('background-image')
    expect(flat).toContain('url(')
  })

  it('handles animation special', () => {
    const result = styles({
      theme: { keyframe: 'fadeIn', animation: '1s ease' } as any,
      css,
      rootSize: 16,
    })
    const flat = Array.isArray(result) ? result.flat().join('') : String(result)
    expect(flat).toContain('animation: fadeIn 1s ease')
  })

  it('handles hideEmpty special', () => {
    const result = styles({
      theme: { hideEmpty: true } as any,
      css,
      rootSize: 16,
    })
    const flat = Array.isArray(result) ? result.flat().join('') : String(result)
    expect(flat).toContain(':empty')
  })

  it('handles clearFix special', () => {
    const result = styles({
      theme: { clearFix: true } as any,
      css,
      rootSize: 16,
    })
    const flat = Array.isArray(result) ? result.flat().join('') : String(result)
    expect(flat).toContain('::after')
  })

  it('handles extendCss special', () => {
    const result = styles({
      theme: { extendCss: 'custom: value;' } as any,
      css,
      rootSize: 16,
    })
    const flat = Array.isArray(result) ? result.flat().join('') : String(result)
    expect(flat).toContain('custom: value')
  })

  // T1.2: theme-typo detector — silent style failure was a credibility tax.
  describe('dev-only unknown theme key warning', () => {
    it('warns once when a theme key has no propertyMap descriptor', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
      try {
        // `paddng` is an obvious typo — used to render nothing silently.
        // Using a fresh key string each test to avoid the once-warned cache
        // from a prior test masking this assertion.
        styles({ theme: { __mistypedKeyA__: 8 } as any, css, rootSize: 16 })
        expect(warn).toHaveBeenCalledTimes(1)
        expect(warn.mock.calls[0]?.[0]).toContain('__mistypedKeyA__')

        // Second call with the same key should NOT re-warn (rate-limited).
        styles({ theme: { __mistypedKeyA__: 8 } as any, css, rootSize: 16 })
        expect(warn).toHaveBeenCalledTimes(1)
      } finally {
        warn.mockRestore()
      }
    })

    it('does NOT warn for valid theme keys', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
      try {
        styles({
          theme: { padding: 8, color: 'red', display: 'flex' } as any,
          css,
          rootSize: 16,
        })
        expect(warn).not.toHaveBeenCalled()
      } finally {
        warn.mockRestore()
      }
    })
  })

  const flatten = (theme: Record<string, unknown>) => {
    const result = styles({ theme: theme as any, css, rootSize: 16 })
    return Array.isArray(result) ? result.flat().join('') : String(result)
  }

  it('keeps unitless properties unconverted', () => {
    const flat = flatten({
      gridColumnStart: 2,
      gridColumnEnd: 3,
      order: 2,
      zIndex: 10,
      flexGrow: 1,
      lineHeight: 1.5,
    })
    expect(flat).toContain('grid-column-start: 2;')
    expect(flat).toContain('grid-column-end: 3;')
    expect(flat).toContain('order: 2;')
    expect(flat).toContain('z-index: 10;')
    expect(flat).toContain('flex-grow: 1;')
    expect(flat).toContain('line-height: 1.5;')
  })

  it('converts numeric length properties to rem', () => {
    const flat = flatten({
      flexBasis: 160,
      letterSpacing: 16,
      wordSpacing: 8,
      textIndent: 32,
      outlineOffset: 16,
      outlineWidth: 16,
      columnWidth: 160,
      perspective: 160,
    })
    expect(flat).toContain('flex-basis: 10rem;')
    expect(flat).toContain('letter-spacing: 1rem;')
    expect(flat).toContain('word-spacing: 0.5rem;')
    expect(flat).toContain('text-indent: 2rem;')
    expect(flat).toContain('outline-offset: 1rem;')
    expect(flat).toContain('outline-width: 1rem;')
    expect(flat).toContain('column-width: 10rem;')
    expect(flat).toContain('perspective: 10rem;')
  })

  it('passes keyword and percentage length values through unchanged', () => {
    const flat = flatten({ flexBasis: 'auto', textIndent: '50%' })
    expect(flat).toContain('flex-basis: auto;')
    expect(flat).toContain('text-indent: 50%;')
  })
})
