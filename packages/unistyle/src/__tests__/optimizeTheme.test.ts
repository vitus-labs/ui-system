import optimizeTheme from '../responsive/optimizeTheme'

const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl']

describe('optimizeTheme', () => {
  it('always includes first breakpoint', () => {
    const theme = {
      xs: { fontSize: 16 },
      sm: { fontSize: 16 },
      md: { fontSize: 16 },
    }
    const result = optimizeTheme({ theme, breakpoints })
    expect(result).toEqual({ xs: { fontSize: 16 } })
  })

  it('keeps breakpoints that differ from previous', () => {
    const theme = {
      xs: { fontSize: 12 },
      sm: { fontSize: 12 },
      md: { fontSize: 16 },
      lg: { fontSize: 16 },
      xl: { fontSize: 20 },
    }
    const result = optimizeTheme({ theme, breakpoints })
    expect(result).toEqual({
      xs: { fontSize: 12 },
      md: { fontSize: 16 },
      xl: { fontSize: 20 },
    })
  })

  it('handles all different values', () => {
    const theme = {
      xs: { a: 1 },
      sm: { a: 2 },
      md: { a: 3 },
    }
    const result = optimizeTheme({ theme, breakpoints })
    expect(result).toEqual({
      xs: { a: 1 },
      sm: { a: 2 },
      md: { a: 3 },
    })
  })

  it('handles empty theme entries', () => {
    const theme = {
      xs: {},
      sm: {},
      md: { fontSize: 16 },
    }
    const result = optimizeTheme({ theme, breakpoints })
    expect(result).toEqual({
      xs: {},
      md: { fontSize: 16 },
    })
  })

  it('handles undefined breakpoint entries', () => {
    const theme = {
      xs: { fontSize: 12 },
    }
    const result = optimizeTheme({ theme, breakpoints })
    expect(result).toEqual({
      xs: { fontSize: 12 },
      sm: undefined, // differs from xs because undefined !== {fontSize: 12}
    })
  })
})
