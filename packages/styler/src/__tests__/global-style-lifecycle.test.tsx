/**
 * createGlobalStyle rules are mount-scoped and ref-counted: a dynamic
 * global that changes value replaces its previous rules, and the last
 * unmount removes them (2026-11 audit).
 */
import { render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { createGlobalStyle } from '../globalStyle'
import { sheet } from '../sheet'

const sheetRules = (): string[] => {
  const el = document.querySelector('style[data-vl]') as HTMLStyleElement
  return Array.from(el.sheet?.cssRules ?? []).map((r) => r.cssText)
}

afterEach(() => {
  sheet.clearAll()
})

describe('dynamic createGlobalStyle replaces its previous rules', () => {
  it('A → B → A ends with A in effect (theme toggle on body)', () => {
    const G = createGlobalStyle`body { background: ${(p: any) => p.bg}; }`
    const r = render(<G bg="white" />)
    r.rerender(<G bg="black" />)
    r.rerender(<G bg="white" />)
    expect(getComputedStyle(document.body).backgroundColor).toBe(
      'rgb(255, 255, 255)',
    )
    expect(sheetRules().filter((t) => t.includes('background')).length).toBe(1)
    r.unmount()
    expect(sheetRules().some((t) => t.includes('background'))).toBe(false)
  })

  it('static global is removed when the last instance unmounts', () => {
    const G = createGlobalStyle`body { letter-spacing: 3px; }`
    const has = () => sheetRules().some((t) => t.includes('letter-spacing'))
    const a = render(<G />)
    const b = render(<G />)
    expect(
      sheetRules().filter((t) => t.includes('letter-spacing')).length,
    ).toBe(1)
    a.unmount()
    expect(has()).toBe(true) // still owned by `b`
    b.unmount()
    expect(has()).toBe(false)
    render(<G />)
    expect(has()).toBe(true) // re-mount re-inserts
  })

  it('two dynamic instances with the same value share the rules', () => {
    const G = createGlobalStyle`body { word-spacing: ${(p: any) => p.w}; }`
    const a = render(<G w="2px" />)
    const b = render(<G w="2px" />)
    a.unmount()
    expect(sheetRules().some((t) => t.includes('word-spacing'))).toBe(true)
    b.unmount()
    expect(sheetRules().some((t) => t.includes('word-spacing'))).toBe(false)
  })
})
