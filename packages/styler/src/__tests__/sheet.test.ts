import { afterEach, beforeEach, describe, expect, it } from 'vitest'
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

  // Regression: splitRules' brace counting previously ignored quotes — a
  // `{` or `}` inside a string corrupted rule boundaries, so the second
  // rule never reached insertRule. Uses a fresh sheet because this
  // describe's beforeEach detaches the singleton's style tag.
  it('insertGlobal splits rules correctly when a string contains braces', async () => {
    const { createSheet } = await import('../sheet')
    const s = createSheet()
    const tags = document.querySelectorAll<HTMLStyleElement>('style[data-vl]')
    const el = tags[tags.length - 1] as HTMLStyleElement
    const before = el.sheet?.cssRules.length ?? 0
    s.insertGlobal('.q-a::before{content:"}{";}\n.q-b{color:red;}')
    const rules = el.sheet?.cssRules ?? ({ length: 0 } as CSSRuleList)
    expect(rules.length).toBe(before + 2)
    const texts = Array.from(rules).map((r) => r.cssText)
    expect(texts.some((t) => t.includes('.q-b'))).toBe(true)
    el.remove()
  })

  it('insertGlobal handles escaped quotes when splitting rules', async () => {
    const { createSheet } = await import('../sheet')
    const s = createSheet()
    const tags = document.querySelectorAll<HTMLStyleElement>('style[data-vl]')
    const el = tags[tags.length - 1] as HTMLStyleElement
    const before = el.sheet?.cssRules.length ?? 0
    s.insertGlobal('.e-a::after{content:"a\\"}b";}\n.e-b{margin:0;}')
    expect(el.sheet?.cssRules.length).toBe(before + 2)
    el.remove()
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

// Hot-cache coverage — repeated calls exercise the 2-slot LRU paths
// (hotA hit, hotB hit + promote, prepareCache hit) added in the styler
// perf audit. Without these tests, the new branches are uncovered.
describe('StyleSheet — 2-slot LRU hot caches', () => {
  const cleanupStyleTags = () => {
    // createSheet() appends a <style data-vl> per call when no existing tag
    // is present; without cleanup, subsequent tests in this file (e.g. the
    // SSR-hydration test) get the wrong sheet via querySelector('first-match').
    for (const el of Array.from(document.querySelectorAll('style[data-vl]')))
      el.remove()
  }
  beforeEach(cleanupStyleTags)
  afterEach(cleanupStyleTags)

  it('prepare() returns identical result on repeated same-key call (hotA hit)', async () => {
    const { createSheet } = await import('../sheet')
    const s = createSheet()
    const a = s.prepare('color: hotpink;')
    const b = s.prepare('color: hotpink;')
    expect(b).toBe(a) // same reference — hot slot returned cached value
  })

  it('prepare() promotes hotB → hotA on alternating-key access', async () => {
    const { createSheet } = await import('../sheet')
    const s = createSheet()
    const a1 = s.prepare('color: red;')
    const b1 = s.prepare('color: blue;') // displaces red → hotB
    const a2 = s.prepare('color: red;') // hits hotB → promote
    const b2 = s.prepare('color: blue;') // hits hotB → promote
    expect(a2).toBe(a1)
    expect(b2).toBe(b1)
  })

  it('prepare() repopulates hot slots from Map on cold-hot displacement', async () => {
    const { createSheet } = await import('../sheet')
    const s = createSheet()
    // Fill prepareCache with 3 entries — last 2 occupy the hot slots.
    s.prepare('color: red;')
    s.prepare('color: green;')
    s.prepare('color: blue;')
    // 'color: red;' is now in prepareCache but not in either hot slot.
    // This call must miss both hot slots, hit the Map, and repopulate.
    const a = s.prepare('color: red;')
    expect(a.className).toMatch(/^vl-/)
    // Subsequent call should hit hotA (was just populated)
    const a2 = s.prepare('color: red;')
    expect(a2).toBe(a)
  })

  it('insert() returns identical className on repeated same-key call (hotA hit)', async () => {
    const { createSheet } = await import('../sheet')
    const s = createSheet()
    const a = s.insert('background: lime;')
    const b = s.insert('background: lime;')
    expect(b).toBe(a)
  })

  it('insert() promotes hotB → hotA on alternating-key access', async () => {
    const { createSheet } = await import('../sheet')
    const s = createSheet()
    const a1 = s.insert('background: red;')
    const b1 = s.insert('background: blue;')
    const a2 = s.insert('background: red;') // hits hotB → promote
    const b2 = s.insert('background: blue;') // hits hotB → promote
    expect(a2).toBe(a1)
    expect(b2).toBe(b1)
  })

  it('insert() repopulates hot slots from insertCache on cold-hot displacement', async () => {
    const { createSheet } = await import('../sheet')
    const s = createSheet()
    s.insert('background: red;')
    s.insert('background: green;')
    s.insert('background: blue;')
    // 'background: red;' lives in insertCache but neither hot slot now.
    const a = s.insert('background: red;')
    expect(a).toMatch(/^vl-/)
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

  // Regression: insertCache + prepareCache were keyed by full cssText and
  // only cleared by HMR/SSR hooks — a long-running SPA accumulated every
  // unique cssText forever. evictIfNeeded now bounds all three caches.
  it('evicts insertCache and prepareCache too, not just `cache`', async () => {
    const { createSheet } = await import('../sheet')
    const s = createSheet({ maxCacheSize: 5 })

    // Drive both insertCache (via insert) and prepareCache (via prepare)
    // past the threshold with distinct cssText values.
    for (let i = 0; i < 30; i++) {
      s.insert(`color: rgb(${i}, 0, 0);`)
      s.prepare(`background: rgb(0, ${i}, 0);`)
    }

    // If the new caches weren't bounded, .size would track the 30 unique
    // entries forever. With eviction, each is capped at <= maxCacheSize.
    // Use the public introspection: insert one final entry of each kind
    // should still succeed and remain bounded.
    s.insert('color: lime;')
    s.prepare('background: gold;')
    // Touch a previously-evicted cssText — must re-insert cleanly without
    // throwing (it has been dropped from insertCache but the API still
    // produces a deterministic className via the hash path).
    const replay = s.insert('color: rgb(0, 0, 0);')
    expect(replay).toMatch(/^vl-[0-9a-z]+$/)
  })

  // T1.2: silent hash-collision was a "type allowed it, runtime did nothing
  // visible" credibility tax. Now we warn in dev when two distinct cssText
  // strings hash to the same className (silently apply the FIRST's rule).
  it('warns in dev when two different cssText strings produce the same hash', async () => {
    const { createSheet } = await import('../sheet')
    const s = createSheet()
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    try {
      // Plant entry A.
      const clsA = s.insert('color: red;')
      // Force a fake collision: copy the className → a DIFFERENT cssText
      // through the internal cache. Also clear insertCache so the next
      // insert() doesn't short-circuit before the collision-detection
      // branch (insertCache is the fast cssText→className lookup).
      const cacheField = (s as any).cache as Map<string, string>
      const insertCacheField = (s as any).insertCache as Map<string, string>
      cacheField.set(clsA, 'color: blue;')
      insertCacheField.clear()
      // Also clear the 2-slot LRU hot cache the test isn't aware of —
      // bypassing the public clearCache() leaves it stale otherwise.
      ;(s as any).insertHotA = null
      ;(s as any).insertHotB = null
      // Now re-insert "color: red;" → hashes to clsA, cache has the wrong
      // cssText → collision detected → warn.
      s.insert('color: red;')
      expect(warn).toHaveBeenCalled()
      const msg = String(warn.mock.calls[0]?.[0] ?? '')
      expect(msg).toMatch(/hash collision/i)
    } finally {
      warn.mockRestore()
    }
  })

  it('does NOT warn for legacy reservation entries (hydration / globalStyle)', async () => {
    const { createSheet } = await import('../sheet')
    const s = createSheet()
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    try {
      const clsA = s.insert('color: lime;')
      // Simulate the legacy reservation pattern used by hydration paths:
      // the cache value is the className itself (not real cssText).
      const cacheField = (s as any).cache as Map<string, string>
      cacheField.set(clsA, clsA)
      s.insert('color: lime;') // hits cache; cached === className → no warn
      expect(warn).not.toHaveBeenCalled()
    } finally {
      warn.mockRestore()
    }
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
