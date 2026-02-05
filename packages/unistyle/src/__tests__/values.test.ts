import values from '../units/values'

describe('values', () => {
  it('returns first non-null value converted', () => {
    expect(values([undefined, null, 16])).toBe('1rem')
  })

  it('returns first defined value', () => {
    expect(values([32, 16])).toBe('2rem')
  })

  it('handles array param by joining with spaces', () => {
    expect(values([[16, 32]])).toBe('1rem 2rem')
  })

  it('handles array param with mixed values', () => {
    expect(values([[0, 16, 0, 16]])).toBe('0 1rem 0 1rem')
  })

  it('returns null when all values are null/undefined', () => {
    expect(values([undefined, null])).toBeNull()
  })

  it('passes through string values', () => {
    expect(values(['50%'])).toBe('50%')
  })

  it('uses custom rootSize', () => {
    expect(values([20], 10)).toBe('2rem')
  })
})
