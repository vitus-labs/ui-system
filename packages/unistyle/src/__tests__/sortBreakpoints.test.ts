import sortBreakpoints from '../responsive/sortBreakpoints'

describe('sortBreakpoints', () => {
  it('sorts breakpoints by value ascending', () => {
    const breakpoints = { md: 768, xs: 0, xl: 1200, sm: 576 }
    expect(sortBreakpoints(breakpoints)).toEqual(['xs', 'sm', 'md', 'xl'])
  })

  it('handles already sorted breakpoints', () => {
    const breakpoints = { xs: 0, sm: 576, md: 768 }
    expect(sortBreakpoints(breakpoints)).toEqual(['xs', 'sm', 'md'])
  })

  it('handles single breakpoint', () => {
    expect(sortBreakpoints({ xs: 0 })).toEqual(['xs'])
  })

  it('handles empty object', () => {
    expect(sortBreakpoints({})).toEqual([])
  })

  it('sorts full breakpoint set', () => {
    const breakpoints = { xxl: 1440, xs: 0, sm: 576, md: 768, lg: 992, xl: 1200 }
    expect(sortBreakpoints(breakpoints)).toEqual([
      'xs', 'sm', 'md', 'lg', 'xl', 'xxl',
    ])
  })
})
