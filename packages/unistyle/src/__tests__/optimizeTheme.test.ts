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

  it('skips breakpoint when current is undefined/falsy', () => {
    // When theme[key] is undefined, the `current &&` check fails -> skip
    const theme = {
      xs: { fontSize: 12 },
      sm: undefined as any,
      md: { fontSize: 16 },
    }
    const result = optimizeTheme({ theme, breakpoints })
    expect(result).toEqual({
      xs: { fontSize: 12 },
      md: { fontSize: 16 },
    })
    // sm is skipped because current is falsy
    expect(result).not.toHaveProperty('sm')
  })

  it('keeps breakpoint when previous is undefined but current exists', () => {
    // shallowEqual(undefined, current) should return false since !a is true
    const theme: Record<string, Record<string, unknown>> = {
      xs: { a: 1 },
      sm: undefined as any,
      md: { a: 2 },
    }
    const result = optimizeTheme({ theme, breakpoints })
    // md is kept because previous (sm) is undefined, shallowEqual(undefined, {a:2}) = false
    expect(result.md).toEqual({ a: 2 })
  })

  it('handles identical reference objects across breakpoints', () => {
    const shared = { fontSize: 16 }
    const theme = {
      xs: shared,
      sm: shared,
      md: shared,
    }
    const result = optimizeTheme({ theme, breakpoints })
    // shallowEqual(shared, shared) => true (a === b), so only xs is kept
    expect(result).toEqual({ xs: { fontSize: 16 } })
  })
})
