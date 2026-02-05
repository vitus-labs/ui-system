import { extractDefaultBooleanProps } from '../utils/dimensions'

describe('extractDefaultBooleanProps', () => {
  it('returns null when useBooleans is false', () => {
    const result = extractDefaultBooleanProps({
      dimensions: { size: { small: {}, large: {} } },
      multiKeys: {},
      useBooleans: false,
    })
    expect(result).toBeNull()
  })

  it('extracts first key as boolean prop for non-multi dimensions', () => {
    const result = extractDefaultBooleanProps({
      dimensions: {
        size: { small: {}, large: {} },
        variant: { primary: {}, secondary: {} },
      },
      multiKeys: {},
      useBooleans: true,
    })
    expect(result).toEqual({ small: true, primary: true })
  })

  it('skips multi-key dimensions', () => {
    const result = extractDefaultBooleanProps({
      dimensions: {
        size: { small: {}, large: {} },
        tags: { tagA: {}, tagB: {} },
      },
      multiKeys: { tags: true },
      useBooleans: true,
    })
    expect(result).toEqual({ small: true })
    expect(result).not.toHaveProperty('tagA')
  })

  it('returns empty object when all are multi-key', () => {
    const result = extractDefaultBooleanProps({
      dimensions: { tags: { a: {}, b: {} } },
      multiKeys: { tags: true },
      useBooleans: true,
    })
    expect(result).toEqual({})
  })
})
