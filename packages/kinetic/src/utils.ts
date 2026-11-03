import type { CSSProperties } from 'react'
import type {
  ClassTransitionProps,
  StyleTransitionProps,
  TransitionCallbacks,
} from './types'

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

// Runs `callback` after two animation frames (double-rAF) so the current
// state paints first — required for CSS transitions to trigger. Returns a
// canceller that aborts BOTH frames (fast toggles, StrictMode).
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

export type TransitionConfig = ClassTransitionProps & StyleTransitionProps

type Phase = 'enter' | 'leave'
type Styles = Record<string, string>

// Inline values an in-flight phase overwrote; restored once it settles.
const saved = new WeakMap<HTMLElement, Styles>()

// Starts a phase: snapshots the inline values it will touch, clears the
// opposite phase's classes, applies the start state (skipped when reversing
// an in-flight phase — no flash), flips to "to" next frame. `delay` goes
// AFTER the `transition` shorthand, which resets transition-delay to 0.
const runPhase = (
  el: HTMLElement,
  c: TransitionConfig,
  p: Phase,
  delay?: number,
) => {
  const o = p === 'enter' ? 'leave' : 'enter'
  const s = el.style as unknown as Styles
  const mid = saved.get(el)
  const snap = mid ?? {}
  saved.set(el, snap)
  for (const k of [
    'transition',
    'transitionDelay',
    ...Object.keys({ ...c[`${p}Style`], ...c[`${p}ToStyle`] }),
  ])
    snap[k] ??= s[k] as string

  removeClasses(el, c[o])
  removeClasses(el, c[`${o}From`])
  removeClasses(el, c[`${o}To`])

  addClasses(el, c[p])
  if (!mid) {
    addClasses(el, c[`${p}From`])
    Object.assign(s, c[`${p}Style`])
  }
  if (c[`${p}Transition`]) s.transition = c[`${p}Transition`] as string
  if (delay !== undefined) s.transitionDelay = `${delay}ms`

  return nextFrame(() => {
    removeClasses(el, c[`${p}From`])
    addClasses(el, c[`${p}To`])
    Object.assign(s, c[`${p}ToStyle`])
  })
}

// Cleans up once a stage settles: restores what the phase overwrote.
const applySettled = (el: HTMLElement, c: TransitionConfig, stage: string) => {
  if (stage === 'entered') removeClasses(el, c.enter)
  if (stage === 'entered' || stage === 'hidden') {
    removeClasses(el, c.enterFrom)
    removeClasses(el, c.leaveFrom)
    Object.assign(el.style, saved.get(el))
    saved.delete(el)
  }
}

// Drives the DOM side of a transition stage (layout effect body). Under
// reduced motion a phase completes at once — also when it flips mid-phase.
export const runStage = (
  el: HTMLElement,
  stage: string,
  c: TransitionConfig,
  cb: Partial<TransitionCallbacks>,
  complete: () => void,
  reduced: boolean,
  delay?: number,
) => {
  const p =
    stage === 'entering' ? 'enter' : stage === 'leaving' ? 'leave' : null
  if (p) {
    const P = p === 'enter' ? 'Enter' : 'Leave'
    // reduced motion flipped on mid-phase: on${P} already fired
    if (!reduced || !saved.has(el)) cb[`on${P}`]?.()
    if (!reduced) return runPhase(el, c, p, delay)
    cb[`onAfter${P}`]?.()
    complete()
  }
  applySettled(el, c, stage)
}

// Start-state props for the first (SSR/hydration) render of `appear`.
export const appearProps = (p: Record<string, any>, c: TransitionConfig) => ({
  className: mergeClassNames(
    p.className,
    mergeClassNames(c.enter, c.enterFrom),
  ),
  style: mergeStyles(p.style, c.enterStyle),
})


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
