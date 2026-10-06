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
 * Swap the motion direction of a preset while keeping its visible end state.
 *
 * The element now enters from the side the original leaves to, and leaves
 * towards the side the original enters from. `enterToStyle` / `leaveStyle`
 * (the visible state) are unchanged, so the element is always fully shown
 * after entering. Transitions and the enter/leave classes are swapped.
 *
 * Note: the built-in presets are symmetric (they leave back to the state they
 * enter from), so for them only transitions/classes swap. The direction swap
 * matters for asymmetric presets, e.g. one that enters from below and leaves
 * upward:
 *
 * @example
 * const up = { enterStyle: { transform: 'translateY(16px)' }, enterToStyle: { transform: 'none' },
 *              leaveStyle: { transform: 'none' }, leaveToStyle: { transform: 'translateY(-16px)' } }
 * reverse(up)
 * // enters from above (-16px), leaves downward (+16px), visible state unchanged
 */
export const reverse = (preset: Preset): Preset => ({
  enterStyle: preset.leaveToStyle,
  enterToStyle: preset.enterToStyle,
  enterTransition: preset.leaveTransition,
  leaveStyle: preset.leaveStyle,
  leaveToStyle: preset.enterStyle,
  leaveTransition: preset.enterTransition,
  enter: preset.leave,
  enterFrom: preset.leaveTo,
  enterTo: preset.enterTo,
  leave: preset.enter,
  leaveFrom: preset.leaveFrom,
  leaveTo: preset.enterFrom,
})

// ─── Internal helpers ───────────────────────────────────────────────

/** Splits a CSS list on top-level commas (ignores commas inside parentheses). */
const splitTopLevel = (value: string): string[] => {
  const parts: string[] = []
  let depth = 0
  let start = 0
  for (let i = 0; i < value.length; i++) {
    const c = value[i]
    if (c === '(') depth++
    else if (c === ')') depth--
    else if (c === ',' && depth === 0) {
      parts.push(value.slice(start, i))
      start = i + 1
    }
  }
  parts.push(value.slice(start))
  return parts
}

// A CSS <time> token: supports decimals (".3s", "0.3s") and avoids matching
// inside identifiers such as "translate3d" or "h2s". The boundary is a
// captured prefix group rather than a lookbehind, which throws a SyntaxError
// at module load on Safari < 16.4.
const TIME = /(^|[^\w.-])((?:\d+\.?\d*|\.\d+)(?:ms|s))(?![\w-])/g

/**
 * Rewrites every comma-separated transition in `transition`. `fn` receives
 * the segment and its <time> tokens (1st = duration, 2nd = delay).
 */
const mapSegments = (
  transition: string,
  fn: (segment: string, times: RegExpMatchArray[]) => string,
): string =>
  splitTopLevel(transition)
    .map((seg) => fn(seg, [...seg.matchAll(TIME)]))
    .join(',')

const spliceMatch = (
  seg: string,
  m: RegExpMatchArray,
  text: string,
): string => {
  const start = (m.index ?? 0) + (m[1] ?? '').length
  return seg.slice(0, start) + text + seg.slice(start + (m[2] ?? '').length)
}

/**
 * Replace the duration of every transition in a CSS transition string.
 * Handles: "all 300ms ease-out" → "all 500ms ease-out"
 * and lists: "opacity .3s, transform 0.5s" → both durations replaced.
 */
const replaceDuration = (transition: string, newDuration: string): string =>
  mapSegments(transition, (seg, [duration]) =>
    duration ? spliceMatch(seg, duration, newDuration) : seg,
  )

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
 * Set the delay of every transition in a CSS transition string. An existing
 * delay (the second time value) is replaced rather than stacked.
 * "all 300ms ease-out" → "all 300ms 100ms ease-out"
 * "all 300ms 50ms ease-out" → "all 300ms 100ms ease-out"
 */
const addDelay = (transition: string, delay: string): string =>
  mapSegments(transition, (seg, [duration, existing]) => {
    if (existing) return spliceMatch(seg, existing, delay)
    if (duration) return spliceMatch(seg, duration, `${duration[2]} ${delay}`)
    return seg
  })
