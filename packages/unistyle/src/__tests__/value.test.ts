import value from '../units/value'

describe('value', () => {
  it('converts number to rem by default (web)', () => {
    expect(value(16)).toBe('1rem')
  })

  it('converts number to rem with default rootSize=16', () => {
    expect(value(32)).toBe('2rem')
    expect(value(8)).toBe('0.5rem')
  })

  it('converts with custom rootSize', () => {
    expect(value(20, 10)).toBe('2rem')
  })

  it('returns unitless 0 for zero', () => {
    expect(value(0)).toBe(0)
  })

  it('returns null for null/undefined', () => {
    expect(value(null)).toBeNull()
    expect(value(undefined)).toBeNull()
  })

  it('returns string with unit as-is', () => {
    expect(value('50%')).toBe('50%')
    expect(value('2em')).toBe('2em')
    expect(value('100vh')).toBe('100vh')
  })

  it('converts px string to rem', () => {
    expect(value('16px')).toBe('1rem')
    expect(value('32px')).toBe('2rem')
  })

  it('passes through non-numeric strings', () => {
    expect(value('auto')).toBe('auto')
  })

  it('converts to px when outputUnit is px', () => {
    expect(value(16, 16, 'px')).toBe('16px')
  })

  it('returns "0" string for string "0"', () => {
    expect(value('0')).toBe('0')
  })
})
