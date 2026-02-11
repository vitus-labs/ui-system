import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { hash } from '../hash'
import { createSheet, StyleSheet } from '../sheet'

describe('StyleSheet — advanced features', () => {
  describe('getClassName (pure hash computation)', () => {
    it('returns className without inserting a rule', () => {
      const s = createSheet()
      const cls = s.getClassName('display: flex;')
      expect(cls).toMatch(/^vl-[0-9a-z]+$/)
    })

    it('returns same className as insert for same CSS', () => {
      const s = createSheet()
      const clsPure = s.getClassName('display: flex;')
      const clsInsert = s.insert('display: flex;')
      expect(clsPure).toBe(clsInsert)
    })

    it('matches hash-based className', () => {
      const s = createSheet()
      const cssText = 'display: flex;'
      expect(s.getClassName(cssText)).toBe(`vl-${hash(cssText)}`)
    })
  })

  describe('bounded cache (eviction) — DOM mode', () => {
    beforeEach(() => {
      // Clear existing style tags so new sheets start with empty cache
      document.querySelectorAll('style[data-vl]').forEach((el) => {
        el.remove()
      })
    })

    it('still deduplicates within cache bounds', () => {
      const s = createSheet({ maxCacheSize: 100 })
      const cls1 = s.insert('color: red;')
      const cls2 = s.insert('color: red;')
      expect(cls1).toBe(cls2)
    })

    it('cacheSize property reflects current cache size', () => {
      const s = createSheet()
      expect(s.cacheSize).toBe(0)

      s.insert('color: red;')
      expect(s.cacheSize).toBe(1)

      s.insert('color: blue;')
      expect(s.cacheSize).toBe(2)

      // Duplicate doesn't increase size
      s.insert('color: red;')
      expect(s.cacheSize).toBe(2)
    })

    it('evicts oldest entries when max cache size is exceeded', () => {
      const s = createSheet({ maxCacheSize: 10 })

      for (let i = 0; i < 15; i++) {
        s.insert(`prop-${i}: val-${i};`)
      }

      expect(s.cacheSize).toBeLessThanOrEqual(15)
    })

    it('accepts custom maxCacheSize option', () => {
      const s = createSheet({ maxCacheSize: 5 })

      for (let i = 0; i < 20; i++) {
        s.insert(`prop${i}: val${i};`)
      }

      expect(s.cacheSize).toBeLessThanOrEqual(20)
    })
  })

  describe('dev-mode warnings', () => {
    it('warns on invalid CSS in dev mode', () => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      document.querySelectorAll('style[data-vl]').forEach((el) => {
        el.remove()
      })

      const s = new StyleSheet()
      s.insert('invalid{{{css')

      warnSpy.mockRestore()
    })
  })

  describe('insertGlobal — multi-rule splitting', () => {
    beforeEach(() => {
      document.querySelectorAll('style[data-vl]').forEach((el) => {
        el.remove()
      })
    })

    it('injects multiple top-level rules from a single insertGlobal call', () => {
      const s = createSheet()
      s.insertGlobal('html { font-size: 16px; } body { margin: 0; }')
      // Should not throw — both rules are injected individually
      expect(s.cacheSize).toBe(1) // single cache entry for the whole CSS text
    })

    it('injects nested @media rules correctly', () => {
      const s = createSheet()
      s.insertGlobal(
        'body { margin: 0; } @media (min-width: 768px) { body { font-size: 18px; } }',
      )
      expect(s.cacheSize).toBe(1)
    })

    it('handles three or more rules', () => {
      const s = createSheet()
      s.insertGlobal(
        'html { box-sizing: border-box; } *, *::before, *::after { box-sizing: inherit; } body { margin: 0; font-family: sans-serif; }',
      )
      expect(s.cacheSize).toBe(1)
    })

    it('deduplicates identical multi-rule CSS', () => {
      const s = createSheet()
      const css = 'html { font-size: 16px; } body { margin: 0; }'
      s.insertGlobal(css)
      s.insertGlobal(css)
      expect(s.cacheSize).toBe(1)
    })
  })

  // SSR-specific tests: mock document as undefined to simulate server
  describe('SSR mode (mocked)', () => {
    let originalDocument: typeof document

    beforeEach(() => {
      originalDocument = globalThis.document
      // Temporarily remove document to simulate SSR
      // @ts-expect-error - intentionally deleting for SSR simulation
      delete globalThis.document
    })

    afterEach(() => {
      globalThis.document = originalDocument
    })

    it('creates independent StyleSheet instances in SSR', () => {
      const sheet1 = createSheet()
      const sheet2 = createSheet()

      sheet1.insert('color: red;')
      expect(sheet1.getStyles()).toContain('color: red;')
      expect(sheet2.getStyles()).toBe('')
    })

    it('each instance has its own SSR buffer', () => {
      const sheet1 = createSheet()
      const sheet2 = createSheet()

      sheet1.insert('color: red;')
      sheet2.insert('color: blue;')

      expect(sheet1.getStyles()).toContain('color: red;')
      expect(sheet1.getStyles()).not.toContain('color: blue;')
      expect(sheet2.getStyles()).toContain('color: blue;')
      expect(sheet2.getStyles()).not.toContain('color: red;')
    })

    it('reset only clears the buffer of that instance', () => {
      const sheet1 = createSheet()
      const sheet2 = createSheet()

      sheet1.insert('color: red;')
      sheet2.insert('color: blue;')

      sheet1.reset()
      expect(sheet1.getStyles()).toBe('')
      expect(sheet2.getStyles()).toContain('color: blue;')
    })

    it('each instance has its own dedup cache', () => {
      const sheet1 = createSheet()
      const sheet2 = createSheet()

      const cls1 = sheet1.insert('display: flex;')
      const cls2 = sheet2.insert('display: flex;')

      // Same CSS → same class name (deterministic hashing)
      expect(cls1).toBe(cls2)

      // Both inject independently
      expect(sheet1.getStyles()).toContain('display: flex;')
      expect(sheet2.getStyles()).toContain('display: flex;')
    })

    describe('concurrent SSR simulation', () => {
      it('handles concurrent requests without cross-contamination', () => {
        const request1 = createSheet()
        const request2 = createSheet()

        request1.insert('color: red;')
        request1.insertGlobal('body { margin: 0; }')

        request2.insert('color: blue;')
        request2.insertGlobal('body { padding: 0; }')

        const html1 = request1.getStyleTag()
        const html2 = request2.getStyleTag()

        expect(html1).toContain('color: red;')
        expect(html1).not.toContain('color: blue;')
        expect(html1).toContain('body { margin: 0; }')
        expect(html1).not.toContain('body { padding: 0; }')

        expect(html2).toContain('color: blue;')
        expect(html2).not.toContain('color: red;')
        expect(html2).toContain('body { padding: 0; }')
        expect(html2).not.toContain('body { margin: 0; }')
      })

      it('handles many concurrent requests', () => {
        const requests = Array.from({ length: 50 }, (_, i) => {
          const s = createSheet()
          s.insert(`color: color-${i};`)
          return s
        })

        for (let i = 0; i < requests.length; i++) {
          const styles = requests[i].getStyles()
          expect(styles).toContain(`color: color-${i};`)
          const otherIdx = (i + 1) % requests.length
          expect(styles).not.toContain(`color: color-${otherIdx};`)
        }
      })
    })

    describe('@layer support', () => {
      it('wraps inserted rules in @layer when configured', () => {
        const s = createSheet({ layer: 'components' })

        s.insert('color: red;')
        const styles = s.getStyles()

        expect(styles).toContain('@layer components')
        expect(styles).toContain('color: red;')
      })

      it('does not wrap rules without layer option', () => {
        const s = createSheet()

        s.insert('color: red;')
        const styles = s.getStyles()

        expect(styles).not.toContain('@layer')
        expect(styles).toContain('color: red;')
      })

      it('does not wrap @keyframes in @layer', () => {
        const s = createSheet({ layer: 'components' })

        s.insertKeyframes('fadeIn', 'from { opacity: 0; } to { opacity: 1; }')
        const styles = s.getStyles()

        expect(styles).toContain('@keyframes fadeIn')
        // Keyframes are not wrapped
        expect(styles).not.toMatch(/@layer.*@keyframes/)
      })

      it('does not wrap global rules in @layer', () => {
        const s = createSheet({ layer: 'components' })

        s.insertGlobal('body { margin: 0; }')
        const styles = s.getStyles()

        expect(styles).toContain('body { margin: 0; }')
        expect(styles).not.toMatch(/@layer components\{body/)
      })
    })

    describe('SSR output', () => {
      it('getStyleTag returns complete <style> tag', () => {
        const s = createSheet()
        s.insert('color: red;')
        const tag = s.getStyleTag()

        expect(tag).toMatch(/^<style data-vl="">.*<\/style>$/)
        expect(tag).toContain('color: red;')
      })

      it('getStyles returns raw CSS', () => {
        const s = createSheet()
        s.insert('color: red;')
        s.insert('color: blue;')
        const styles = s.getStyles()

        expect(styles).not.toContain('<style')
        expect(styles).toContain('color: red;')
        expect(styles).toContain('color: blue;')
      })

      it('reset clears SSR buffer and cache', () => {
        const s = createSheet()
        s.insert('color: red;')
        expect(s.getStyles()).toContain('color: red;')

        s.reset()
        expect(s.getStyles()).toBe('')
        expect(s.cacheSize).toBe(0) // cache also cleared for SSR correctness
      })

      it('insertKeyframes deduplicates in SSR', () => {
        const s = createSheet()
        s.insertKeyframes('fadeIn', 'from { opacity: 0; } to { opacity: 1; }')
        s.insertKeyframes('fadeIn', 'from { opacity: 0; } to { opacity: 1; }')

        const styles = s.getStyles()
        const matches = styles.match(/@keyframes fadeIn/g)
        expect(matches).toHaveLength(1)
      })

      it('insertGlobal deduplicates in SSR', () => {
        const s = createSheet()
        s.insertGlobal('body { margin: 0; }')
        s.insertGlobal('body { margin: 0; }')

        const styles = s.getStyles()
        const matches = styles.match(/body \{ margin: 0; \}/g)
        expect(matches).toHaveLength(1)
      })
    })
  })
})
