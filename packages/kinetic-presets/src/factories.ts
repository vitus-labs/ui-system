import type { CSSProperties } from 'react'
import type {
  BlurOptions,
  Direction,
  FadeOptions,
  Preset,
  RotateOptions,
  ScaleOptions,
  SlideOptions,
} from './types'

// ─── Helpers ────────────────────────────────────────────────────────

const directionToTranslate = (
  direction: Direction,
  distance: number,
): string => {
  switch (direction) {
    case 'up':
      return `translateY(${distance}px)`
    case 'down':
      return `translateY(${-distance}px)`
    case 'left':
      return `translateX(${distance}px)`
    case 'right':
      return `translateX(${-distance}px)`
  }
}

const directionToZero = (direction: Direction): string => {
  switch (direction) {
    case 'up':
    case 'down':
      return 'translateY(0)'
    case 'left':
    case 'right':
      return 'translateX(0)'
  }
}

// ─── createFade ─────────────────────────────────────────────────────

/**
 * Create a custom fade preset.
 *
 * @example
 * // Pure opacity fade with custom duration
 * createFade({ duration: 500 })
 *
 * @example
 * // Fade with directional movement
 * createFade({ direction: 'up', distance: 24, duration: 400 })
 */
export const createFade = ({
  direction,
  distance = 16,
  duration = 300,
  leaveDuration = 200,
  easing = 'ease-out',
  leaveEasing = 'ease-in',
}: FadeOptions = {}): Preset => {
  if (!direction) {
    return {
      enterStyle: { opacity: 0 },
      enterToStyle: { opacity: 1 },
      enterTransition: `all ${duration}ms ${easing}`,
      leaveStyle: { opacity: 1 },
      leaveToStyle: { opacity: 0 },
      leaveTransition: `all ${leaveDuration}ms ${leaveEasing}`,
    }
  }

  const translate = directionToTranslate(direction, distance)
  const zero = directionToZero(direction)

  return {
    enterStyle: { opacity: 0, transform: translate },
    enterToStyle: { opacity: 1, transform: zero },
    enterTransition: `all ${duration}ms ${easing}`,
    leaveStyle: { opacity: 1, transform: zero },
    leaveToStyle: { opacity: 0, transform: translate },
    leaveTransition: `all ${leaveDuration}ms ${leaveEasing}`,
  }
}

// ─── createSlide ────────────────────────────────────────────────────

/**
 * Create a custom slide preset with configurable direction and distance.
 *
 * @example
 * createSlide({ direction: 'left', distance: 32, duration: 250 })
 */
export const createSlide = ({
  direction = 'up',
  distance = 16,
  duration = 300,
  leaveDuration = 200,
  easing = 'ease-out',
  leaveEasing = 'ease-in',
}: SlideOptions = {}): Preset => {
  const translate = directionToTranslate(direction, distance)
  const zero = directionToZero(direction)

  return {
    enterStyle: { opacity: 0, transform: translate },
    enterToStyle: { opacity: 1, transform: zero },
    enterTransition: `all ${duration}ms ${easing}`,
    leaveStyle: { opacity: 1, transform: zero },
    leaveToStyle: { opacity: 0, transform: translate },
    leaveTransition: `all ${leaveDuration}ms ${leaveEasing}`,
  }
}

// ─── createScale ────────────────────────────────────────────────────

/**
 * Create a custom scale preset.
 *
 * @example
 * createScale({ from: 0.8, duration: 400 })
 *
 * @example
 * // Use spring easing for bounce effect
 * createScale({ from: 0.5, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' })
 */
export const createScale = ({
  from = 0.9,
  duration = 300,
  leaveDuration = 200,
  easing = 'ease-out',
  leaveEasing = 'ease-in',
}: ScaleOptions = {}): Preset => ({
  enterStyle: { opacity: 0, transform: `scale(${from})` },
  enterToStyle: { opacity: 1, transform: 'scale(1)' },
  enterTransition: `all ${duration}ms ${easing}`,
  leaveStyle: { opacity: 1, transform: 'scale(1)' },
  leaveToStyle: { opacity: 0, transform: `scale(${from})` },
  leaveTransition: `all ${leaveDuration}ms ${leaveEasing}`,
})

// ─── createRotate ───────────────────────────────────────────────────

/**
 * Create a custom rotation preset.
 *
 * @example
 * createRotate({ degrees: 30, duration: 400 })
 *
 * @example
 * // Negative degrees for counter-clockwise
 * createRotate({ degrees: -90 })
 */
export const createRotate = ({
  degrees = 15,
  duration = 300,
  leaveDuration = 200,
  easing = 'ease-out',
  leaveEasing = 'ease-in',
}: RotateOptions = {}): Preset => ({
  enterStyle: { opacity: 0, transform: `rotate(${-degrees}deg)` },
  enterToStyle: { opacity: 1, transform: 'rotate(0)' },
  enterTransition: `all ${duration}ms ${easing}`,
  leaveStyle: { opacity: 1, transform: 'rotate(0)' },
  leaveToStyle: { opacity: 0, transform: `rotate(${degrees}deg)` },
  leaveTransition: `all ${leaveDuration}ms ${leaveEasing}`,
})

// ─── createBlur ─────────────────────────────────────────────────────

/**
 * Create a custom blur preset.
 *
 * @example
 * createBlur({ amount: 12, duration: 400 })
 *
 * @example
 * // Blur with scale
 * createBlur({ amount: 8, scale: 0.95 })
 */
export const createBlur = ({
  amount = 8,
  scale,
  duration = 300,
  leaveDuration = 200,
  easing = 'ease-out',
  leaveEasing = 'ease-in',
}: BlurOptions = {}): Preset => {
  const hidden: Record<string, unknown> = {
    opacity: 0,
    filter: `blur(${amount}px)`,
  }
  const visible: Record<string, unknown> = {
    opacity: 1,
    filter: 'blur(0px)',
  }

  if (scale !== undefined) {
    hidden.transform = `scale(${scale})`
    visible.transform = 'scale(1)'
  }

  return {
    enterStyle: hidden as CSSProperties,
    enterToStyle: visible as CSSProperties,
    enterTransition: `all ${duration}ms ${easing}`,
    leaveStyle: visible as CSSProperties,
    leaveToStyle: hidden as CSSProperties,
    leaveTransition: `all ${leaveDuration}ms ${leaveEasing}`,
  }
}
