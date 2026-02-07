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
const transformTheme: TransformTheme = ({ theme, breakpoints }) => {
  const result = {}

  if (isEmpty(theme) || isEmpty(breakpoints)) return result

  // can be one of following types
  // { fontSize: 12 }
  // { fontSize: { xs: 12, md: 15 }}
  // { fontSize: [12, 15] }
  Object.entries(theme).forEach(([key, value]) => {
    // array
    if (Array.isArray(value) && value.length > 0) {
      value.forEach((child, i) => {
        const indexBreakpoint = breakpoints[i]!
        set(result, [indexBreakpoint, key], child)
      })
    }
    // object
    else if (typeof value === 'object' && value !== null) {
      Object.entries(value).forEach(([childKey, childValue]) => {
        set(result, [childKey, key], childValue)
      })
    }
    // normal value
    else if (value != null) {
      const firstBreakpoint = breakpoints[0]!
      set(result, [firstBreakpoint, key], value)
    }
  })

  return removeUnexpectedKeys(result, breakpoints)
}

export default transformTheme
