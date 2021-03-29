export const transformDimensionsToKnobs = (props, multiKeys, useBooleans) => {
  return Object.entries(props).reduce((acc, [key, value], i) => {
    const valueKeys = Object.keys(value)
    acc[key] = {
      type: 'select',
      data: valueKeys,
      defaultValue: valueKeys[0],
    }

    return acc
  }, {})
}
