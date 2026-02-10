import { css } from '@vitus-labs/styler'
import makeItResponsive from '../responsive/makeItResponsive'

describe('makeItResponsive', () => {
  const mockStyles = ({ theme, css: cssFn }: any) => {
    const parts: string[] = []
    if (theme.color) parts.push(`color: ${theme.color};`)
    if (theme.fontSize) parts.push(`font-size: ${theme.fontSize}px;`)
    return cssFn`${parts.join(' ')}`
  }

  describe('without breakpoints', () => {
    it('returns empty string for empty theme', () => {
      const fn = makeItResponsive({
        key: '$test',
        css,
        styles: mockStyles,
      })
      const result = fn({ theme: {} })
      expect(result).toBe('')
    })

    it('renders plain CSS when no breakpoints', () => {
      const fn = makeItResponsive({
        key: '$test',
        css,
        styles: mockStyles,
      })
      const result = fn({
        theme: {},
        $test: { color: 'red' },
      })
      expect(result).toBeDefined()
      const flat = Array.isArray(result)
        ? result.flat().join('')
        : String(result)
      expect(flat).toContain('color: red')
    })
  })

  describe('with breakpoints', () => {
    const theme = {
      rootSize: 16,
      breakpoints: { xs: 0, md: 768 },
      __VITUS_LABS__: {
        sortedBreakpoints: ['xs', 'md'],
        media: {
          xs: (...args: any[]) => (css as any)(...args),
          md: (...args: any[]) =>
            css`@media (min-width: 48em) { ${(css as any)(...args)} }`,
        },
      },
    }

    it('generates responsive styles', () => {
      const fn = makeItResponsive({
        key: '$test',
        css,
        styles: mockStyles,
        normalize: true,
      })
      const result = fn({
        theme,
        $test: { color: 'red' },
      })
      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
    })

    it('handles responsive object values', () => {
      const fn = makeItResponsive({
        key: '$test',
        css,
        styles: mockStyles,
        normalize: true,
      })
      const result = fn({
        theme,
        $test: { color: { xs: 'red', md: 'blue' } },
      })
      expect(result).toBeDefined()
    })
  })

  describe('with custom theme prop', () => {
    it('uses custom theme instead of key', () => {
      const fn = makeItResponsive({
        theme: { color: 'green' },
        css,
        styles: mockStyles,
      })
      const result = fn({ theme: {} })
      expect(result).toBeDefined()
      const flat = Array.isArray(result)
        ? result.flat().join('')
        : String(result)
      expect(flat).toContain('color: green')
    })
  })

  it('returns empty when media is undefined in breakpoint map', () => {
    const fn = makeItResponsive({
      key: '$test',
      css,
      styles: mockStyles,
      normalize: true,
    })
    const result = fn({
      theme: {
        rootSize: 16,
        breakpoints: { xs: 0 },
        __VITUS_LABS__: {
          sortedBreakpoints: ['xs'],
          media: undefined,
        },
      },
      $test: { color: 'red' },
    })
    // Should return array with empty string since media is undefined
    expect(Array.isArray(result)).toBe(true)
  })
})
