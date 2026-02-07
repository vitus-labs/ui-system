import borderRadius from '../styles/shorthands/borderRadius'

describe('borderRadius', () => {
  const br = borderRadius(16)

  it('returns null when all values are null/undefined', () => {
    expect(
      br({
        full: undefined,
        top: undefined,
        bottom: undefined,
        left: undefined,
        right: undefined,
        topLeft: undefined,
        topRight: undefined,
        bottomLeft: undefined,
        bottomRight: undefined,
      }),
    ).toBeNull()
  })

  describe('full shorthand', () => {
    it('generates single value when all corners are same', () => {
      const result = br({
        full: 8,
        top: undefined,
        bottom: undefined,
        left: undefined,
        right: undefined,
        topLeft: undefined,
        topRight: undefined,
        bottomLeft: undefined,
        bottomRight: undefined,
      })
      expect(result).toBe('border-radius: 0.5rem;')
    })

    it('generates two value shorthand', () => {
      const result = br({
        full: undefined,
        top: 8,
        bottom: 16,
        left: undefined,
        right: undefined,
        topLeft: undefined,
        topRight: undefined,
        bottomLeft: undefined,
        bottomRight: undefined,
      })
      // top sets topLeft=8 topRight=8, bottom sets bottomRight=16 bottomLeft=16
      // [8, 8, 16, 16] → tl=br check: 8===16? no. tr=bl check: 8===16? no
      expect(result).toBe('border-radius: 0.5rem 0.5rem 1rem 1rem;')
    })
  })

  describe('two value shorthand', () => {
    it('generates two values when diagonal pairs match', () => {
      const result = br({
        full: undefined,
        top: undefined,
        bottom: undefined,
        left: undefined,
        right: undefined,
        topLeft: 8,
        topRight: 16,
        bottomLeft: 16,
        bottomRight: 8,
      })
      // [8, 16, 8, 16] → tl===br (8===8) and tr===bl (16===16)
      expect(result).toBe('border-radius: 0.5rem 1rem;')
    })
  })

  describe('three value shorthand', () => {
    it('generates three values when tr === bl', () => {
      const result = br({
        full: undefined,
        top: undefined,
        bottom: undefined,
        left: undefined,
        right: undefined,
        topLeft: 8,
        topRight: 16,
        bottomLeft: 16,
        bottomRight: 24,
      })
      // [8, 16, 24, 16] → tr===bl (16===16), tl!==br
      expect(result).toBe('border-radius: 0.5rem 1rem 1.5rem;')
    })
  })

  describe('four value shorthand', () => {
    it('generates four values when all corners differ', () => {
      const result = br({
        full: undefined,
        top: undefined,
        bottom: undefined,
        left: undefined,
        right: undefined,
        topLeft: 4,
        topRight: 8,
        bottomLeft: 24,
        bottomRight: 16,
      })
      expect(result).toBe('border-radius: 0.25rem 0.5rem 1rem 1.5rem;')
    })
  })

  describe('individual corners', () => {
    it('generates individual corner properties when not all set', () => {
      const result = br({
        full: undefined,
        top: undefined,
        bottom: undefined,
        left: undefined,
        right: undefined,
        topLeft: 8,
        topRight: undefined,
        bottomLeft: undefined,
        bottomRight: undefined,
      })
      expect(result).toContain('border-top-left-radius: 0.5rem;')
    })

    it('generates multiple individual corners', () => {
      const result = br({
        full: undefined,
        top: undefined,
        bottom: undefined,
        left: undefined,
        right: undefined,
        topLeft: 8,
        topRight: undefined,
        bottomLeft: undefined,
        bottomRight: 16,
      })
      expect(result).toContain('border-top-left-radius: 0.5rem;')
      expect(result).toContain('border-bottom-right-radius: 1rem;')
    })
  })

  describe('overrides', () => {
    it('top overrides full for top corners', () => {
      const result = br({
        full: 8,
        top: 16,
        bottom: undefined,
        left: undefined,
        right: undefined,
        topLeft: undefined,
        topRight: undefined,
        bottomLeft: undefined,
        bottomRight: undefined,
      })
      // [16, 16, 8, 8] → tl=br? 16!==8. tr=bl? 16!==8
      expect(result).toBe('border-radius: 1rem 1rem 0.5rem 0.5rem;')
    })

    it('left overrides full for left corners', () => {
      const result = br({
        full: 8,
        top: undefined,
        bottom: undefined,
        left: 16,
        right: undefined,
        topLeft: undefined,
        topRight: undefined,
        bottomLeft: undefined,
        bottomRight: undefined,
      })
      // [16, 8, 8, 16] → tl=br? 16!==8. tr=bl? 8!==16
      expect(result).toBe('border-radius: 1rem 0.5rem 0.5rem 1rem;')
    })

    it('right overrides full for right corners', () => {
      const result = br({
        full: 8,
        top: undefined,
        bottom: undefined,
        left: undefined,
        right: 16,
        topLeft: undefined,
        topRight: undefined,
        bottomLeft: undefined,
        bottomRight: undefined,
      })
      // [8, 16, 16, 8] → tl=br? 8!==16. tr=bl? 16!==8
      expect(result).toBe('border-radius: 0.5rem 1rem 1rem 0.5rem;')
    })

    it('individual corner overrides group', () => {
      const result = br({
        full: 8,
        top: undefined,
        bottom: undefined,
        left: undefined,
        right: undefined,
        topLeft: 32,
        topRight: undefined,
        bottomLeft: undefined,
        bottomRight: undefined,
      })
      // [32, 8, 8, 8] → not all same
      expect(result).toBe('border-radius: 2rem 0.5rem 0.5rem;')
    })
  })

  describe('zero values', () => {
    it('handles zero as valid value', () => {
      const result = br({
        full: 0,
        top: undefined,
        bottom: undefined,
        left: undefined,
        right: undefined,
        topLeft: undefined,
        topRight: undefined,
        bottomLeft: undefined,
        bottomRight: undefined,
      })
      expect(result).toBe('border-radius: 0;')
    })
  })
})
