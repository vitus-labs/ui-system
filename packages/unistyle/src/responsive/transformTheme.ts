import { isEmpty, set } from '@vitus-labs/core'

/** Filter out breakpoint keys that don't exist in the sorted breakpoints list. */
const removeUnexpectedKeys = (obj: Record<string, unknown>, keys: string[]) => {
  const result: Record<string, unknown> = {}

  keys.forEach((bp) => {
    const value = obj[bp]

    if (value) {
      result[bp] = value
    }
  })

  return result
}

export type TransformTheme = ({
  theme,
  breakpoints,
}: {
  theme: Record<string, unknown>
  breakpoints: string[]
}) => any

/**
 * Pivots the theme from property-centric to breakpoint-centric layout.
 * Input:  `{ fontSize: { xs: 12, md: 15 }, color: 'red' }`
 * Output: `{ xs: { fontSize: 12, color: 'red' }, md: { fontSize: 15 } }`
 * Supports three input shapes per property: scalar, array (positional), or object (keyed).
 */
// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: shape-dispatch transform — three branches inlined for one-pass perf
const transformTheme: TransformTheme = ({ theme, breakpoints }) => {
  const result = {}

  if (isEmpty(theme) || isEmpty(breakpoints)) return result

  // can be one of following types
  // { fontSize: 12 }
  // { fontSize: { xs: 12, md: 15 }}
  // { fontSize: [12, 15] }
  // for-in + nested for-in avoids the two `Object.entries(...)` array
  // allocations (outer + inner per object value) the prior forEach paid.
  for (const key in theme) {
    const value = theme[key]
    // array
    if (Array.isArray(value) && value.length > 0) {
      for (let i = 0; i < value.length; i++) {
        // biome-ignore lint/style/noNonNullAssertion: caller guarantees breakpoints array spans all responsive values
        const indexBreakpoint = breakpoints[i]!
        set(result, [indexBreakpoint, key], value[i])
      }
    }
    // object
    else if (typeof value === 'object' && value !== null) {
      const obj = value as Record<string, unknown>
      for (const childKey in obj) {
        set(result, [childKey, key], obj[childKey])
      }
    }
    // normal value
    else if (value != null) {
      // biome-ignore lint/style/noNonNullAssertion: caller guarantees breakpoints[] is non-empty (mobile-first base breakpoint always present)
      const firstBreakpoint = breakpoints[0]!
      set(result, [firstBreakpoint, key], value)
    }
  }

  return removeUnexpectedKeys(result, breakpoints)
}

export default transformTheme
