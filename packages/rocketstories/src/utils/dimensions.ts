/* eslint-disable import/prefer-default-export */
export const transformDimensionsToKnobs = ({ dimensions, multiKeys }) =>
  Object.entries(dimensions).reduce((acc, [key, value], i) => {
    const valueKeys = Object.keys(value)

    const isMultiKey = !!multiKeys[key]

    acc[key] = {
      type: isMultiKey ? 'multi-select' : 'select',
      data: valueKeys,
      defaultValue: valueKeys[0],
    }

    return acc
  }, {})

export const extractDefaultBooleanProps = (dimensions, multiKeys) =>
  Object.entries(dimensions).reduce((acc, [key, value], i) => {
    if (!multiKeys[key]) {
      const propName = value.data[0]

      acc[propName] = true
    }

    return acc
  }, {})
