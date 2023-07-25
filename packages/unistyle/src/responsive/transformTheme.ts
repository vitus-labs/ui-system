import { isEmpty, set } from '@vitus-labs/core'

const removeUnexpectedKeys = (obj: Record<string, unknown>, keys: string[]) => {
  const result = {}

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
        const indexBreakpoint = breakpoints[i]
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
      const firstBreakpoint = breakpoints[0]
      set(result, [firstBreakpoint, key], value)
    }
  })

  return removeUnexpectedKeys(result, breakpoints)
}

export default transformTheme
