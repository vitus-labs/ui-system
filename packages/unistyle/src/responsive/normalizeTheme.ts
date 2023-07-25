type AssignToBreakbointKey = (
  breakpoints: string[],
) => (
  value: (
    breakpoint: string,
    i: number,
    breakpoints: string[],
    result: Record<string, unknown>,
  ) => void,
) => Record<string, unknown>

const assignToBreakbointKey: AssignToBreakbointKey =
  (breakpoints) => (value) => {
    const result = {}

    breakpoints.forEach((item, i) => {
      result[item] = value(item, i, breakpoints, result)
    })

    return result
  }

const handleArrayCb = (arr: (string | number)[]) => (value, i: number) => {
  const currentValue = arr[i]
  const lastValue = arr[arr.length - 1]

  return currentValue || lastValue
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
  (bp: string, i: number, bps: string[], res) => {
    const currentValue = obj[bp]
    const previousValue = res[bps[i - 1]]

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

const normalizeTheme: NormalizeTheme = ({ theme, breakpoints }) => {
  if (!shouldNormalize(theme)) return theme

  const getBpValues = assignToBreakbointKey(breakpoints)
  const result = {}

  Object.entries(theme).forEach(([key, value]) => {
    if (value == null) return

    // if it's an array
    if (Array.isArray(value)) {
      result[key] = getBpValues(handleArrayCb(value as any))
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
