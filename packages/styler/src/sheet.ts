/**
 * StyleSheet manager. Handles CSS rule injection, hash-based deduplication,
 * SSR buffering, client-side hydration, bounded cache, and @layer support.
 *
 * Media queries (@media), @supports, and @container blocks nested inside
 * component CSS are automatically extracted into separate top-level rules.
 * This matches the approach used by styled-components and Emotion, avoiding
 * reliance on CSS Nesting for at-rules (which has CSSOM specification gaps
 * per W3C csswg-drafts#7850).
 */
import { evictMapByPercent } from './evict'
import { hash } from './hash'
import { clearNormCache } from './resolve'

const PREFIX = 'vl'
const ATTR = `data-${PREFIX}`
const DEFAULT_MAX_CACHE_SIZE = 10000

export interface StyleSheetOptions {
  /** Maximum number of cached rules before eviction (default: 10000). */
  maxCacheSize?: number
  /** CSS @layer name to wrap scoped rules in. */
  layer?: string
}

export class StyleSheet {
  private cache = new Map<string, string>()
  private insertCache = new Map<string, string>()
  private prepareCache = new Map<string, { className: string; rules: string }>()

  // 2-slot LRU in front of prepareCache / insertCache (reference-compare hot path).
  private prepareHotA: {
    key: string
    value: { className: string; rules: string }
  } | null = null
  private prepareHotB: {
    key: string
    value: { className: string; rules: string }
  } | null = null

  private insertHotA: { key: string; value: string } | null = null
  private insertHotB: { key: string; value: string } | null = null
  private sheet: CSSStyleSheet | null = null
  private ssrBuffer: string[] = []
  private isSSR: boolean
  private maxCacheSize: number
  private layer: string | undefined

  constructor(options: StyleSheetOptions = {}) {
    this.maxCacheSize = options.maxCacheSize ?? DEFAULT_MAX_CACHE_SIZE
    this.layer = options.layer
    // Per-instance SSR check — tests toggle `globalThis.document` between
    // createSheet() calls to simulate SSR/client transitions, so we can't
    // freeze this at module load.
    this.isSSR = typeof document === 'undefined'
    if (!this.isSSR) this.mount()
  }

  private mount() {
    // Reuse existing <style> tag from SSR hydration
    const existing = document.querySelector(
      `style[${ATTR}]`,
    ) as HTMLStyleElement | null

    if (existing) {
      this.sheet = existing.sheet ?? null
      this.hydrateFromTag(existing)
    } else {
      const el = document.createElement('style')
      el.setAttribute(ATTR, '')
      document.head.appendChild(el)
      this.sheet = el.sheet ?? null
    }

    // Hydrate from React 19 `<style precedence data-href="…">` tags emitted
    // during SSR. The default SSR path is precedence-only, so without this
    // step the cache would miss on first client render and `insert()` would
    // duplicate every rule into the `data-vl` sheet — visible as doubled
    // styles in the DOM.
    this.hydrateFromPrecedenceTags()

    // Inject @layer declaration if configured
    if (this.layer && this.sheet) {
      try {
        this.sheet.insertRule(`@layer ${this.layer};`, 0)
      } catch {
        // skip if @layer not supported
      }
    }
  }

  /**
   * Populate the dedup cache from React 19's `<style data-precedence data-href>`
   * tags. The `data-href` is the same shape we'd compute client-side
   * (`vl-<hash>` for component styles, `g-<hash>` for globals), so a Map
   * pre-population is sufficient — no need to re-parse the cssText.
   */
  private hydrateFromPrecedenceTags() {
    const tags = document.querySelectorAll<HTMLStyleElement>(
      'style[data-precedence][data-href]',
    )
    tags.forEach((el) => {
      const href = el.getAttribute('data-href')
      if (!href) return
      if (href.startsWith(`${PREFIX}-`) || href.startsWith('g-')) {
        this.cache.set(href, href)
      }
    })
  }

  /** Extract className from a selector like ".vl-abc" or ".vl-abc.vl-abc" → "vl-abc" */
  private extractClassName(selectorText: string): string | null {
    if (selectorText[0] !== '.') return null
    const dotIdx = selectorText.indexOf('.', 1)
    return dotIdx > 0 ? selectorText.slice(1, dotIdx) : selectorText.slice(1)
  }

  /** Parse existing rules from SSR-rendered <style> tag into cache. */
  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: SSR hydration walker — branches by CSSRule subtype
  private hydrateFromTag(el: HTMLStyleElement) {
    const sheet = el.sheet
    if (!sheet) return

    for (let i = 0; i < sheet.cssRules.length; i++) {
      const rule = sheet.cssRules[i]

      if (rule instanceof CSSStyleRule) {
        const className = this.extractClassName(rule.selectorText)
        if (className) this.cache.set(className, className)
      }

      // Handle split @media rules that wrap our selectors
      if (typeof CSSMediaRule !== 'undefined' && rule instanceof CSSMediaRule) {
        for (let j = 0; j < rule.cssRules.length; j++) {
          const inner = rule.cssRules[j]
          if (inner instanceof CSSStyleRule) {
            const className = this.extractClassName(inner.selectorText)
            if (className) this.cache.set(className, className)
          }
        }
      }
    }
  }

  /** Evict oldest ~10% from any cache over maxCacheSize. */
  private evictIfNeeded() {
    if (this.cache.size > this.maxCacheSize) {
      evictMapByPercent(this.cache, 0.1)
    }
    if (this.insertCache.size > this.maxCacheSize) {
      evictMapByPercent(this.insertCache, 0.1)
    }
    if (this.prepareCache.size > this.maxCacheSize) {
      evictMapByPercent(this.prepareCache, 0.1)
    }
  }

  /**
   * Extract nested at-rules (@media, @supports, @container) from CSS text
   * and wrap their content in the given selector as separate top-level rules.
   *
   * This converts:
   *   "color:red; @media (min-width:600px){font-size:2rem;}"
   * Into:
   *   { base: "color:red;", atRules: ["@media (min-width:600px){.vl-abc{font-size:2rem;}}"] }
   *
   * Non-at-rule brace blocks (like &:hover{...}) are preserved in the base CSS.
   */
  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: single-pass at-rule scanner — depth tracking + position bookkeeping is essential
  private splitAtRules(
    cssText: string,
    selector: string,
  ): { base: string; atRules: string[] } {
    // Fast path: no at-rules to split
    if (cssText.indexOf('@') === -1) return { base: cssText, atRules: [] }

    const atRules: string[] = []
    const baseParts: string[] = []
    const len = cssText.length
    let depth = 0
    let atStart = -1
    let lastBase = 0

    // charCodeAt access avoids the per-iteration 1-char string allocation
    // that `cssText[i]` triggers in V8. Material in long stylesheets.
    for (let i = 0; i < len; i++) {
      const ch = cssText.charCodeAt(i)

      if (ch === 123 /* { */) {
        depth++
      } else if (ch === 125 /* } */) {
        depth--
        if (depth === 0 && atStart >= 0) {
          // End of a tracked at-rule block — extract and wrap with selector
          const openBrace = cssText.indexOf('{', atStart)
          const atPrefix = cssText.slice(atStart, openBrace).trim()
          const innerCSS = cssText.slice(openBrace + 1, i).trim()
          if (innerCSS) {
            atRules.push(`${atPrefix}{${selector}{${innerCSS}}}`)
          }
          atStart = -1
          lastBase = i + 1
        }
      } else if (depth === 0 && ch === 64 /* @ */ && atStart < 0) {
        // Dispatch on 2nd char to avoid slicing a fresh 20-char string per
        // '@' just to regex-match it. startsWith is a V8 intrinsic — no
        // allocation, no regex compile.
        const c1 = cssText.charCodeAt(i + 1)
        if (
          (c1 === 109 /* m */ && cssText.startsWith('@media', i)) ||
          (c1 === 115 /* s */ && cssText.startsWith('@supports', i)) ||
          (c1 === 99 /* c */ && cssText.startsWith('@container', i))
        ) {
          const baseBefore = cssText.slice(lastBase, i).trim()
          if (baseBefore) baseParts.push(baseBefore)
          atStart = i
        }
      }
    }

    // Collect remaining base CSS after the last at-rule
    if (lastBase < cssText.length && atStart < 0) {
      const remaining = cssText.slice(lastBase).trim()
      if (remaining) baseParts.push(remaining)
    }

    // If no at-rules were found, return original unchanged
    if (atRules.length === 0) return { base: cssText, atRules: [] }

    return { base: baseParts.join(' '), atRules }
  }

  /** Compute className without injecting (paired with useInsertionEffect). */
  getClassName(cssText: string): string {
    // Same 2-slot LRU as insert(), keyed on unboosted cssText.
    const hotA = this.insertHotA
    if (hotA !== null) {
      if (hotA.key === cssText) return hotA.value
      const hotB = this.insertHotB
      if (hotB !== null && hotB.key === cssText) {
        this.insertHotB = hotA
        this.insertHotA = hotB
        return hotB.value
      }
    }
    const cached = this.insertCache.get(cssText)
    if (cached) {
      this.insertHotB = hotA
      this.insertHotA = { key: cssText, value: cached }
      return cached
    }
    const h = hash(cssText)
    return `${PREFIX}-${h}`
  }

  /**
   * Insert CSS rules. Returns deterministic class name. Dedupes by cssText.
   * Nested @media/@supports/@container are extracted into top-level rules.
   * `boost` doubles the selector (`.vl-abc.vl-abc`) for higher specificity.
   */
  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: hot-path
  insert(cssText: string, boost = false): string {
    const icKey = boost ? `${cssText}\0` : cssText
    const hotA = this.insertHotA
    if (hotA !== null) {
      if (hotA.key === icKey) return hotA.value
      const hotB = this.insertHotB
      if (hotB !== null && hotB.key === icKey) {
        this.insertHotB = hotA
        this.insertHotA = hotB
        return hotB.value
      }
    }

    const icHit = this.insertCache.get(icKey)
    if (icHit) {
      this.insertHotB = hotA
      this.insertHotA = { key: icKey, value: icHit }
      return icHit
    }

    const h = hash(cssText)
    const className = `${PREFIX}-${h}`

    // Verify the cached cssText matches — FNV-1a collision (1-in-4B) detected here.
    // `existing === className` is the legacy reservation pattern (SSR hydration,
    // globalStyle, keyframes — those don't carry original cssText).
    const existing = this.cache.get(className)
    if (existing !== undefined) {
      if (
        process.env.NODE_ENV !== 'production' &&
        existing !== className &&
        existing !== cssText
      ) {
        // biome-ignore lint/suspicious/noConsole: dev-only hash-collision diagnostic
        console.warn(
          `[@vitus-labs/styler] hash collision on class ${className} — different CSS strings produced the same hash. First inserted: ${existing.slice(0, 80)}… / now: ${cssText.slice(0, 80)}…`,
        )
      }
      this.insertCache.set(icKey, className)
      this.insertHotB = this.insertHotA
      this.insertHotA = { key: icKey, value: className }
      return className
    }

    this.evictIfNeeded()
    this.cache.set(className, cssText)

    const selector = boost ? `.${className}.${className}` : `.${className}`
    const layer = this.layer

    // Fast path: no @-rules + no @layer wrap → emit a single rule, skip
    // splitAtRules (regex + linear scan + two intermediate arrays + map +
    // spread). Hits on ~95% of styled CSS.
    if (cssText.indexOf('@') === -1 && !layer) {
      if (cssText.length > 0) {
        const rule = `${selector}{${cssText}}`
        if (this.isSSR) {
          this.ssrBuffer.push(rule)
        } else if (this.sheet) {
          try {
            this.sheet.insertRule(rule, this.sheet.cssRules.length)
          } catch (e) {
            if (process.env.NODE_ENV !== 'production') {
              // biome-ignore lint/suspicious/noConsole: dev-mode diagnostic — silent in production
              console.warn(
                `[styler] Failed to insert CSS rule for .${className}:`,
                (e as Error).message,
                '\nCSS:',
                rule.slice(0, 200),
              )
            }
          }
        }
      }
      this.insertCache.set(icKey, className)
      this.insertHotB = this.insertHotA
      this.insertHotA = { key: icKey, value: className }
      return className
    }

    // Slow path: split nested at-rules + wrap with @layer if configured.
    const { base, atRules } = this.splitAtRules(cssText, selector)

    const emit = (rule: string) => {
      if (this.isSSR) {
        this.ssrBuffer.push(rule)
      } else if (this.sheet) {
        try {
          this.sheet.insertRule(rule, this.sheet.cssRules.length)
        } catch (e) {
          if (process.env.NODE_ENV !== 'production') {
            // biome-ignore lint/suspicious/noConsole: dev-mode diagnostic — silent in production
            console.warn(
              `[styler] Failed to insert CSS rule for .${className}:`,
              (e as Error).message,
              '\nCSS:',
              rule.slice(0, 200),
            )
          }
        }
      }
    }

    if (base) {
      emit(
        layer
          ? `@layer ${layer}{${selector}{${base}}}`
          : `${selector}{${base}}`,
      )
    }
    for (let i = 0; i < atRules.length; i++) {
      const r = atRules[i] as string
      emit(layer ? `@layer ${layer}{${r}}` : r)
    }

    this.insertCache.set(icKey, className)
    this.insertHotB = this.insertHotA
    this.insertHotA = { key: icKey, value: className }
    return className
  }

  /** Insert a @keyframes rule. Deduplicates by animation name. */
  insertKeyframes(name: string, body: string): void {
    if (this.cache.has(name)) return

    this.evictIfNeeded()
    this.cache.set(name, name)

    const rule = `@keyframes ${name}{${body}}`

    if (this.isSSR) {
      this.ssrBuffer.push(rule)
    } else if (this.sheet) {
      try {
        this.sheet.insertRule(rule, this.sheet.cssRules.length)
      } catch (e) {
        if (process.env.NODE_ENV !== 'production') {
          // biome-ignore lint/suspicious/noConsole: dev-mode diagnostic — silent in production
          console.warn(
            `[styler] Failed to insert @keyframes "${name}":`,
            (e as Error).message,
          )
        }
      }
    }
  }

  /**
   * Split CSS text into individual top-level rules.
   * CSSStyleSheet.insertRule() only accepts one rule at a time,
   * so multi-rule CSS must be split before injection.
   */
  private splitRules(cssText: string): string[] {
    const rules: string[] = []
    const len = cssText.length
    let depth = 0
    let start = 0

    for (let i = 0; i < len; i++) {
      const ch = cssText.charCodeAt(i)
      if (ch === 123 /* { */) depth++
      else if (ch === 125 /* } */) {
        depth--
        if (depth === 0) {
          const rule = cssText.slice(start, i + 1).trim()
          if (rule) rules.push(rule)
          start = i + 1
        }
      }
    }

    return rules
  }

  /** Insert global CSS rules (no wrapper selector). Deduplicates by hash. */
  insertGlobal(cssText: string): void {
    const h = hash(cssText)
    // Cache key matches the `data-href` shape emitted by createGlobalStyle's
    // <style precedence> tag, so SSR hydration via `hydrateFromPrecedenceTags`
    // can populate this same key and prevent duplicate insertion on the client.
    const key = `g-${h}`

    if (this.cache.has(key)) return

    this.evictIfNeeded()
    this.cache.set(key, key)

    if (this.isSSR) {
      this.ssrBuffer.push(cssText)
    } else if (this.sheet) {
      // Global CSS often contains multiple top-level rules.
      // CSSStyleSheet.insertRule() only accepts one rule at a time,
      // so we split and insert each rule individually.
      const rules = this.splitRules(cssText)
      for (const rule of rules) {
        try {
          this.sheet.insertRule(rule, this.sheet.cssRules.length)
        } catch (e) {
          if (process.env.NODE_ENV !== 'production') {
            // biome-ignore lint/suspicious/noConsole: dev-mode diagnostic — silent in production
            console.warn(
              '[styler] Failed to insert global CSS rule:',
              (e as Error).message,
              '\nCSS:',
              rule.slice(0, 200),
            )
          }
        }
      }
    }
  }

  /**
   * Returns collected CSS for SSR as a complete `<style>` tag string.
   *
   * NOTE: With the default React 19 `<style precedence>` SSR path, this
   * buffer is **empty** — components emit their own precedence tags inline,
   * which React collects and dedupes automatically. This API is retained as
   * an opt-in "manual mode" for callers that explicitly push rules into the
   * buffer (e.g. legacy SSR pipelines via direct `sheet.insert(cssText)`
   * calls outside of render).
   */
  getStyleTag(): string {
    const css = this.ssrBuffer.join('').replace(/<\/style/gi, '<\\/style')
    return `<style ${ATTR}="">${css}</style>`
  }

  /**
   * Returns collected CSS rules as a raw string (useful for streaming SSR).
   * See `getStyleTag` for caveats — empty unless rules were pushed manually.
   */
  getStyles(): string {
    return this.ssrBuffer.join('')
  }

  /** Invalidate the 2-slot LRU hot caches in front of insert/prepare. */
  private clearHotSlots(): void {
    this.insertHotA = null
    this.insertHotB = null
    this.prepareHotA = null
    this.prepareHotB = null
  }

  /** Reset SSR buffer and cache (call between server requests). */
  reset(): void {
    this.ssrBuffer = []
    this.cache.clear()
    this.insertCache.clear()
    this.prepareCache.clear()
    this.clearHotSlots()
  }

  /** Clear the dedup cache. Useful for HMR / dev-time reloads. */
  clearCache(): void {
    this.cache.clear()
    this.insertCache.clear()
    this.prepareCache.clear()
    this.clearHotSlots()
    clearNormCache()
  }

  /**
   * Full cleanup: clear cache and remove all CSS rules from the DOM.
   * Intended for HMR / dev-time reloads where stale styles must be purged.
   * Also fires every callback registered via `onClear` so other modules
   * (e.g. styled.ts's static-component cache) can purge their own state.
   *
   *   if (import.meta.hot) {
   *     import.meta.hot.accept(() => sheet.clearAll())
   *   }
   */
  clearAll(): void {
    this.cache.clear()
    this.insertCache.clear()
    this.prepareCache.clear()
    this.clearHotSlots()
    clearNormCache()
    this.ssrBuffer = []
    if (this.sheet) {
      while (this.sheet.cssRules.length > 0) {
        this.sheet.deleteRule(0)
      }
    }
    for (const cb of clearCallbacks) cb()
  }

  /** Compute className + rule text without injecting (for React 19 <style precedence>). */
  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: hot-path
  prepare(
    cssText: string,
    boost = false,
  ): { className: string; rules: string } {
    const prepKey = boost ? `${cssText}\0` : cssText
    const hotA = this.prepareHotA
    if (hotA !== null) {
      if (hotA.key === prepKey) return hotA.value
      const hotB = this.prepareHotB
      if (hotB !== null && hotB.key === prepKey) {
        this.prepareHotB = hotA
        this.prepareHotA = hotB
        return hotB.value
      }
    }

    const cached = this.prepareCache.get(prepKey)
    if (cached) {
      this.prepareHotB = hotA
      this.prepareHotA = { key: prepKey, value: cached }
      return cached
    }

    const h = hash(cssText)
    const className = `${PREFIX}-${h}`
    const selector = boost ? `.${className}.${className}` : `.${className}`

    // Fast path: no @-rules + no @layer → skip splitAtRules (hits ~95% of CSS).
    let rules: string
    if (cssText.indexOf('@') === -1 && !this.layer) {
      rules = cssText.length > 0 ? `${selector}{${cssText}}` : ''
    } else {
      const { base, atRules } = this.splitAtRules(cssText, selector)
      const layer = this.layer
      if (base) {
        rules = layer
          ? `@layer ${layer}{${selector}{${base}}}`
          : `${selector}{${base}}`
      } else {
        rules = ''
      }
      for (let i = 0; i < atRules.length; i++) {
        const r = atRules[i] as string
        rules += layer ? `@layer ${layer}{${r}}` : r
      }
    }

    const result = { className, rules }
    this.prepareCache.set(prepKey, result)
    this.prepareHotB = hotA
    this.prepareHotA = { key: prepKey, value: result }
    return result
  }

  /** Check if a className is already in the cache. O(1) Map lookup. */
  has(className: string): boolean {
    return this.cache.has(className)
  }

  /** Current number of cached rules. */
  get cacheSize(): number {
    return this.cache.size
  }
}

/**
 * Subscribers fired by `clearAll()`. Other modules (e.g. styled.ts's
 * static-component caches) register here so a single `sheet.clearAll()`
 * resets every layer of state — useful for HMR.
 */
const clearCallbacks: Array<() => void> = []

/** Register a callback to be invoked on `sheet.clearAll()`. */
export const onSheetClear = (cb: () => void): void => {
  clearCallbacks.push(cb)
}

/** Default singleton sheet for client-side use. */
export const sheet = new StyleSheet()

/**
 * Factory for creating isolated StyleSheet instances.
 * Use in SSR to get per-request isolation:
 *
 *   const sheet = createSheet()
 *   // render with this sheet...
 *   const html = sheet.getStyleTag()
 *   sheet.reset()
 */
export const createSheet = (options?: StyleSheetOptions): StyleSheet =>
  new StyleSheet(options)
