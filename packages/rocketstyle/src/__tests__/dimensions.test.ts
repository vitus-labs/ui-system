import {
  getDimensionsMap,
  getDimensionsValues,
  getKeys,
  getMultipleDimensions,
  getValues,
  isMultiKey,
  isValidKey,
} from '../utils/dimensions'

describe('isValidKey', () => {
  it('returns true for truthy values', () => {
    expect(isValidKey('a')).toBe(true)
    expect(isValidKey(1)).toBe(true)
    expect(isValidKey(true)).toBe(true)
    expect(isValidKey(0)).toBe(true)
    expect(isValidKey('')).toBe(true)
  })

  it('returns false for undefined, null, false', () => {
    expect(isValidKey(undefined)).toBe(false)
    expect(isValidKey(null)).toBe(false)
    expect(isValidKey(false)).toBe(false)
  })
})

describe('isMultiKey', () => {
  it('returns [true, propName] for object with propName', () => {
    expect(isMultiKey({ propName: 'tags', multi: true })).toEqual([
      true,
      'tags',
    ])
  })

  it('returns [false, value] for string', () => {
    expect(isMultiKey('variant')).toEqual([false, 'variant'])
  })
})

describe('getKeys', () => {
  it('returns object keys', () => {
    expect(getKeys({ a: 1, b: 2 })).toEqual(['a', 'b'])
  })

  it('returns empty array for empty object', () => {
    expect(getKeys({})).toEqual([])
  })
})

describe('getValues', () => {
  it('returns object values', () => {
    expect(getValues({ a: 1, b: 2 })).toEqual([1, 2])
  })
})

describe('getDimensionsValues', () => {
  it('extracts string dimension values', () => {
    const dimensions = { size: 'size', variant: 'variant' }
    expect(getDimensionsValues(dimensions)).toEqual(['size', 'variant'])
  })

  it('extracts propName from object dimensions', () => {
    const dimensions = {
      size: 'size',
      tags: { propName: 'tags', multi: true },
    }
    expect(getDimensionsValues(dimensions)).toEqual(['size', 'tags'])
  })
})

describe('getMultipleDimensions', () => {
  it('identifies multi-key dimensions', () => {
    const dimensions = {
      size: 'size',
      tags: { propName: 'tags', multi: true },
    }
    expect(getMultipleDimensions(dimensions)).toEqual({ tags: true })
  })

  it('returns empty for no multi dimensions', () => {
    const dimensions = { size: 'size', variant: 'variant' }
    expect(getMultipleDimensions(dimensions)).toEqual({})
  })

  it('skips multi=false', () => {
    const dimensions = {
      tags: { propName: 'tags', multi: false },
    }
    expect(getMultipleDimensions(dimensions)).toEqual({})
  })
})

describe('getDimensionsMap', () => {
  it('builds keysMap and keywords from themes', () => {
    const themes = {
      size: { small: { fontSize: 12 }, large: { fontSize: 18 } },
    }
    const result = getDimensionsMap({ themes })
    expect(result.keysMap).toEqual({
      size: { small: true, large: true },
    })
    expect(result.keywords.size).toBe(true)
  })

  it('adds dimension keys to keywords when useBooleans', () => {
    const themes = {
      size: { small: { fontSize: 12 }, large: { fontSize: 18 } },
    }
    const result = getDimensionsMap({ themes, useBooleans: true })
    expect(result.keywords.small).toBe(true)
    expect(result.keywords.large).toBe(true)
  })

  it('skips invalid values (false, null, undefined)', () => {
    const themes = {
      size: { small: { fontSize: 12 }, disabled: false, hidden: null },
    }
    const result = getDimensionsMap({ themes })
    expect(result.keysMap.size).toEqual({ small: true })
  })

  it('returns empty for empty themes', () => {
    const result = getDimensionsMap({ themes: {} })
    expect(result.keysMap).toEqual({})
    expect(result.keywords).toEqual({})
  })
})
