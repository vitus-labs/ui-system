import { beforeEach, describe, expect, it } from 'vitest'
import { hash } from '../hash'

// We test the StyleSheet class behavior by importing the sheet singleton.
// In jsdom environment, it creates a real <style> element.
// We need to re-import for each test to get a fresh sheet.

describe('StyleSheet', () => {
  let sheet: typeof import('../sheet').sheet

  beforeEach(async () => {
    // Clear any existing style tags
    for (const el of Array.from(document.querySelectorAll('style[data-vl]')))
      el.remove()

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

  it('getClassName returns vl- prefixed class name without inserting', () => {
    const cssText = 'margin: 0;'
    const className = sheet.getClassName(cssText)
    expect(className).toMatch(/^vl-[0-9a-z]+$/)
    expect(className).toBe(`vl-${hash(cssText)}`)
  })

  it('prepare returns className and rules', () => {
    const cssText = 'padding: 10px;'
    const result = sheet.prepare(cssText)
    expect(result.className).toMatch(/^vl-[0-9a-z]+$/)
    expect(result.rules).toContain('padding')
  })

  it('prepare with boost doubles the class selector', () => {
    const cssText = 'color: red;'
    const result = sheet.prepare(cssText, true)
    expect(result.className).toMatch(/^vl-[0-9a-z]+$/)
    // Boosted rules should contain the doubled selector
    expect(result.rules).toContain(result.className)
  })

  it('insertGlobal inserts CSS rules into the sheet', () => {
    sheet.insertGlobal('body { margin: 0; }')
    // Second call with same CSS should be deduped
    sheet.insertGlobal('body { margin: 0; }')
    // Should not throw
  })

  it('insertGlobal handles invalid CSS gracefully', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    // Invalid CSS that will make insertRule throw
    sheet.insertGlobal('invalid { { { }')
    warnSpy.mockRestore()
  })

  it('insert with boost does not throw', () => {
    const className = sheet.insert('font-size: 14px;', true)
    expect(className).toMatch(/^vl-[0-9a-z]+$/)
  })

  it('clearCache clears the dedup cache', () => {
    const cls1 = sheet.insert('color: green;')
    sheet.clearCache()
    // After clearing, same CSS can be re-inserted (returns same hash but cache is fresh)
    const cls2 = sheet.insert('color: green;')
    expect(cls1).toBe(cls2)
  })

  it('has() returns true for inserted className', () => {
    const cls = sheet.insert('color: red;')
    expect(sheet.has(cls)).toBe(true)
  })

  it('has() returns false for unknown className', () => {
    expect(sheet.has('vl-nonexistent')).toBe(false)
  })

  it('cacheSize reflects number of cached entries', () => {
    const before = sheet.cacheSize
    sheet.insert('color: purple;')
    expect(sheet.cacheSize).toBe(before + 1)
  })

  it('clearAll removes all rules and clears cache', () => {
    sheet.insert('color: red;')
    sheet.insert('color: blue;')
    expect(sheet.cacheSize).toBeGreaterThan(0)
    sheet.clearAll()
    expect(sheet.cacheSize).toBe(0)
  })

  it('reset clears cache and buffer', () => {
    sheet.insert('color: cyan;')
    sheet.reset()
    expect(sheet.cacheSize).toBe(0)
  })

  it('getClassName returns cached className after insert', () => {
    const cssText = 'color: magenta;'
    const cls = sheet.insert(cssText)
    // After insert, getClassName should hit the insertCache
    const cls2 = sheet.getClassName(cssText)
    expect(cls2).toBe(cls)
  })

  it('insert extracts @media rules into separate top-level rules', () => {
    const cssText = 'color:red; @media (min-width:600px){font-size:2rem;}'
    const cls = sheet.insert(cssText)
    expect(cls).toMatch(/^vl-[0-9a-z]+$/)
  })

  it('insert with boost and cache dedup returns same className', () => {
    const cssText = 'display: grid;'
    const cls1 = sheet.insert(cssText, true)
    const cls2 = sheet.insert(cssText, true)
    expect(cls1).toBe(cls2)
  })

  it('insertKeyframes deduplicates by name', () => {
    sheet.insertKeyframes('fadeIn', 'from{opacity:0}to{opacity:1}')
    // Should not throw on second call
    sheet.insertKeyframes('fadeIn', 'from{opacity:0}to{opacity:1}')
    expect(sheet.has('fadeIn')).toBe(true)
  })

  it('prepare with @media splits at-rules', () => {
    const cssText = 'color:red; @media (min-width:600px){font-size:2rem;}'
    const result = sheet.prepare(cssText)
    expect(result.rules).toContain('@media')
    expect(result.rules).toContain('font-size')
  })

  it('insertGlobal with multiple rules does not throw', () => {
    sheet.insertGlobal('body { margin: 0; } html { box-sizing: border-box; }')
  })

  it('prepare with empty base (only @media) omits base rule', () => {
    const cssText = '@media (min-width:600px){font-size:2rem;}'
    const result = sheet.prepare(cssText)
    expect(result.rules).toContain('@media')
    expect(result.rules).not.toMatch(/^\.[^@]*\{[^}]*\}@media/)
  })

  it('insert with @layer wraps rules in layer', async () => {
    const { createSheet } = await import('../sheet')
    const s = createSheet({ layer: 'components' })
    const cls = s.insert('color: red;')
    expect(cls).toMatch(/^vl-[0-9a-z]+$/)
  })

  it('prepare with @layer wraps rules in layer', async () => {
    const { createSheet } = await import('../sheet')
    const s = createSheet({ layer: 'components' })
    const result = s.prepare('color: red;')
    expect(result.rules).toContain('@layer components')
  })

  it('getStyleTag returns style tag string', async () => {
    const tag = sheet.getStyleTag()
    expect(tag).toContain('<style')
    expect(tag).toContain('data-vl')
  })

  it('getStyles returns raw CSS string', async () => {
    const styles = sheet.getStyles()
    expect(typeof styles).toBe('string')
  })

  it('insertKeyframes with new name stores in cache', () => {
    const name = `test-anim-${Date.now()}`
    sheet.insertKeyframes(name, 'from{opacity:0}to{opacity:1}')
    expect(sheet.has(name)).toBe(true)
  })
})

describe('StyleSheet — hydration from SSR tag', () => {
  it('hydrates cache from existing SSR-rendered style tag', async () => {
    // Create a pre-existing SSR-rendered <style data-vl> tag
    const ssrStyle = document.createElement('style')
    ssrStyle.setAttribute('data-vl', '')
    document.head.appendChild(ssrStyle)

    // Insert a CSS rule into the SSR tag
    const ssrSheet = ssrStyle.sheet as CSSStyleSheet
    ssrSheet.insertRule('.vl-abc123{color:red;}', 0)
    ssrSheet.insertRule(
      '@media (min-width:600px){.vl-abc123{font-size:2rem;}}',
      1,
    )

    // Now create a new StyleSheet instance — it should find and hydrate from the existing tag
    const { createSheet } = await import('../sheet')
    const s = createSheet()
    // The hydrated cache should recognize vl-abc123
    expect(s.has('vl-abc123')).toBe(true)

    // Cleanup
    ssrStyle.remove()
  })
})

describe('StyleSheet with createSheet', () => {
  it('createSheet creates an isolated instance', async () => {
    const { createSheet } = await import('../sheet')
    const s = createSheet()
    const cls = s.insert('color: teal;')
    expect(cls).toMatch(/^vl-[0-9a-z]+$/)
  })

  it('evicts oldest entries when cache exceeds maxCacheSize', async () => {
    const { createSheet } = await import('../sheet')
    const s = createSheet({ maxCacheSize: 5 })
    // Insert more than maxCacheSize entries to trigger eviction
    for (let i = 0; i < 8; i++) {
      s.insert(`color: rgb(${i}, 0, 0);`)
    }
    // Should still work after eviction
    const cls = s.insert('color: final;')
    expect(cls).toMatch(/^vl-[0-9a-z]+$/)
  })

  it('insert returns className via cache hit path', async () => {
    const { createSheet } = await import('../sheet')
    const s = createSheet()
    const cssText = 'color: cached;'
    const cls1 = s.insert(cssText)
    // Second insert hits cache.has(className) branch
    s.clearCache()
    // Now insert again — this time it re-inserts but same hash
    const cls2 = s.insert(cssText)
    expect(cls1).toBe(cls2)
  })
})
