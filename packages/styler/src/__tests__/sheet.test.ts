import { beforeEach, describe, expect, it } from 'vitest'
import { hash } from '../hash'

// We test the StyleSheet class behavior by importing the sheet singleton.
// In jsdom environment, it creates a real <style> element.
// We need to re-import for each test to get a fresh sheet.

describe('StyleSheet', () => {
  let sheet: typeof import('../sheet').sheet

  beforeEach(async () => {
    // Clear any existing style tags
    document.querySelectorAll('style[data-vl]').forEach((el) => el.remove())

    // Re-import to get fresh instance
    // Use dynamic import with cache busting
    const mod = await import('../sheet')
    sheet = mod.sheet
  })

  it('insert returns a class name with vl- prefix', () => {
    const className = sheet.insert('display: flex;')
    expect(className).toMatch(/^vl-[0-9a-z]+$/)
  })

  it('same CSS text always returns same class name (dedup)', () => {
    const cls1 = sheet.insert('color: red;')
    const cls2 = sheet.insert('color: red;')
    expect(cls1).toBe(cls2)
  })

  it('different CSS text returns different class names', () => {
    const cls1 = sheet.insert('color: red;')
    const cls2 = sheet.insert('color: blue;')
    expect(cls1).not.toBe(cls2)
  })

  it('class name matches hash of CSS text', () => {
    const cssText = 'display: flex;'
    const className = sheet.insert(cssText)
    expect(className).toBe(`vl-${hash(cssText)}`)
  })
})
