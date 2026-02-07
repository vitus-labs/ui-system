import alignContent, {
  ALIGN_CONTENT_DIRECTION,
  ALIGN_CONTENT_MAP_X,
  ALIGN_CONTENT_MAP_Y,
} from '../styles/alignContent'

describe('alignContent', () => {
  it('returns null for empty attrs', () => {
    expect(alignContent({} as any)).toBeNull()
  })

  it('returns null when direction is missing', () => {
    expect(
      alignContent({ direction: undefined as any, alignX: 'left', alignY: 'top' }),
    ).toBeNull()
  })

  it('returns null when alignX is missing', () => {
    expect(
      alignContent({ direction: 'inline', alignX: undefined as any, alignY: 'top' }),
    ).toBeNull()
  })

  it('returns null when alignY is missing', () => {
    expect(
      alignContent({ direction: 'inline', alignX: 'left', alignY: undefined as any }),
    ).toBeNull()
  })

  it('generates css for inline direction', () => {
    const result = alignContent({
      direction: 'inline',
      alignX: 'left',
      alignY: 'top',
    })
    expect(result).toBeDefined()
    // For inline (reverted), alignItems = y, justifyContent = x
    const flat = Array.isArray(result) ? result.join('') : String(result)
    expect(flat).toContain('flex-direction')
    expect(flat).toContain('row')
  })

  it('generates css for rows direction', () => {
    const result = alignContent({
      direction: 'rows',
      alignX: 'center',
      alignY: 'center',
    })
    expect(result).toBeDefined()
    const flat = Array.isArray(result) ? result.join('') : String(result)
    expect(flat).toContain('column')
  })

  it('generates css for reverseInline direction', () => {
    const result = alignContent({
      direction: 'reverseInline',
      alignX: 'right',
      alignY: 'bottom',
    })
    expect(result).toBeDefined()
    const flat = Array.isArray(result) ? result.join('') : String(result)
    expect(flat).toContain('row-reverse')
  })

  it('generates css for reverseRows direction', () => {
    const result = alignContent({
      direction: 'reverseRows',
      alignX: 'left',
      alignY: 'top',
    })
    expect(result).toBeDefined()
    const flat = Array.isArray(result) ? result.join('') : String(result)
    expect(flat).toContain('column-reverse')
  })

  it('maps alignX values correctly', () => {
    // For rows (non-reverted), alignItems = x
    const result = alignContent({
      direction: 'rows',
      alignX: 'spaceBetween',
      alignY: 'center',
    })
    const flat = Array.isArray(result) ? result.join('') : String(result)
    expect(flat).toContain('space-between')
  })
})

describe('ALIGN_CONTENT_MAP_X', () => {
  it('has correct mappings', () => {
    expect(ALIGN_CONTENT_MAP_X.left).toBe('flex-start')
    expect(ALIGN_CONTENT_MAP_X.right).toBe('flex-end')
    expect(ALIGN_CONTENT_MAP_X.center).toBe('center')
    expect(ALIGN_CONTENT_MAP_X.spaceBetween).toBe('space-between')
    expect(ALIGN_CONTENT_MAP_X.spaceAround).toBe('space-around')
    expect(ALIGN_CONTENT_MAP_X.block).toBe('stretch')
  })
})

describe('ALIGN_CONTENT_MAP_Y', () => {
  it('has correct mappings', () => {
    expect(ALIGN_CONTENT_MAP_Y.top).toBe('flex-start')
    expect(ALIGN_CONTENT_MAP_Y.bottom).toBe('flex-end')
    expect(ALIGN_CONTENT_MAP_Y.center).toBe('center')
  })
})

describe('ALIGN_CONTENT_DIRECTION', () => {
  it('has correct mappings', () => {
    expect(ALIGN_CONTENT_DIRECTION.inline).toBe('row')
    expect(ALIGN_CONTENT_DIRECTION.reverseInline).toBe('row-reverse')
    expect(ALIGN_CONTENT_DIRECTION.rows).toBe('column')
    expect(ALIGN_CONTENT_DIRECTION.reverseRows).toBe('column-reverse')
  })
})
