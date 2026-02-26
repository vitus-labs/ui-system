import type { CSSProperties } from 'react'

/** Adds space-separated CSS classes to an element. */
export const addClasses = (el: HTMLElement, classes: string | undefined) => {
  if (!classes) return
  const list = classes.split(/\s+/).filter(Boolean)
  if (list.length > 0) el.classList.add(...list)
}

/** Removes space-separated CSS classes from an element. */
export const removeClasses = (el: HTMLElement, classes: string | undefined) => {
  if (!classes) return
  const list = classes.split(/\s+/).filter(Boolean)
  if (list.length > 0) el.classList.remove(...list)
}

/**
 * Executes callback after two animation frames (double-rAF).
 * Ensures the browser paints the current state before applying changes,
 * which is required for CSS transitions to trigger.
 */
export const nextFrame = (callback: () => void): number =>
  requestAnimationFrame(() => {
    requestAnimationFrame(callback)
  })

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
