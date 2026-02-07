import extendCss from '../styles/extendCss'

describe('extendCss', () => {
  it('returns empty string for null', () => {
    expect(extendCss(null)).toBe('')
  })

  it('returns empty string for undefined', () => {
    expect(extendCss(undefined)).toBe('')
  })

  it('returns string as-is', () => {
    expect(extendCss('color: red;')).toBe('color: red;')
  })

  it('calls function with css and returns result', () => {
    const fn = (css: any) => css`color: blue;`
    const result = extendCss(fn)
    // styled-components css returns an array-like structure
    expect(result).toBeDefined()
  })

  it('returns empty string for empty string input', () => {
    expect(extendCss('')).toBe('')
  })
})
