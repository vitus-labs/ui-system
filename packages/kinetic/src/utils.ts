import type { CSSProperties } from 'react'
import type { ClassTransitionProps, StyleTransitionProps } from './types'

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

type TransitionConfig = ClassTransitionProps & StyleTransitionProps

type Phase = 'enter' | 'leave'

/**
 * Starts a phase: clears the opposite phase's classes (interrupted
 * transition), applies the start state, flips to "to" next frame. `delay` goes
 * AFTER the `transition` shorthand, which resets transition-delay to 0.
 */
const runPhase = (
  el: HTMLElement,
  c: TransitionConfig,
  p: Phase,
  delay?: number,
) => {
  const o = p === 'enter' ? 'leave' : 'enter'
  removeClasses(el, c[o])
  removeClasses(el, c[`${o}From`])
  removeClasses(el, c[`${o}To`])

  addClasses(el, c[p])
  addClasses(el, c[`${p}From`])
  if (c[`${p}Style`]) Object.assign(el.style, c[`${p}Style`])
  if (c[`${p}Transition`]) el.style.transition = c[`${p}Transition`] as string
  if (delay !== undefined) el.style.transitionDelay = `${delay}ms`

  return nextFrame(() => {
    removeClasses(el, c[`${p}From`])
    addClasses(el, c[`${p}To`])
    if (c[`${p}ToStyle`]) Object.assign(el.style, c[`${p}ToStyle`])
  })
}

export const applyEnter = (el: HTMLElement, c: TransitionConfig, d?: number) =>
  runPhase(el, c, 'enter', d)

export const applyLeave = (el: HTMLElement, c: TransitionConfig, d?: number) =>
  runPhase(el, c, 'leave', d)

/** Cleans up once a stage settles (entered/hidden). */
export const applySettled = (
  el: HTMLElement,
  config: TransitionConfig,
  stage: string,
  delay?: number,
) => {
  if (stage === 'entered') {
    removeClasses(el, config.enter)
    el.style.transition = ''
    if (delay !== undefined) el.style.transitionDelay = ''
  }
  if (stage === 'entered' || stage === 'hidden') {
    removeClasses(el, config.enterFrom)
    removeClasses(el, config.leaveFrom)
  }
}

type KeyedEntry<E> = { key: string | number; element: E }

/**
 * Inserts leaving entries at their previous position (after the nearest
 * surviving predecessor) — moving a leaving node would cancel its exit.
 */
export const mergeLeaving = <E>(
  current: KeyedEntry<E>[],
  leaving: Map<string | number, E>,
  prevOrder: (string | number)[],
): KeyedEntry<E>[] => {
  const result = [...current]
  let at = 0
  for (const key of prevOrder) {
    const i = result.findIndex((r) => r.key === key)
    if (i >= 0) at = i + 1
    else if (leaving.has(key))
      result.splice(at++, 0, { key, element: leaving.get(key) as E })
  }
  return result
}

/** Dev-only console warning (stripped from production builds). */
export const devWarn = (msg: string) => {
  if (process.env.NODE_ENV === 'production') return
  // biome-ignore lint/suspicious/noConsole: dev-mode warning
  console.warn(`[kinetic] ${msg}`)
}

let warnedMissingKey = false

/** Dev-only: warns (once) about group children rendered without a `key`. */
export const warnMissingKey = () => {
  if (warnedMissingKey) return
  warnedMissingKey = true
  devWarn('TransitionGroup children need a unique `key`; others are ignored.')
}
