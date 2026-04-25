// ─── Transition string parsing (pure, no react-native dependency) ────

export type TransitionConfig = {
  property: string
  duration: number
  easingName: string
}

/**
 * Parses a CSS transition shorthand into structured configs.
 *
 * @example
 * parseTransitionString('opacity 300ms ease-out, transform 300ms ease-out')
 * // [{ property: 'opacity', duration: 300, easingName: 'ease-out' }, ...]
 */
export const parseTransitionString = (
  transition: string,
): TransitionConfig[] => {
  return transition.split(',').map((part) => {
    const tokens = part.trim().split(/\s+/)
    const property = tokens[0] || 'all'

    let duration = 300
    for (const t of tokens) {
      if (t.endsWith('ms')) {
        duration = Number.parseInt(t, 10)
        break
      }
      if (t.endsWith('s') && !t.endsWith('ms')) {
        duration = Number.parseFloat(t) * 1000
        break
      }
    }

    let easingName = 'ease'
    const easingNames = ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out']
    for (const t of tokens) {
      if (easingNames.includes(t)) {
        easingName = t
        break
      }
    }

    return { property, duration, easingName }
  })
}

/**
 * Extracts the primary duration/easing from a transition string.
 * Takes the longest duration if multiple transitions are specified.
 */
export const getPrimaryTransitionConfig = (
  transition: string | undefined,
): { duration: number; easingName: string } => {
  if (!transition) return { duration: 300, easingName: 'ease' }

  const configs = parseTransitionString(transition)
  if (configs.length === 0) return { duration: 300, easingName: 'ease' }

  // biome-ignore lint/style/noNonNullAssertion: configs.length === 0 already returned above, so configs[0] exists
  let best = configs[0]!
  for (let i = 1; i < configs.length; i++) {
    // biome-ignore lint/style/noNonNullAssertion: loop bound `i < configs.length` guarantees configs[i] exists
    if (configs[i]!.duration > best.duration) best = configs[i]!
  }
  return { duration: best.duration, easingName: best.easingName }
}

// ─── Transform parsing ───────────────────────────────────────────────

export type ParsedTransform = { type: string; value: number }

/**
 * Parses a CSS transform string into individual transform entries.
 *
 * @example
 * parseTransformString('translateY(16px) scale(0.95)')
 * // [{ type: 'translateY', value: 16 }, { type: 'scale', value: 0.95 }]
 */
export const parseTransformString = (transform: string): ParsedTransform[] => {
  const result: ParsedTransform[] = []
  const regex = /(\w+)\(([^)]+)\)/g
  let match: RegExpExecArray | null

  while ((match = regex.exec(transform)) !== null) {
    const type = match[1] ?? ''
    const raw = (match[2] ?? '').trim()
    const value = Number.parseFloat(raw)
    if (type && !Number.isNaN(value)) {
      result.push({ type, value })
    }
  }

  return result
}

/** Identity values for CSS transform functions. */
export const TRANSFORM_IDENTITY: Record<string, number> = {
  translateX: 0,
  translateY: 0,
  scale: 1,
  scaleX: 1,
  scaleY: 1,
  rotate: 0,
  rotateX: 0,
  rotateY: 0,
  rotateZ: 0,
  skewX: 0,
  skewY: 0,
  perspective: 0,
}
