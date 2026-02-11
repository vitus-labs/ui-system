import { config } from '@vitus-labs/core'
import makeItResponsive from '../responsive/makeItResponsive'
import realStyles from '../styles/styles'

const { css } = config

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

  it('theme with pseudo-state objects (hover/active) still produces height CSS', () => {
    // Exact $rocketstyle from user's Button component
    const buttonTheme = {
      transition: 'all .15s ease-in-out',
      border: 'none',
      backgroundColor: '#06B6D4',
      textDecoration: 'none',
      outline: 'none',
      padding: 0,
      margin: 0,
      color: '#F8F8F8',
      userSelect: 'none',
      hover: {
        color: '#F8F8F8',
        backgroundColor: '#0891B2',
        borderColor: '#0891B2',
      },
      active: {
        color: '#F8F8F8',
        backgroundColor: '#0E7490',
        borderColor: '#0E7490',
      },
      height: 48,
      fontSize: 16,
      paddingX: 24,
      borderRadius: 8,
      borderWidth: 1,
      borderStyle: 'solid',
      textAlign: 'center',
      marginTop: 64,
      borderColor: '#06B6D4',
    }

    const providerTheme = {
      rootSize: 16,
      breakpoints: { xs: 0, sm: 576, md: 768, lg: 992, xl: 1200 },
      __VITUS_LABS__: {
        sortedBreakpoints: ['xs', 'sm', 'md', 'lg', 'xl'],
        media: {
          xs: (...args: any[]) => (css as any)(...args),
          sm: (...args: any[]) =>
            css`@media (min-width: 36em) { ${(css as any)(...args)} }`,
          md: (...args: any[]) =>
            css`@media (min-width: 48em) { ${(css as any)(...args)} }`,
          lg: (...args: any[]) =>
            css`@media (min-width: 62em) { ${(css as any)(...args)} }`,
          xl: (...args: any[]) =>
            css`@media (min-width: 75em) { ${(css as any)(...args)} }`,
        },
      },
    }

    const fn = makeItResponsive({
      theme: buttonTheme,
      css,
      styles: realStyles,
    })
    const result = fn({ theme: providerTheme })

    // Flatten the result to a string
    const flat = Array.isArray(result)
      ? result.map((r: any) => String(r)).join(' ')
      : String(result)

    // height: 48 should produce height: 3rem (48/16)
    expect(flat).toContain('height: 3rem')
    // fontSize: 16 should produce font-size: 1rem (16/16)
    expect(flat).toContain('font-size: 1rem')
    // borderRadius: 8 should produce border-radius: 0.5rem
    expect(flat).toContain('border-radius: 0.5rem')
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
