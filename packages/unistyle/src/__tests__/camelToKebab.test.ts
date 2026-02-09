import camelToKebab from '../styles/styles/camelToKebab'

describe('camelToKebab', () => {
  it('converts camelCase to kebab-case', () => {
    expect(camelToKebab('fontSize')).toBe('font-size')
    expect(camelToKebab('backgroundColor')).toBe('background-color')
    expect(camelToKebab('borderTopLeftRadius')).toBe('border-top-left-radius')
  })

  it('returns lowercase string unchanged', () => {
    expect(camelToKebab('color')).toBe('color')
    expect(camelToKebab('display')).toBe('display')
  })

  it('handles empty string', () => {
    expect(camelToKebab('')).toBe('')
  })

  it('handles single uppercase letter', () => {
    expect(camelToKebab('X')).toBe('-x')
  })
})
