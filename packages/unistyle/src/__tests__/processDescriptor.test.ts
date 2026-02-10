import { css } from '@vitus-labs/styler'
import borderRadius from '../styles/shorthands/borderRadius'
import edge from '../styles/shorthands/edge'
import processDescriptor from '../styles/styles/processDescriptor'
import { values } from '../units'

const calc = (...params: any[]) => values(params, 16)
const shorthand = edge(16)
const borderRadiusFn = borderRadius(16)

describe('processDescriptor', () => {
  describe('simple', () => {
    it('returns CSS for non-null value', () => {
      const result = processDescriptor(
        { kind: 'simple', css: 'display', key: 'display' },
        { display: 'flex' } as any,
        css,
        calc,
        shorthand,
        borderRadiusFn,
      )
      expect(result).toBe('display: flex;')
    })

    it('returns empty string for null value', () => {
      const result = processDescriptor(
        { kind: 'simple', css: 'display', key: 'display' },
        {} as any,
        css,
        calc,
        shorthand,
        borderRadiusFn,
      )
      expect(result).toBe('')
    })
  })

  describe('convert', () => {
    it('converts number to rem', () => {
      const result = processDescriptor(
        { kind: 'convert', css: 'font-size', key: 'fontSize' },
        { fontSize: 16 } as any,
        css,
        calc,
        shorthand,
        borderRadiusFn,
      )
      expect(result).toBe('font-size: 1rem;')
    })

    it('returns empty string when value is null', () => {
      const result = processDescriptor(
        { kind: 'convert', css: 'font-size', key: 'fontSize' },
        {} as any,
        css,
        calc,
        shorthand,
        borderRadiusFn,
      )
      expect(result).toBe('')
    })
  })

  describe('convert_fallback', () => {
    it('picks first non-null value from keys', () => {
      const result = processDescriptor(
        { kind: 'convert_fallback', css: 'width', keys: ['width', 'size'] },
        { width: 32 } as any,
        css,
        calc,
        shorthand,
        borderRadiusFn,
      )
      expect(result).toBe('width: 2rem;')
    })

    it('falls back to second key', () => {
      const result = processDescriptor(
        { kind: 'convert_fallback', css: 'width', keys: ['width', 'size'] },
        { size: 48 } as any,
        css,
        calc,
        shorthand,
        borderRadiusFn,
      )
      expect(result).toBe('width: 3rem;')
    })

    it('returns empty string when all keys are null', () => {
      const result = processDescriptor(
        { kind: 'convert_fallback', css: 'width', keys: ['width', 'size'] },
        {} as any,
        css,
        calc,
        shorthand,
        borderRadiusFn,
      )
      expect(result).toBe('')
    })
  })

  describe('edge', () => {
    it('delegates to edge shorthand', () => {
      const result = processDescriptor(
        {
          kind: 'edge',
          property: 'margin',
          keys: {
            full: 'margin',
            x: 'marginX',
            y: 'marginY',
            top: 'marginTop',
            left: 'marginLeft',
            bottom: 'marginBottom',
            right: 'marginRight',
          },
        },
        { margin: 16 } as any,
        css,
        calc,
        shorthand,
        borderRadiusFn,
      )
      expect(result).toBe('margin: 1rem;')
    })

    it('returns empty string when no values', () => {
      const result = processDescriptor(
        {
          kind: 'edge',
          property: 'margin',
          keys: {
            full: 'margin',
            x: 'marginX',
            y: 'marginY',
            top: 'marginTop',
            left: 'marginLeft',
            bottom: 'marginBottom',
            right: 'marginRight',
          },
        },
        {} as any,
        css,
        calc,
        shorthand,
        borderRadiusFn,
      )
      expect(result).toBe('')
    })
  })

  describe('border_radius', () => {
    it('delegates to borderRadius shorthand', () => {
      const result = processDescriptor(
        {
          kind: 'border_radius',
          keys: {
            full: 'borderRadius',
            top: 'borderRadiusTop',
            bottom: 'borderRadiusBottom',
            left: 'borderRadiusLeft',
            right: 'borderRadiusRight',
            topLeft: 'borderRadiusTopLeft',
            topRight: 'borderRadiusTopRight',
            bottomLeft: 'borderRadiusBottomLeft',
            bottomRight: 'borderRadiusBottomRight',
          },
        },
        { borderRadius: 8 } as any,
        css,
        calc,
        shorthand,
        borderRadiusFn,
      )
      expect(result).toBe('border-radius: 0.5rem;')
    })

    it('returns empty string when no values', () => {
      const result = processDescriptor(
        {
          kind: 'border_radius',
          keys: {
            full: 'borderRadius',
            top: 'borderRadiusTop',
            bottom: 'borderRadiusBottom',
            left: 'borderRadiusLeft',
            right: 'borderRadiusRight',
            topLeft: 'borderRadiusTopLeft',
            topRight: 'borderRadiusTopRight',
            bottomLeft: 'borderRadiusBottomLeft',
            bottomRight: 'borderRadiusBottomRight',
          },
        },
        {} as any,
        css,
        calc,
        shorthand,
        borderRadiusFn,
      )
      expect(result).toBe('')
    })
  })

  describe('special', () => {
    it('fullScreen generates fixed positioning', () => {
      const result = processDescriptor(
        { kind: 'special', id: 'fullScreen' },
        { fullScreen: true } as any,
        css,
        calc,
        shorthand,
        borderRadiusFn,
      )
      const flat = Array.isArray(result) ? result.join('') : String(result)
      expect(flat).toContain('position: fixed')
    })

    it('fullScreen returns empty for false', () => {
      const result = processDescriptor(
        { kind: 'special', id: 'fullScreen' },
        { fullScreen: false } as any,
        css,
        calc,
        shorthand,
        borderRadiusFn,
      )
      expect(result).toBe('')
    })

    it('backgroundImage wraps in url()', () => {
      const result = processDescriptor(
        { kind: 'special', id: 'backgroundImage' },
        { backgroundImage: 'test.png' } as any,
        css,
        calc,
        shorthand,
        borderRadiusFn,
      )
      const flat = Array.isArray(result) ? result.join('') : String(result)
      expect(flat).toContain('background-image')
      expect(flat).toContain('url(')
      expect(flat).toContain('test.png')
    })

    it('backgroundImage returns empty when not set', () => {
      const result = processDescriptor(
        { kind: 'special', id: 'backgroundImage' },
        {} as any,
        css,
        calc,
        shorthand,
        borderRadiusFn,
      )
      expect(result).toBe('')
    })

    it('animation combines keyframe and animation', () => {
      const result = processDescriptor(
        { kind: 'special', id: 'animation' },
        { keyframe: 'fadeIn', animation: '1s ease' } as any,
        css,
        calc,
        shorthand,
        borderRadiusFn,
      )
      expect(result).toBe('animation: fadeIn 1s ease;')
    })

    it('animation with only keyframe', () => {
      const result = processDescriptor(
        { kind: 'special', id: 'animation' },
        { keyframe: 'slideIn' } as any,
        css,
        calc,
        shorthand,
        borderRadiusFn,
      )
      expect(result).toBe('animation: slideIn;')
    })

    it('animation returns empty when neither set', () => {
      const result = processDescriptor(
        { kind: 'special', id: 'animation' },
        {} as any,
        css,
        calc,
        shorthand,
        borderRadiusFn,
      )
      expect(result).toBe('')
    })

    it('hideEmpty generates :empty rule on web', () => {
      const result = processDescriptor(
        { kind: 'special', id: 'hideEmpty' },
        { hideEmpty: true } as any,
        css,
        calc,
        shorthand,
        borderRadiusFn,
      )
      const flat = Array.isArray(result) ? result.join('') : String(result)
      expect(flat).toContain(':empty')
      expect(flat).toContain('display: none')
    })

    it('hideEmpty returns empty when false', () => {
      const result = processDescriptor(
        { kind: 'special', id: 'hideEmpty' },
        { hideEmpty: false } as any,
        css,
        calc,
        shorthand,
        borderRadiusFn,
      )
      expect(result).toBe('')
    })

    it('clearFix generates ::after rule', () => {
      const result = processDescriptor(
        { kind: 'special', id: 'clearFix' },
        { clearFix: true } as any,
        css,
        calc,
        shorthand,
        borderRadiusFn,
      )
      const flat = Array.isArray(result) ? result.join('') : String(result)
      expect(flat).toContain('::after')
      expect(flat).toContain('clear: both')
    })

    it('clearFix returns empty when false', () => {
      const result = processDescriptor(
        { kind: 'special', id: 'clearFix' },
        { clearFix: false } as any,
        css,
        calc,
        shorthand,
        borderRadiusFn,
      )
      expect(result).toBe('')
    })

    it('extendCss returns value or empty string', () => {
      const result = processDescriptor(
        { kind: 'special', id: 'extendCss' },
        { extendCss: 'color: red;' } as any,
        css,
        calc,
        shorthand,
        borderRadiusFn,
      )
      expect(result).toBe('color: red;')
    })

    it('extendCss returns empty for undefined', () => {
      const result = processDescriptor(
        { kind: 'special', id: 'extendCss' },
        {} as any,
        css,
        calc,
        shorthand,
        borderRadiusFn,
      )
      expect(result).toBe('')
    })

    it('unknown special id returns empty string', () => {
      const result = processDescriptor(
        { kind: 'special', id: 'unknown' },
        {} as any,
        css,
        calc,
        shorthand,
        borderRadiusFn,
      )
      expect(result).toBe('')
    })
  })
})
