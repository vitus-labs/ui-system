import type { Controls } from '~/types'
// --------------------------------------------------------
// transformDimensionsToControls
// --------------------------------------------------------
type TransformDimensionsToControls = ({
  dimensions,
  multiKeys,
}: {
  dimensions: Record<string, any>
  multiKeys: Record<string, true>
}) => Controls

export const transformDimensionsToControls: TransformDimensionsToControls = ({
  dimensions,
  multiKeys,
}) =>
  Object.entries(dimensions).reduce((acc, [key, value]) => {
    const valueKeys = Object.keys(value)
    const res = valueKeys.reduce((acc, item) => ({ ...acc, [item]: item }), {})

    const isMultiKey = !!multiKeys[key]

    const newValue = {
      type: isMultiKey ? 'dimensionMultiSelect' : 'dimensionSelect',
      value: isMultiKey ? undefined : valueKeys[0],
      options: { '----': undefined, ...res },
    }

    return { ...acc, [key]: newValue }
  }, {})

// --------------------------------------------------------
// extractDefaultBooleanProps
// --------------------------------------------------------
type ExtractDefaultBooleanProps = ({
  dimensions,
  multiKeys,
}: {
  dimensions: Record<string, any>
  multiKeys: Record<string, true>
}) => Record<string, any>

export const extractDefaultBooleanProps: ExtractDefaultBooleanProps = ({
  dimensions,
  multiKeys,
}) =>
  Object.entries(dimensions).reduce((acc, [key, value], i) => {
    if (!multiKeys[key]) {
      const propName = Object.keys(value)[0]

      return { ...acc, [propName]: true }
    }

    return acc
  }, {})
