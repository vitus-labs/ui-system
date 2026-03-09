import type { CSSProperties } from 'react'
import { type Animated, Easing } from 'react-native'
import {
  getPrimaryTransitionConfig,
  parseTransformString,
  TRANSFORM_IDENTITY,
} from './nativeParsers'

export { parseTransformString } from './nativeParsers'

// ─── Easing mapping ─────────────────────────────────────────────────

const EASING_MAP: Record<string, (t: number) => number> = {
  linear: Easing.linear,
  ease: Easing.ease,
  'ease-in': Easing.in(Easing.ease),
  'ease-out': Easing.out(Easing.ease),
  'ease-in-out': Easing.inOut(Easing.ease),
}

const toEasing = (name: string): ((t: number) => number) =>
  EASING_MAP[name] ?? Easing.ease

/**
 * Extracts the primary duration/easing from a transition string,
 * returning a resolved RN Easing function.
 */
export const getPrimaryTransition = (
  transition: string | undefined,
): { duration: number; easing: (t: number) => number } => {
  const { duration, easingName } = getPrimaryTransitionConfig(transition)
  return { duration, easing: toEasing(easingName) }
}

// ─── Animated style building ─────────────────────────────────────────

type AnimatableStyle = {
  opacity?: number
  transform?: string
  [key: string]: string | number | undefined
}

/**
 * Builds an animated style object that interpolates between `from` and `to`
 * styles based on a single progress `Animated.Value` (0→1).
 */
export const buildAnimatedStyle = (
  progress: Animated.Value,
  from: AnimatableStyle | undefined,
  to: AnimatableStyle | undefined,
): Record<string, any> => {
  if (!from && !to) return {}

  const style: Record<string, any> = {}
  const fromStyle = from || {}
  const toStyle = to || {}

  const keys = new Set([...Object.keys(fromStyle), ...Object.keys(toStyle)])
  const transforms: Record<string, any>[] = []

  for (const key of keys) {
    if (key === 'transform') {
      const fromTransforms = parseTransformString(
        (fromStyle.transform as string) || '',
      )
      const toTransforms = parseTransformString(
        (toStyle.transform as string) || '',
      )

      const types = new Set([
        ...fromTransforms.map((t) => t.type),
        ...toTransforms.map((t) => t.type),
      ])

      for (const type of types) {
        const fromVal =
          fromTransforms.find((t) => t.type === type)?.value ??
          TRANSFORM_IDENTITY[type] ??
          0
        const toVal =
          toTransforms.find((t) => t.type === type)?.value ??
          TRANSFORM_IDENTITY[type] ??
          0

        if (fromVal === toVal) {
          transforms.push({ [type]: fromVal })
        } else {
          transforms.push({
            [type]: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [fromVal, toVal],
            }),
          })
        }
      }
      continue
    }

    const fromVal = fromStyle[key]
    const toVal = toStyle[key]

    if (typeof fromVal === 'number' && typeof toVal === 'number') {
      if (fromVal === toVal) {
        style[key] = fromVal
      } else {
        style[key] = progress.interpolate({
          inputRange: [0, 1],
          outputRange: [fromVal, toVal],
        })
      }
    } else if (fromVal !== undefined) {
      style[key] = fromVal
    } else if (toVal !== undefined) {
      style[key] = toVal
    }
  }

  if (transforms.length > 0) {
    style.transform = transforms
  }

  return style
}

/** No-op replacements for web-only utilities */
export const mergeStyles = (
  a: CSSProperties | undefined,
  b: CSSProperties | undefined,
): CSSProperties | undefined => {
  if (!a && !b) return undefined
  if (!a) return b
  if (!b) return a
  return { ...a, ...b }
}
