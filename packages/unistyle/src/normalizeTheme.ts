/* eslint-disable import/prefer-default-export */
// --------------------------------------------------------
// HELPERS
// --------------------------------------------------------
const assignToBreakbointKey = (breakpoints) => (value) => {
  const result = {}

  breakpoints.forEach((item, i) => {
    result[item] =
      typeof value === 'function' ? value(item, i, breakpoints, result) : value
  })

  return result
}

const handleArrayCb = (arr) => (value, i) => {
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
const handleObjectCb = (obj) => (bp, i, bps, res) => {
  return obj[bp] || res[bps[i - 1]]
}

export const normalizeTheme = (breakpoints) => (props) => {
  const getBpValues = assignToBreakbointKey(breakpoints)
  const result = {}

  Object.entries(props).forEach(([key, value]) => {
    if (value == null) return

    // if it's an array
    if (Array.isArray(value)) {
      result[key] = getBpValues(handleArrayCb(value))
    }
    // if it's an object
    else if (typeof value === 'object') {
      result[key] = getBpValues(handleObjectCb(value))
    }
    // if any other value
    else {
      result[key] = getBpValues(value)
    }
  })

  return result
}
