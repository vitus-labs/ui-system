import { get } from '@vitus-labs/core'
import { isColor } from '~/utils/string'
import CONTROLS_MAP from '~/constants/controlTypes'

import type { PartialControls, Controls, Control, Obj } from '~/types'

// --------------------------------------------------------
// isContorl
// --------------------------------------------------------
type IsControl = (param: any) => boolean

export const isControl: IsControl = (param) =>
  typeof param === 'object' && param !== null && !!CONTROLS_MAP[param.type]

// --------------------------------------------------------
// getControlType
// --------------------------------------------------------
type GetControlType = (value: any) => keyof typeof CONTROLS_MAP

const getControlType: GetControlType = (value) => {
  const primitiveType = typeof value

  if (Array.isArray(value)) return 'array'

  if (['number', 'boolean'].includes(primitiveType)) {
    return primitiveType
  }

  if (primitiveType === 'string') {
    if (isColor(value)) return 'color'

    return 'text'
  }

  if (primitiveType === 'object' && value !== null) {
    const type = get(value, 'type')
    if (type) return type

    return primitiveType
  }

  return primitiveType
}

// --------------------------------------------------------
// mergeOptions
// --------------------------------------------------------
type MergeOptions = ({
  defaultProps,
  attrs,
}: {
  defaultProps: Record<string, unknown>
  attrs: PartialControls | Obj
}) => Record<string, unknown>

export const mergeOptions: MergeOptions = ({ defaultProps, attrs }) => {
  const result = { ...defaultProps }

  return Object.entries(attrs).reduce((acc, [key, value]) => {
    if (defaultProps[key] && typeof value === 'object' && value !== null)
      return {
        ...acc,
        [key]: { ...value, value: get(value, 'value') || defaultProps[key] },
      }

    return { ...acc, [key]: value }
  }, result)
}

// --------------------------------------------------------
// transformToControls
// --------------------------------------------------------
type TransformToControls = (props: Record<string, unknown>) => Controls

export const transformToControls: TransformToControls = (props) =>
  Object.entries(props).reduce((acc, [key, value]) => {
    if (isControl(value)) return { ...acc, [key]: value }

    const type = getControlType(value)
    const control = CONTROLS_MAP[type]

    if (typeof control === 'function') {
      return {
        ...acc,
        [key]: {
          type,
          value,
        },
      }
    }

    return acc
  }, {})

// --------------------------------------------------------
// filterDefaultProps
// --------------------------------------------------------
type FilterDefaultProps = (props: Controls) => Record<string, Control['value']>

export const filterDefaultProps: FilterDefaultProps = (props = {}) =>
  Object.entries(props).reduce(
    (acc, [key, value]) => ({ ...acc, [key]: value.value }),
    {}
  )

// --------------------------------------------------------
// filterControls
// --------------------------------------------------------
type FilterControls = <T extends Controls>(
  props: T
) => Record<keyof T, Control['value']> | Record<string, unknown>

export const filterControls: FilterControls = (props) =>
  Object.entries(props).reduce(
    (acc, [key, value]) => ({ ...acc, [key]: CONTROLS_MAP[value.type](value) }),
    {}
  )

// --------------------------------------------------------
// disableControl
// --------------------------------------------------------
type DisableControl = (
  name: string
) => Record<string, { table: { disable: true } }>

export const disableControl: DisableControl = (name) => ({
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
