import type { CSSProperties } from 'react'
import type { Preset } from './types'

// ─── Internal merge helpers ─────────────────────────────────────────

const mergeStyle = (
  a: CSSProperties | undefined,
  b: CSSProperties | undefined,
): CSSProperties | undefined => (b ? { ...a, ...b } : a)

const concatClass = (
  a: string | undefined,
  b: string | undefined,
): string | undefined => (b ? (a ? `${a} ${b}` : b) : a)

const mergeStyles = (result: Preset, p: Preset): void => {
  result.enterStyle = mergeStyle(result.enterStyle, p.enterStyle)
  result.enterToStyle = mergeStyle(result.enterToStyle, p.enterToStyle)
  result.leaveStyle = mergeStyle(result.leaveStyle, p.leaveStyle)
  result.leaveToStyle = mergeStyle(result.leaveToStyle, p.leaveToStyle)
  if (p.enterTransition) result.enterTransition = p.enterTransition
  if (p.leaveTransition) result.leaveTransition = p.leaveTransition
}

const mergeClasses = (result: Preset, p: Preset): void => {
  result.enter = concatClass(result.enter, p.enter)
  result.enterFrom = concatClass(result.enterFrom, p.enterFrom)
  result.enterTo = concatClass(result.enterTo, p.enterTo)
  result.leave = concatClass(result.leave, p.leave)
  result.leaveFrom = concatClass(result.leaveFrom, p.leaveFrom)
  result.leaveTo = concatClass(result.leaveTo, p.leaveTo)
}

// ─── compose ────────────────────────────────────────────────────────

/**
 * Merge multiple presets into one. Later presets override earlier ones.
 * - Style objects: shallow merged (later keys win)
 * - Transitions: last preset's transition wins
 * - Class names: space-concatenated
 *
 * Note: If two presets modify the same CSS `transform` property, the last
 * one wins (CSS transform is a single string). Use factories for combined
 * effects (e.g., createFade + direction + scale).
 *
 * @example
 * const fadeSlide = compose(fade, slideUp)
 * // Merges: { opacity: 0 } + { opacity: 0, transform: 'translateY(16px)' }
 * // Result: { opacity: 0, transform: 'translateY(16px)' }
 */
export const compose = (...items: Preset[]): Preset => {
  const result: Preset = {}

  for (const p of items) {
    mergeStyles(result, p)
    mergeClasses(result, p)
  }

  return result
}

// ─── withDuration ───────────────────────────────────────────────────

/**
 * Override enter/leave durations of a preset.
 *
 * @example
 * withDuration(fade, 500)         // 500ms enter, 500ms leave
 * withDuration(fade, 500, 200)    // 500ms enter, 200ms leave
 */
export const withDuration = (
  preset: Preset,
  enterMs: number,
  leaveMs?: number,
): Preset => ({
  ...preset,
  enterTransition: replaceDuration(
    preset.enterTransition ?? '',
    `${enterMs}ms`,
  ),
  leaveTransition: replaceDuration(
    preset.leaveTransition ?? '',
    `${leaveMs ?? enterMs}ms`,
  ),
})

// ─── withEasing ─────────────────────────────────────────────────────

/**
 * Override enter/leave easing of a preset.
 *
 * @example
 * withEasing(fadeUp, 'cubic-bezier(0.34, 1.56, 0.64, 1)')
 * withEasing(fadeUp, 'ease-out', 'ease-in')
 */
export const withEasing = (
  preset: Preset,
  enterEasing: string,
  leaveEasing?: string,
): Preset => ({
  ...preset,
  enterTransition: replaceEasing(preset.enterTransition ?? '', enterEasing),
  leaveTransition: replaceEasing(
    preset.leaveTransition ?? '',
    leaveEasing ?? enterEasing,
  ),
})

// ─── withDelay ──────────────────────────────────────────────────────

/**
 * Add a delay to the enter/leave transitions.
 *
 * @example
 * withDelay(fadeUp, 100)         // 100ms delay on both
 * withDelay(fadeUp, 100, 0)      // 100ms on enter, none on leave
 */
export const withDelay = (
  preset: Preset,
  enterDelayMs: number,
  leaveDelayMs?: number,
): Preset => ({
  ...preset,
  enterTransition: addDelay(preset.enterTransition ?? '', `${enterDelayMs}ms`),
  leaveTransition: addDelay(
    preset.leaveTransition ?? '',
    `${leaveDelayMs ?? enterDelayMs}ms`,
  ),
})

// ─── reverse ────────────────────────────────────────────────────────

/**
 * Swap enter ↔ leave of a preset.
 * The enter animation becomes the leave animation and vice versa.
 *
 * @example
 * const slideDownOnLeave = reverse(slideUp)
 * // Enter: slides down, Leave: slides up
 */
export const reverse = (preset: Preset): Preset => ({
  enterStyle: preset.leaveStyle,
  enterToStyle: preset.leaveToStyle,
  enterTransition: preset.leaveTransition,
  leaveStyle: preset.enterStyle,
  leaveToStyle: preset.enterToStyle,
  leaveTransition: preset.enterTransition,
  enter: preset.leave,
  enterFrom: preset.leaveFrom,
  enterTo: preset.leaveTo,
  leave: preset.enter,
  leaveFrom: preset.enterFrom,
  leaveTo: preset.enterTo,
})

// ─── Internal helpers ───────────────────────────────────────────────

/**
 * Replace the duration in a CSS transition string.
 * Handles: "all 300ms ease-out" → "all 500ms ease-out"
 */
const replaceDuration = (transition: string, newDuration: string): string =>
  transition.replace(/\d+(?:ms|s)/, newDuration)

/**
 * Replace the easing in a CSS transition string.
 * Handles: "all 300ms ease-out" → "all 300ms cubic-bezier(...)"
 * Also handles cubic-bezier(...) in the original.
 */
const replaceEasing = (transition: string, newEasing: string): string =>
  transition.replace(
    /(?:ease-in-out|ease-in|ease-out|ease|linear|cubic-bezier\([^)]{1,100}\))\s*$/,
    newEasing,
  )

/**
 * Add a delay to a CSS transition string.
 * "all 300ms ease-out" → "all 300ms 100ms ease-out"
 */
const addDelay = (transition: string, delay: string): string =>
  transition.replace(/(\d+(?:ms|s))(\s)/, `$1 ${delay}$2`)
