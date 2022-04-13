import * as CONTROLS from '~/controls'
import type {
  Controls,
  StorybookControl,
  RocketType,
  ControlConfiguration,
} from '~/types'

export const createControls = (props) =>
  Object.entries(props).reduce((acc, [key, value]) => {
    if (typeof value === 'string') {
      return {
        ...acc,
        [key]: {
          type: value,
        },
      }
    }

    if (typeof value === 'object' && value !== null) {
      return { ...acc, [key]: value }
    }

    return acc
  }, {})

type ConvertDimensionsToControls = ({
  dimensions,
  multiKeys,
}: {
  dimensions: Record<string, any>
  multiKeys: Record<string, true>
}) => Controls

export const convertDimensionsToControls: ConvertDimensionsToControls = ({
  dimensions,
  multiKeys,
}) =>
  Object.entries(dimensions).reduce((acc, [key, value]) => {
    const valueKeys = Object.keys(value)
    const isMultiKey = !!multiKeys[key]

    const control = {
      type: isMultiKey ? 'multi-select' : 'select',
      options: valueKeys,
      group: 'Dimensions [Rocketstyle (Vitus-Labs)]',
    }

    return { ...acc, [key]: control }
  }, {})

// --------------------------------------------------------
// values to controls
// --------------------------------------------------------
type GetDefaultVitusLabsControls = (component: RocketType) => Controls

export const getDefaultVitusLabsControls: GetDefaultVitusLabsControls = (
  component
) => {
  const { IS_ROCKETSTYLE, VITUS_LABS__COMPONENT } = component

  const IS_ELEMENT = VITUS_LABS__COMPONENT === '@vitus-labs/elements/Element'
  const IS_LIST = VITUS_LABS__COMPONENT === '@vitus-labs/elements/List'
  const IS_TEXT = VITUS_LABS__COMPONENT === '@vitus-labs/elements/Text'
  const IS_OVERLAY = VITUS_LABS__COMPONENT === '@vitus-labs/elements/Overlay'

  const result = {
    ...(IS_ELEMENT || IS_LIST ? CONTROLS.ELEMENT_CONTROLS : {}),

    ...(IS_LIST ? CONTROLS.LIST_CONTROLS : {}),

    ...(IS_TEXT ? CONTROLS.TEXT_CONTROLS : {}),

    ...(IS_OVERLAY ? CONTROLS.OVERLAY_CONTROLS : {}),

    ...(IS_ROCKETSTYLE ? CONTROLS.ROCKETSTYLE_CONTROLS : {}),
  }

  return result as Controls
}

// --------------------------------------------------------
// Make Storybook Controls
// --------------------------------------------------------
type MakeStorybookControls = (
  obj: Record<string, ControlConfiguration>,
  props: Record<string, any>
) => Record<string, StorybookControl>

export const makeStorybookControls: MakeStorybookControls = (obj, props) =>
  Object.entries(obj).reduce((acc, [key, control]) => {
    const defaultValue =
      typeof props[key] !== 'function' ? props[key] : undefined

    if (control.disable) {
      // eslint-disable-next-line no-param-reassign
      acc[key] = {
        table: {
          disable: control.disable,
        },
      }
    } else {
      // eslint-disable-next-line no-param-reassign
      acc[key] = {
        control: { type: control.type /* || CONTROL_MAP[control.type] */ },
        description: control.description,
        options: control.options /* || CONTROL_OPTIONS[control.type] */,
        table: {
          defaultValue: {
            summary: defaultValue || control.value,
          },
          disable: control.disable,
          category: control.group /* || CONTROL_TYPES_GROUPS[control.type] */,
          type: {
            summary: control.valueType,
          },
        },
      }
    }

    return acc
  }, {})

// --------------------------------------------------------
// disableControl
// --------------------------------------------------------
type DisableControl = (
  name: string
) => Record<string, { table: { disable: true } }>

const disableControl: DisableControl = (name) => ({
  [name]: { table: { disable: true } },
})

// --------------------------------------------------------
// disableDimensionControls
// --------------------------------------------------------
type DisableDimensionControls = (
  dimensions: Record<string, boolean>,
  name?: string
) => any

export const disableDimensionControls: DisableDimensionControls = (
  dimensions,
  dimensionName
) => {
  const result = dimensionName ? disableControl(dimensionName) : {}
  const dimensionKeys = Object.values(dimensions)

  return dimensionKeys.reduce((acc, value) => {
    Object.keys(value).forEach((item) => {
      // eslint-disable-next-line no-param-reassign
      acc = { ...acc, ...disableControl(item) }
    })

    return acc
  }, result)
}
