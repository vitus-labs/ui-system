import type { CSSProperties } from 'react'

// Bounded memoization of split class strings. Most consumers feed static
// preset strings (a handful of unique values), but a consumer composing
// className per render could grow this unbounded — match the project-wide
// `evictMapByPercent` pattern used in styler.
const SPLIT_CACHE_LIMIT = 256
const splitCache = new Map<string, string[]>()
const splitClasses = (classes: string): string[] => {
  let cached = splitCache.get(classes)
  if (!cached) {
    cached = classes.split(/\s+/).filter(Boolean)
    if (splitCache.size > SPLIT_CACHE_LIMIT) {
      // Evict oldest ~10% (Map iteration order is insertion order).
      const toDelete = Math.floor(splitCache.size * 0.1)
      let count = 0
      for (const key of splitCache.keys()) {
        if (count >= toDelete) break
        splitCache.delete(key)
        count++
      }
    }
    splitCache.set(classes, cached)
  }
  return cached
}

/** Adds space-separated CSS classes to an element. */
export const addClasses = (el: HTMLElement, classes: string | undefined) => {
  if (!classes) return
  const list = splitClasses(classes)
  if (list.length > 0) el.classList.add(...list)
}

/** Removes space-separated CSS classes from an element. */
export const removeClasses = (el: HTMLElement, classes: string | undefined) => {
  if (!classes) return
  const list = splitClasses(classes)
  if (list.length > 0) el.classList.remove(...list)
}

/**
 * Executes `callback` after two animation frames (double-rAF). Ensures the
 * browser paints the current state before applying changes — required for
 * CSS transitions to trigger.
 *
 * Returns a canceller that aborts BOTH frames. The prior implementation
 * returned only the outer rAF id, so cancelling left the inner rAF live
 * and the callback fired against potentially-stale or detached elements on
 * fast toggles (open-while-closing, StrictMode double-invoke). Each
 * consumer's effect cleanup now invokes the returned function.
 */
export const nextFrame = (callback: () => void): (() => void) => {
  let cancelled = false
  const outerId = requestAnimationFrame(() => {
    if (cancelled) return
    requestAnimationFrame(() => {
      if (!cancelled) callback()
    })
  })
  return () => {
    cancelled = true
    cancelAnimationFrame(outerId)
  }
}

/** Merges two className strings, filtering undefined/empty. */
export const mergeClassNames = (
  existing: string | undefined,
  additional: string | undefined,
): string | undefined => {
  const parts = [existing, additional].filter(Boolean)
  return parts.length > 0 ? parts.join(' ') : undefined
}

/** Merges two CSSProperties objects, with `b` taking precedence. */
export const mergeStyles = (
  a: CSSProperties | undefined,
  b: CSSProperties | undefined,
): CSSProperties | undefined => {
  if (!a && !b) return undefined
  if (!a) return b
  if (!b) return a
  return { ...a, ...b }
}
