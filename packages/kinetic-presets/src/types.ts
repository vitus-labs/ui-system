import type { CSSProperties } from 'react'

/**
 * A preset defines enter (appear) and leave (disappear) animation config.
 * Structurally compatible with @vitus-labs/kinetic's Preset type.
 *
 * Style-based props use inline CSSProperties objects.
 * Class-based props use CSS class name strings (for Tailwind, CSS modules, etc).
 */
export type Preset = {
  /** Inline styles for enter start state. */
  enterStyle?: CSSProperties
  /** Inline styles for enter end state. */
  enterToStyle?: CSSProperties
  /** CSS transition string for enter. */
  enterTransition?: string
  /** Inline styles for leave start state. */
  leaveStyle?: CSSProperties
  /** Inline styles for leave end state. */
  leaveToStyle?: CSSProperties
  /** CSS transition string for leave. */
  leaveTransition?: string
  /** CSS class applied during entire enter phase. */
  enter?: string
  /** CSS class for enter start state. */
  enterFrom?: string
  /** CSS class for enter end state. */
  enterTo?: string
  /** CSS class applied during entire leave phase. */
  leave?: string
  /** CSS class for leave start state. */
  leaveFrom?: string
  /** CSS class for leave end state. */
  leaveTo?: string
}

// ─── Factory Option Types ───────────────────────────────────────────

export type Direction = 'up' | 'down' | 'left' | 'right'

export type FadeOptions = {
  /** Direction of movement during fade. Omit for pure opacity fade. */
  direction?: Direction
  /** Translation distance in px. Default: 16. */
  distance?: number
  /** Enter duration in ms. Default: 300. */
  duration?: number
  /** Leave duration in ms. Default: 200. */
  leaveDuration?: number
  /** Enter easing. Default: 'ease-out'. */
  easing?: string
  /** Leave easing. Default: 'ease-in'. */
  leaveEasing?: string
}

export type SlideOptions = {
  /** Direction of movement. Default: 'up'. */
  direction?: Direction
  /** Translation distance in px. Default: 16. */
  distance?: number
  /** Enter duration in ms. Default: 300. */
  duration?: number
  /** Leave duration in ms. Default: 200. */
  leaveDuration?: number
  /** Enter easing. Default: 'ease-out'. */
  easing?: string
  /** Leave easing. Default: 'ease-in'. */
  leaveEasing?: string
}

export type ScaleOptions = {
  /** Starting scale factor. Default: 0.9. */
  from?: number
  /** Enter duration in ms. Default: 300. */
  duration?: number
  /** Leave duration in ms. Default: 200. */
  leaveDuration?: number
  /** Enter easing. Default: 'ease-out'. */
  easing?: string
  /** Leave easing. Default: 'ease-in'. */
  leaveEasing?: string
}

export type RotateOptions = {
  /** Rotation angle in degrees. Default: 15. */
  degrees?: number
  /** Enter duration in ms. Default: 300. */
  duration?: number
  /** Leave duration in ms. Default: 200. */
  leaveDuration?: number
  /** Enter easing. Default: 'ease-out'. */
  easing?: string
  /** Leave easing. Default: 'ease-in'. */
  leaveEasing?: string
}

export type BlurOptions = {
  /** Blur amount in px. Default: 8. */
  amount?: number
  /** Optional scale factor (0-1). Omit for pure blur. */
  scale?: number
  /** Enter duration in ms. Default: 300. */
  duration?: number
  /** Leave duration in ms. Default: 200. */
  leaveDuration?: number
  /** Enter easing. Default: 'ease-out'. */
  easing?: string
  /** Leave easing. Default: 'ease-in'. */
  leaveEasing?: string
}
