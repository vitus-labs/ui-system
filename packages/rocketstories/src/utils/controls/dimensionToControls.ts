import type { Controls } from '../../types'

// --------------------------------------------------------
// transformDimensionsToControls
// --------------------------------------------------------
type DimensionsToControls = ({
  dimensions,
  multiKeys,
}: {
  dimensions: Record<string, any>
  multiKeys: Record<string, true>
}) => Controls

const dimensionsToControls: DimensionsToControls = ({
  dimensions,
  multiKeys,
}) =>
  Object.entries(dimensions).reduce((acc, [key, value]) => {
    const valueKeys = Object.keys(value)
    const isMultiKey = !!multiKeys[key]

    const control = {
      type: isMultiKey ? 'multi-select' : 'select',
      value: isMultiKey ? undefined : valueKeys[0],
      options: valueKeys,
      group: 'Rocketstyle',
    }

    return { ...acc, [key]: control }
  }, {})

export default dimensionsToControls
