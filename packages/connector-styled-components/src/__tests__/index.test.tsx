/**
 * Smoke tests for the styled-components connector: verify every named
 * export is present + the v6-derived CSSEngineResult shape flows through.
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

describe('@vitus-labs/connector-styled-components', () => {
  it('exports the full connector surface (useCSS intentionally absent)', () => {
    expect(typeof css).toBe('function')
    expect(typeof styled).toBe('function')
    expect(typeof keyframes).toBe('function')
    expect(typeof createGlobalStyle).toBe('function')
    expect(typeof useTheme).toBe('function')
    expect(typeof Provider).toBe('function')
  })

  describe('css', () => {
    it('returns a RuleSet that styled-components can consume', () => {
      const out = css`
        color: red;
      `
      // styled-components v6 returns an array-shaped RuleSet
      expect(out).toBeDefined()
      expect(Array.isArray(out) || typeof out === 'object').toBe(true)
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
