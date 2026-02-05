import transformTheme from '../responsive/transformTheme'

const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl']

describe('transformTheme', () => {
  it('transforms scalar values to first breakpoint', () => {
    const theme = { fontSize: 16, color: 'red' }
    const result = transformTheme({ theme, breakpoints })
    expect(result).toEqual({
      xs: { fontSize: 16, color: 'red' },
    })
  })

  it('transforms array values to breakpoint keys', () => {
    const theme = { fontSize: [12, 14, 16] }
    const result = transformTheme({ theme, breakpoints })
    expect(result).toEqual({
      xs: { fontSize: 12 },
      sm: { fontSize: 14 },
      md: { fontSize: 16 },
    })
  })

  it('transforms object values to breakpoint keys', () => {
    const theme = { fontSize: { xs: 12, md: 16 } }
    const result = transformTheme({ theme, breakpoints })
    expect(result).toEqual({
      xs: { fontSize: 12 },
      md: { fontSize: 16 },
    })
  })

  it('combines multiple properties', () => {
    const theme = { fontSize: 16, padding: [4, 8] }
    const result = transformTheme({ theme, breakpoints })
    expect(result).toEqual({
      xs: { fontSize: 16, padding: 4 },
      sm: { padding: 8 },
    })
  })

  it('skips null values', () => {
    const theme = { fontSize: null, color: 'red' }
    const result = transformTheme({ theme, breakpoints })
    expect(result).toEqual({
      xs: { color: 'red' },
    })
  })

  it('returns empty object for empty theme', () => {
    expect(transformTheme({ theme: {}, breakpoints })).toEqual({})
  })

  it('returns empty object for empty breakpoints', () => {
    expect(transformTheme({ theme: { fontSize: 16 }, breakpoints: [] })).toEqual({})
  })

  it('filters out unexpected breakpoint keys from objects', () => {
    const theme = { fontSize: { xs: 12, nonexistent: 99 } }
    const result = transformTheme({ theme, breakpoints })
    expect(result).toEqual({
      xs: { fontSize: 12 },
    })
  })
})
