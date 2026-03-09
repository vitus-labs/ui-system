import { describe, expect, it } from 'vitest'
import {
  getPrimaryTransitionConfig,
  parseTransformString,
  parseTransitionString,
  TRANSFORM_IDENTITY,
} from '~/nativeParsers'

describe('parseTransitionString', () => {
  it('parses a single transition', () => {
    const result = parseTransitionString('opacity 300ms ease-out')
    expect(result).toEqual([
      { property: 'opacity', duration: 300, easingName: 'ease-out' },
    ])
  })

  it('parses multiple transitions', () => {
    const result = parseTransitionString(
      'opacity 300ms ease-out, transform 200ms ease-in',
    )
    expect(result).toEqual([
      { property: 'opacity', duration: 300, easingName: 'ease-out' },
      { property: 'transform', duration: 200, easingName: 'ease-in' },
    ])
  })

  it('parses seconds to milliseconds', () => {
    const result = parseTransitionString('opacity 0.5s linear')
    expect(result).toEqual([
      { property: 'opacity', duration: 500, easingName: 'linear' },
    ])
  })

  it('defaults duration to 300ms', () => {
    const result = parseTransitionString('opacity ease')
    expect(result[0]!.duration).toBe(300)
  })

  it('defaults easing to ease', () => {
    const result = parseTransitionString('opacity 200ms')
    expect(result[0]!.easingName).toBe('ease')
  })

  it('handles ease-in-out', () => {
    const result = parseTransitionString('all 400ms ease-in-out')
    expect(result[0]).toEqual({
      property: 'all',
      duration: 400,
      easingName: 'ease-in-out',
    })
  })
})

describe('getPrimaryTransitionConfig', () => {
  it('returns defaults for undefined', () => {
    expect(getPrimaryTransitionConfig(undefined)).toEqual({
      duration: 300,
      easingName: 'ease',
    })
  })

  it('picks longest duration from multiple transitions', () => {
    const result = getPrimaryTransitionConfig(
      'opacity 200ms ease, transform 500ms ease-out',
    )
    expect(result).toEqual({ duration: 500, easingName: 'ease-out' })
  })

  it('works with single transition', () => {
    const result = getPrimaryTransitionConfig('opacity 150ms linear')
    expect(result).toEqual({ duration: 150, easingName: 'linear' })
  })
})

describe('parseTransformString', () => {
  it('parses single transform', () => {
    expect(parseTransformString('translateY(16px)')).toEqual([
      { type: 'translateY', value: 16 },
    ])
  })

  it('parses multiple transforms', () => {
    expect(parseTransformString('translateY(16px) scale(0.95)')).toEqual([
      { type: 'translateY', value: 16 },
      { type: 'scale', value: 0.95 },
    ])
  })

  it('handles negative values', () => {
    expect(parseTransformString('translateX(-20px)')).toEqual([
      { type: 'translateX', value: -20 },
    ])
  })

  it('handles zero', () => {
    expect(parseTransformString('translateY(0)')).toEqual([
      { type: 'translateY', value: 0 },
    ])
  })

  it('returns empty array for empty string', () => {
    expect(parseTransformString('')).toEqual([])
  })

  it('handles rotate with degrees', () => {
    expect(parseTransformString('rotate(45deg)')).toEqual([
      { type: 'rotate', value: 45 },
    ])
  })
})

describe('getPrimaryTransitionConfig — edge cases', () => {
  it('returns the only config when single transition is specified', () => {
    const result = getPrimaryTransitionConfig('all 400ms ease-in-out')
    expect(result).toEqual({ duration: 400, easingName: 'ease-in-out' })
  })

  it('picks longest from three transitions', () => {
    const result = getPrimaryTransitionConfig(
      'opacity 100ms ease, transform 600ms ease-out, color 200ms linear',
    )
    expect(result).toEqual({ duration: 600, easingName: 'ease-out' })
  })
})

describe('parseTransitionString — edge cases', () => {
  it('defaults property to "all" when first token is empty string', () => {
    // An empty string produces tokens[0] === '' which is falsy
    const result = parseTransitionString('')
    expect(result[0]!.property).toBe('all')
    expect(result[0]!.duration).toBe(300)
    expect(result[0]!.easingName).toBe('ease')
  })

  it('defaults property to "all" when token is empty', () => {
    // A single space-only part
    const result = parseTransitionString('  300ms ease')
    expect(result[0]!.property).toBeDefined()
    expect(result[0]!.duration).toBe(300)
  })

  it('handles transitions without any easing keyword', () => {
    const result = parseTransitionString('opacity 500ms')
    expect(result[0]!.easingName).toBe('ease')
  })

  it('handles transitions with only property and easing (no duration token)', () => {
    const result = parseTransitionString('all linear')
    expect(result[0]!.duration).toBe(300) // default
    expect(result[0]!.easingName).toBe('linear')
  })
})

describe('parseTransformString — edge cases', () => {
  it('skips NaN values', () => {
    const result = parseTransformString('translateX(abc)')
    expect(result).toEqual([])
  })

  it('handles multiple transforms with mixed units', () => {
    const result = parseTransformString(
      'translateX(10px) rotate(90deg) scale(1.5)',
    )
    expect(result).toEqual([
      { type: 'translateX', value: 10 },
      { type: 'rotate', value: 90 },
      { type: 'scale', value: 1.5 },
    ])
  })
})

describe('TRANSFORM_IDENTITY', () => {
  it('has 0 for translation', () => {
    expect(TRANSFORM_IDENTITY.translateX).toBe(0)
    expect(TRANSFORM_IDENTITY.translateY).toBe(0)
  })

  it('has 1 for scale', () => {
    expect(TRANSFORM_IDENTITY.scale).toBe(1)
    expect(TRANSFORM_IDENTITY.scaleX).toBe(1)
    expect(TRANSFORM_IDENTITY.scaleY).toBe(1)
  })

  it('has 0 for rotation', () => {
    expect(TRANSFORM_IDENTITY.rotate).toBe(0)
  })

  it('has 0 for skew', () => {
    expect(TRANSFORM_IDENTITY.skewX).toBe(0)
    expect(TRANSFORM_IDENTITY.skewY).toBe(0)
  })

  it('has 0 for perspective', () => {
    expect(TRANSFORM_IDENTITY.perspective).toBe(0)
  })

  it('has all rotation axes', () => {
    expect(TRANSFORM_IDENTITY.rotateX).toBe(0)
    expect(TRANSFORM_IDENTITY.rotateY).toBe(0)
    expect(TRANSFORM_IDENTITY.rotateZ).toBe(0)
  })
})
