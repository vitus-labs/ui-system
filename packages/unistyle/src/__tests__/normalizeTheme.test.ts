import normalizeTheme from '../responsive/normalizeTheme'

const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl']

describe('normalizeTheme', () => {
  it('returns theme as-is when no normalization needed', () => {
    const theme = { fontSize: 16, color: 'red' }
    expect(normalizeTheme({ theme, breakpoints })).toEqual(theme)
  })

  it('normalizes array values to breakpoint keys', () => {
    const theme = { fontSize: [12, 14, 16] }
    const result = normalizeTheme({ theme, breakpoints })
    expect(result.fontSize).toEqual({
      xs: 12,
      sm: 14,
      md: 16,
      lg: 16, // fills with last value
      xl: 16,
    })
  })

  it('normalizes object values filling gaps with previous', () => {
    const theme = { fontSize: { xs: 12, md: 16 } }
    const result = normalizeTheme({ theme, breakpoints })
    expect(result.fontSize).toEqual({
      xs: 12,
      sm: 12, // inherits from xs
      md: 16,
      lg: 16, // inherits from md
      xl: 16,
    })
  })

  it('normalizes scalar values to all breakpoints', () => {
    const theme = { fontSize: 16, color: [12, 14] }
    const result = normalizeTheme({ theme, breakpoints })
    expect(result.fontSize).toEqual({
      xs: 16,
      sm: 16,
      md: 16,
      lg: 16,
      xl: 16,
    })
  })

  it('skips null/undefined values', () => {
    const theme = { fontSize: null, color: [12, 14] }
    const result = normalizeTheme({ theme, breakpoints })
    expect(result.fontSize).toBeUndefined()
  })

  it('handles zero values correctly with ??', () => {
    const theme = { gap: [0, 8, 16] }
    const result = normalizeTheme({ theme, breakpoints })
    expect(result.gap).toEqual({
      xs: 0,
      sm: 8,
      md: 16,
      lg: 16,
      xl: 16,
    })
  })

  it('handles object with zero values', () => {
    const theme = { padding: { xs: 0, md: 16 } }
    const result = normalizeTheme({ theme, breakpoints })
    expect(result.padding).toEqual({
      xs: 0,
      sm: 0,
      md: 16,
      lg: 16,
      xl: 16,
    })
  })
})
