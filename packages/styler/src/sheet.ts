/**
 * StyleSheet manager. Handles CSS rule injection, hash-based deduplication,
 * SSR buffering, client-side hydration, bounded cache, and @layer support.
 */
/* eslint-disable no-console */
import { hash } from './hash'

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
  private sheet: CSSStyleSheet | null = null
  private ssrBuffer: string[] = []
  private isSSR: boolean
  private maxCacheSize: number
  private layer: string | undefined

  constructor(options: StyleSheetOptions = {}) {
    this.maxCacheSize = options.maxCacheSize ?? DEFAULT_MAX_CACHE_SIZE
    this.layer = options.layer
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

    // Inject @layer declaration if configured
    if (this.layer && this.sheet) {
      try {
        this.sheet.insertRule(`@layer ${this.layer};`, 0)
      } catch {
        // skip if @layer not supported
      }
    }
  }

  /** Parse existing rules from SSR-rendered <style> tag into cache. */
  private hydrateFromTag(el: HTMLStyleElement) {
    const sheet = el.sheet
    if (!sheet) return

    for (let i = 0; i < sheet.cssRules.length; i++) {
      const rule = sheet.cssRules[i]
      if (rule instanceof CSSStyleRule) {
        // Extract class name from selector: ".vl-abc123" → "vl-abc123"
        const className = rule.selectorText.slice(1)
        this.cache.set(className, className)
      }
    }
  }

  /** Evict oldest entries when cache exceeds max size. */
  private evictIfNeeded() {
    if (this.cache.size <= this.maxCacheSize) return

    // Map iteration order is insertion order — delete oldest 10%
    const toDelete = Math.floor(this.maxCacheSize * 0.1)
    let count = 0
    for (const key of this.cache.keys()) {
      if (count >= toDelete) break
      this.cache.delete(key)
      count++
    }
  }

  /**
   * Compute a className from CSS text without injecting (pure function for render phase).
   * Used with useInsertionEffect pattern: compute class during render, inject in effect.
   */
  getClassName(cssText: string): string {
    const h = hash(cssText)
    return `${PREFIX}-${h}`
  }

  /**
   * Insert a CSS rule. Returns the class name (deterministic, hash-based).
   * Deduplicates: same CSS text always produces the same class name and
   * the rule is only injected once.
   */
  insert(cssText: string): string {
    const h = hash(cssText)
    const className = `${PREFIX}-${h}`

    if (this.cache.has(className)) return className

    this.evictIfNeeded()
    this.cache.set(className, className)

    const baseRule = `.${className}{${cssText}}`
    const rule = this.layer ? `@layer ${this.layer}{${baseRule}}` : baseRule

    if (this.isSSR) {
      this.ssrBuffer.push(rule)
    } else if (this.sheet) {
      try {
        this.sheet.insertRule(rule, this.sheet.cssRules.length)
      } catch (e) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(
            `[styler] Failed to insert CSS rule for .${className}:`,
            (e as Error).message,
            '\nCSS:',
            cssText.slice(0, 200),
          )
        }
      }
    }

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
          console.warn(
            `[styler] Failed to insert @keyframes "${name}":`,
            (e as Error).message,
          )
        }
      }
    }
  }

  /** Insert a global CSS rule (no wrapper selector). Deduplicates by hash. */
  insertGlobal(cssText: string): void {
    const h = hash(cssText)
    const key = `global-${h}`

    if (this.cache.has(key)) return

    this.evictIfNeeded()
    this.cache.set(key, key)

    if (this.isSSR) {
      this.ssrBuffer.push(cssText)
    } else if (this.sheet) {
      try {
        this.sheet.insertRule(cssText, this.sheet.cssRules.length)
      } catch (e) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(
            '[styler] Failed to insert global CSS rule:',
            (e as Error).message,
            '\nCSS:',
            cssText.slice(0, 200),
          )
        }
      }
    }
  }

  /** Returns collected CSS for SSR as a complete `<style>` tag string. */
  getStyleTag(): string {
    return `<style ${ATTR}="">${this.ssrBuffer.join('')}</style>`
  }

  /** Returns collected CSS rules as a raw string (useful for streaming SSR). */
  getStyles(): string {
    return this.ssrBuffer.join('')
  }

  /** Reset SSR buffer (for concurrent server requests). */
  reset(): void {
    this.ssrBuffer = []
  }

  /** Clear the dedup cache. Useful for HMR / dev-time reloads. */
  clearCache(): void {
    this.cache.clear()
  }

  /**
   * Full cleanup: clear cache and remove all CSS rules from the DOM.
   * Intended for HMR / dev-time reloads where stale styles must be purged.
   *
   *   if (import.meta.hot) {
   *     import.meta.hot.accept(() => sheet.clearAll())
   *   }
   */
  clearAll(): void {
    this.cache.clear()
    this.ssrBuffer = []
    if (this.sheet) {
      while (this.sheet.cssRules.length > 0) {
        this.sheet.deleteRule(0)
      }
    }
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
