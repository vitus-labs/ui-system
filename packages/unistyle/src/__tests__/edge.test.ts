import edge from '../styles/shorthands/edge'

describe('edge', () => {
  const shorthand = edge(16)

  it('returns null when all values are null/undefined', () => {
    expect(
      shorthand('margin', {
        full: undefined,
        x: undefined,
        y: undefined,
        top: undefined,
        left: undefined,
        bottom: undefined,
        right: undefined,
      }),
    ).toBeNull()
  })

  describe('full shorthand', () => {
    it('generates single value shorthand when all sides are same', () => {
      const result = shorthand('margin', {
        full: 16,
        x: undefined,
        y: undefined,
        top: undefined,
        left: undefined,
        bottom: undefined,
        right: undefined,
      })
      expect(result).toBe('margin: 1rem;')
    })

    it('generates two value shorthand when top/bottom and left/right match', () => {
      const result = shorthand('padding', {
        full: undefined,
        x: 16,
        y: 8,
        top: undefined,
        left: undefined,
        bottom: undefined,
        right: undefined,
      })
      expect(result).toBe('padding: 0.5rem 1rem;')
    })
  })

  describe('individual sides', () => {
    it('generates individual side properties when not all sides are set', () => {
      const result = shorthand('margin', {
        full: undefined,
        x: undefined,
        y: undefined,
        top: 16,
        left: undefined,
        bottom: undefined,
        right: undefined,
      })
      expect(result).toContain('margin-top: 1rem;')
    })

    it('handles x shorthand', () => {
      const result = shorthand('padding', {
        full: undefined,
        x: 32,
        y: undefined,
        top: undefined,
        left: undefined,
        bottom: undefined,
        right: undefined,
      })
      expect(result).toContain('padding-left: 2rem;')
      expect(result).toContain('padding-right: 2rem;')
    })

    it('handles y shorthand', () => {
      const result = shorthand('padding', {
        full: undefined,
        x: undefined,
        y: 8,
        top: undefined,
        left: undefined,
        bottom: undefined,
        right: undefined,
      })
      expect(result).toContain('padding-top: 0.5rem;')
      expect(result).toContain('padding-bottom: 0.5rem;')
    })
  })

  describe('three value shorthand', () => {
    it('generates three value shorthand when top differs from bottom', () => {
      const result = shorthand('margin', {
        full: undefined,
        x: 16,
        y: undefined,
        top: 8,
        left: undefined,
        bottom: 24,
        right: undefined,
      })
      expect(result).toBe('margin: 0.5rem 1rem 1.5rem;')
    })
  })

  describe('four value shorthand', () => {
    it('generates four value shorthand when all sides differ', () => {
      const result = shorthand('margin', {
        full: undefined,
        x: undefined,
        y: undefined,
        top: 8,
        right: 16,
        bottom: 24,
        left: 32,
      })
      expect(result).toBe('margin: 0.5rem 1rem 1.5rem 2rem;')
    })
  })

  describe('overrides', () => {
    it('individual sides override x/y', () => {
      const result = shorthand('padding', {
        full: undefined,
        x: 16,
        y: 8,
        top: 4,
        left: undefined,
        bottom: undefined,
        right: undefined,
      })
      // top=4, right=16(x), bottom=8(y), left=16(x)
      expect(result).toBe('padding: 0.25rem 1rem 0.5rem;')
    })

    it('individual sides override full', () => {
      const result = shorthand('margin', {
        full: 10,
        x: undefined,
        y: undefined,
        top: 20,
        left: undefined,
        bottom: undefined,
        right: undefined,
      })
      // top=20, right=10(full), bottom=10(full), left=10(full)
      expect(result).toBe('margin: 1.25rem 0.625rem 0.625rem;')
    })
  })

  describe('zero values', () => {
    it('handles zero as a valid value', () => {
      const result = shorthand('margin', {
        full: 0,
        x: undefined,
        y: undefined,
        top: undefined,
        left: undefined,
        bottom: undefined,
        right: undefined,
      })
      expect(result).toBe('margin: 0;')
    })
  })

  describe('border-width with px unit', () => {
    it('uses px for border-width', () => {
      const result = shorthand('border-width', {
        full: 1,
        x: undefined,
        y: undefined,
        top: undefined,
        left: undefined,
        bottom: undefined,
        right: undefined,
      })
      expect(result).toBe('border-width: 1px;')
    })
  })

  describe('border-style without unit', () => {
    it('passes through border-style values', () => {
      const result = shorthand('border-style', {
        full: 'solid',
        x: undefined,
        y: undefined,
        top: undefined,
        left: undefined,
        bottom: undefined,
        right: undefined,
      })
      expect(result).toBe('border-style: solid;')
    })
  })

  describe('border-color without unit', () => {
    it('passes through border-color values', () => {
      const result = shorthand('border-color', {
        full: 'red',
        x: undefined,
        y: undefined,
        top: undefined,
        left: undefined,
        bottom: undefined,
        right: undefined,
      })
      expect(result).toBe('border-color: red;')
    })

    it('generates individual side properties for border-color', () => {
      const result = shorthand('border-color', {
        full: undefined,
        x: undefined,
        y: undefined,
        top: 'red',
        left: undefined,
        bottom: 'blue',
        right: undefined,
      })
      expect(result).toContain('border-top-color: red;')
      expect(result).toContain('border-bottom-color: blue;')
    })
  })

  describe('inset', () => {
    it('generates inset with side names directly', () => {
      const result = shorthand('inset', {
        full: undefined,
        x: undefined,
        y: undefined,
        top: 0,
        left: undefined,
        bottom: undefined,
        right: undefined,
      })
      expect(result).toContain('top: 0;')
    })
  })

  it('uses default rootSize of 16', () => {
    const defaultShorthand = edge()
    const result = defaultShorthand('margin', {
      full: 16,
      x: undefined,
      y: undefined,
      top: undefined,
      left: undefined,
      bottom: undefined,
      right: undefined,
    })
    expect(result).toBe('margin: 1rem;')
  })
})
