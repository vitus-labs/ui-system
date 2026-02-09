type AssignToBreakpointKey = (
  breakpoints: string[],
) => (
  value: (
    breakpoint: string,
    i: number,
    breakpoints: string[],
    result: Record<string, unknown>,
  ) => void,
) => Record<string, unknown>

/** Iterates breakpoints and populates a result object using a callback per breakpoint. */
const assignToBreakpointKey: AssignToBreakpointKey =
  (breakpoints) => (value) => {
    const result: Record<string, unknown> = {}

    breakpoints.forEach((item, i) => {
      result[item] = value(item, i, breakpoints, result)
    })

    return result
  }

const handleArrayCb = (arr: (string | number)[]) => (_: unknown, i: number) => {
  const currentValue = arr[i]
  const lastValue = arr[arr.length - 1]

  return currentValue ?? lastValue
}

// type HandleObjectCb = (
//   obj: Record<string, unknown>
// ) => (
//   bp: string,
//   i: number,
//   breakpoint: Array<string>,
//   result: Record<string, unknown>
// ) => Record<string, unknown>

const handleObjectCb =
  (obj: Record<string, unknown>) =>
  (bp: string, i: number, bps: string[], res: Record<string, unknown>) => {
    const currentValue = obj[bp]
    const previousValue = res[bps[i - 1]!]

    // check for non-nullable values
    if (currentValue != null) return currentValue
    return previousValue
  }

const handleValueCb = (value: unknown) => () => value

const shouldNormalize = (props: Record<string, any>) =>
  Object.values(props).some(
    (item) => typeof item === 'object' || Array.isArray(item),
  )

export type NormalizeTheme = ({
  theme,
  breakpoints,
}: {
  theme: Record<string, unknown>
  breakpoints: string[]
}) => Record<string, unknown>

/**
 * Expands each theme property into a full breakpoint map so every
 * breakpoint has a value. Arrays fill by index (last value carries forward),
 * objects inherit from the previous breakpoint, scalars repeat for all.
 * Skipped entirely when no property is array/object (fast path).
 */
const normalizeTheme: NormalizeTheme = ({ theme, breakpoints }) => {
  if (!shouldNormalize(theme)) return theme

  const getBpValues = assignToBreakpointKey(breakpoints)
  const result: Record<string, unknown> = {}

  Object.entries(theme).forEach(([key, value]) => {
    if (value == null) return

    // if it's an array
    if (Array.isArray(value)) {
      result[key] = getBpValues(handleArrayCb(value as (string | number)[]))
    }
    // if it's an object
    else if (typeof value === 'object') {
      result[key] = getBpValues(handleObjectCb(value as Record<string, any>))
    }
    // if any other value
    else {
      result[key] = getBpValues(handleValueCb(value))
    }
  })

  return result
}

export default normalizeTheme
