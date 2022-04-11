import * as CONTROLS from '~/controls'
import type { Controls, RocketType } from '~/types'

// --------------------------------------------------------
// isColor
// --------------------------------------------------------
type IsColor = (value: string) => boolean

const isColor: IsColor = (value) => {
  const s = new Option().style
  s.color = value
  // eslint-disable-next-line eqeqeq
  return s.color == value
}

// --------------------------------------------------------
// getControlType
// --------------------------------------------------------
type GetControlType = (
  value: any
) => 'array' | 'boolean' | 'number' | 'color' | 'text' | 'object' | undefined

const getControlType: GetControlType = (value) => {
  const primitiveType = typeof value

  if (Array.isArray(value)) return 'array'

  if (primitiveType === 'boolean') return primitiveType

  if (['number', 'bigint'].includes(primitiveType)) return 'number'

  if (primitiveType === 'string') {
    // if (isColor(value)) return 'color'

    return 'text'
  }

  if (primitiveType === 'object' && value !== null) return primitiveType

  return undefined
}

// --------------------------------------------------------
// transformToControls
// --------------------------------------------------------
type TransformToControls = (props: Record<string, unknown>) => Controls

const transformToControls: TransformToControls = (props) =>
  Object.entries(props).reduce((acc, [key, value]) => {
    const type = getControlType(value)

    return {
      ...acc,
      [key]: {
        type,
        value,
      },
    }
  }, {})

// --------------------------------------------------------
// get Predefined Controls
// --------------------------------------------------------
type GetPredefinedControls = (obj: Controls, defaultProps: Controls) => Controls

const getPredefinedControls: GetPredefinedControls = (obj, defaultProps) =>
  Object.entries(obj).reduce((acc, [key, value]) => {
    const attrControl = defaultProps[key]

    if (!value.type) return acc

    if (attrControl) {
      return {
        ...acc,
        [key]: {
          ...value,
          value: attrControl.value || value.value,
          options: attrControl.options || value.options,
        },
      }
    }

    return acc
  }, obj)

// --------------------------------------------------------
// values to controls
// --------------------------------------------------------
type ValuesToControls = ({
  component,
  values,
  dimensionControls,
}: {
  component: RocketType
  values: Record<string, any>
  dimensionControls: Record<string, any>
}) => Controls

const valuesToControls: ValuesToControls = ({
  component,
  values,
  dimensionControls = {},
}) => {
  const { IS_ROCKETSTYLE, VITUS_LABS__COMPONENT } = component

  const IS_ELEMENT = VITUS_LABS__COMPONENT === '@vitus-labs/elements/Element'
  const IS_LIST = VITUS_LABS__COMPONENT === '@vitus-labs/elements/List'
  const IS_TEXT = VITUS_LABS__COMPONENT === '@vitus-labs/elements/Text'
  const IS_OVERLAY = VITUS_LABS__COMPONENT === '@vitus-labs/elements/Overlay'

  const attrsControls = transformToControls(values)

  return {
    ...(IS_ELEMENT || IS_LIST
      ? getPredefinedControls(CONTROLS.ELEMENT_CONTROLS as any, attrsControls)
      : {}),

    ...(IS_LIST
      ? getPredefinedControls(CONTROLS.LIST_CONTROLS as any, attrsControls)
      : {}),

    ...(IS_TEXT
      ? getPredefinedControls(CONTROLS.TEXT_CONTROLS as any, attrsControls)
      : {}),

    ...(IS_OVERLAY
      ? getPredefinedControls(CONTROLS.OVERLAY_CONTROLS as any, attrsControls)
      : {}),

    ...dimensionControls,

    ...(IS_ROCKETSTYLE
      ? getPredefinedControls(
          CONTROLS.ROCKETSTYLE_CONTROLS as any,
          attrsControls
        )
      : {}),
  }
}

export default valuesToControls
