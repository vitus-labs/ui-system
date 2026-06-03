/**
 * Smoke tests for the Emotion connector: verify every named export is
 * present, callable, and produces the expected shape — these used to be
 * absent, so silent regressions in Emotion ESM/CJS shape would only
 * surface in consumer apps.
 */
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  createGlobalStyle,
  css,
  keyframes,
  provider as Provider,
  styled,
  useTheme,
} from '../index'

describe('@vitus-labs/connector-emotion', () => {
  it('exports the full connector surface (useCSS intentionally absent)', () => {
    expect(typeof css).toBe('function')
    expect(typeof styled).toBe('function')
    expect(typeof keyframes).toBe('function')
    expect(typeof createGlobalStyle).toBe('function')
    expect(typeof useTheme).toBe('function')
    expect(typeof Provider).toBe('function')
  })

  describe('css', () => {
    it('static template returns a plain string', () => {
      const out = css`
        color: red;
        padding: 8px;
      `
      expect(typeof out).toBe('string')
      expect(out).toContain('color: red')
    })

    it('dynamic template returns a function(props) → string', () => {
      const out = css`
        color: ${(p: any) => p.color};
      `
      expect(typeof out).toBe('function')
      expect((out as any)({ color: 'lime' })).toContain('color: lime')
    })

    it('handles arrays of fragments', () => {
      const a = css`
        color: red;
      `
      const b = css`
        padding: 8px;
      `
      const out = css`
        ${[a, b]}
      `
      expect(typeof out).toBe('function')
      // arrays force the dynamic path; call with empty props
      expect((out as any)({})).toContain('color: red')
      expect((out as any)({})).toContain('padding: 8px')
    })
  })

  describe('styled', () => {
    it('renders a styled element', () => {
      const Box = styled.div`
        color: tomato;
      `
      const { container } = render(<Box>hi</Box>)
      const el = container.firstElementChild as HTMLElement
      expect(el.tagName).toBe('DIV')
      expect(el.textContent).toBe('hi')
    })
  })
})
