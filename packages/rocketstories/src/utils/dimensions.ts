// @ts-nocheck
/* eslint-disable import/prefer-default-export */
export const transformDimensionsToControls = ({ dimensions, multiKeys }) =>
  Object.entries(dimensions).reduce((acc, [key, value], i) => {
    const valueKeys = Object.keys(value)
    const res = valueKeys.reduce((acc, item) => ({ ...acc, [item]: item }), {})

    const isMultiKey = !!multiKeys[key]

    acc[key] = {
      type: isMultiKey ? 'dimensionMultiSelect' : 'dimensionSelect',
      value: isMultiKey ? undefined : valueKeys[0],
      options: { '----': undefined, ...res },
    }

    return acc
  }, {})

export const extractDefaultBooleanProps = (dimensions, multiKeys) =>
  Object.entries(dimensions).reduce((acc, [key, value], i) => {
    if (!multiKeys[key]) {
      const propName = Object.keys(value)[0]

      acc[propName] = true
    }

    return acc
  }, {})
