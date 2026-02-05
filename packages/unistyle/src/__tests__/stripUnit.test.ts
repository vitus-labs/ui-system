import stripUnit from '../units/stripUnit'

describe('stripUnit', () => {
  it('strips px unit and returns number', () => {
    expect(stripUnit('16px')).toBe(16)
  })

  it('strips rem unit and returns number', () => {
    expect(stripUnit('1.5rem')).toBe(1.5)
  })

  it('strips % and returns number', () => {
    expect(stripUnit('50%')).toBe(50)
  })

  it('returns number as-is', () => {
    expect(stripUnit(42)).toBe(42)
  })

  it('returns 0 for "0"', () => {
    expect(stripUnit('0')).toBe(0)
  })

  it('returns string as-is for non-CSS strings', () => {
    expect(stripUnit('auto')).toBe('auto')
  })

  describe('with unitReturn=true', () => {
    it('returns [value, unit] tuple for px', () => {
      expect(stripUnit('16px', true)).toEqual([16, 'px'])
    })

    it('returns [value, unit] tuple for rem', () => {
      expect(stripUnit('2rem', true)).toEqual([2, 'rem'])
    })

    it('returns [value, unit] tuple for %', () => {
      expect(stripUnit('100%', true)).toEqual([100, '%'])
    })

    it('returns [number, undefined] for plain numbers', () => {
      expect(stripUnit(42, true)).toEqual([42, undefined])
    })

    it('returns [string, undefined] for non-CSS strings', () => {
      expect(stripUnit('auto', true)).toEqual(['auto', undefined])
    })

    it('handles decimal values', () => {
      expect(stripUnit('1.5em', true)).toEqual([1.5, 'em'])
    })
  })
})
