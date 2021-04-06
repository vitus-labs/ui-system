import { isColor } from '~/utils/string'

const CONTROL_TYPES = {
  html: 'HTML Semantics',
  boolean: 'Booleans',
  values: 'Simple values',
  options: 'Options',
  dateTime: 'Date & Time',
  pseudo: 'Pseudo',
  events: 'Events',
  dimensions: 'Dimensions',
}

const CONTROLS_MAP = {
  boolean: () => ({
    control: { type: 'boolean' },
    table: {
      category: CONTROL_TYPES.boolean,
    },
  }),
  pseudo: () => ({
    control: { type: 'boolean' },
    table: {
      category: CONTROL_TYPES.pseudo,
    },
  }),
  pseudoAction: () => ({
    control: { type: 'action' },
    table: {
      category: CONTROL_TYPES.pseudo,
    },
  }),
  dimensionSelect: ({ options }) => ({
    control: { type: 'select', options },
    table: {
      category: CONTROL_TYPES.dimensions,
    },
  }),
  dimensionMultiSelect: ({ options }) => ({
    control: { type: 'multi-select', options },
    table: {
      category: CONTROL_TYPES.dimensions,
    },
  }),
  number: ({ options }) => ({
    control: { type: 'number', options },
    table: {
      category: CONTROL_TYPES.values,
    },
  }),
  range: () => {},
  object: () => {},
  array: () => {},
  radio: ({ options }) => ({
    control: { type: 'radio', options },
    table: {
      category: CONTROL_TYPES.options,
    },
  }),
  inlineRadio: ({ options }) => ({
    control: { type: 'inline-radio', options },
    table: {
      category: CONTROL_TYPES.options,
    },
  }),
  check: ({ options }) => ({
    control: { type: 'check', options },
    table: {
      category: CONTROL_TYPES.options,
    },
  }),
  inlineCheck: ({ options }) => ({
    control: { type: 'inline-check', options },
    table: {
      category: CONTROL_TYPES.options,
    },
  }),
  select: ({ options }) => ({
    control: { type: 'select', options },
    table: {
      category: CONTROL_TYPES.options,
    },
  }),
  tag: ({ options }) => ({
    control: { type: 'select', options },
    table: {
      category: CONTROL_TYPES.html,
      description: 'HTML Ta',
    },
  }),
  multiSelect: ({ options }) => ({
    control: { type: 'multi-select', options },
    table: {
      category: CONTROL_TYPES.options,
    },
  }),
  text: () => ({
    control: { type: 'text' },
    table: {
      category: CONTROL_TYPES.values,
    },
  }),
  color: () => ({
    control: { type: 'color' },
    table: {
      category: CONTROL_TYPES.values,
    },
  }),
  date: () => ({
    control: { type: 'date' },
    table: {
      category: CONTROL_TYPES.dateTime,
    },
  }),
} as const

export const isControl = (param) =>
  typeof param === 'object' && param !== null && !!CONTROLS_MAP[param.type]

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
    const type = value?.type
    if (type) return type

    return primitiveType
  }

  return primitiveType
}

export const mergeOptions = ({ defaultProps, attrs }) => {
  const result = { ...defaultProps }

  return Object.entries(attrs).reduce((acc, [key, value]) => {
    if (defaultProps[key] && typeof value === 'object')
      return {
        ...acc,
        [key]: { ...value, value: value?.value || defaultProps[key] },
      }

    return { ...acc, [key]: value }
  }, result)
}

export const transformToControls = (props) =>
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

type PropItem = {
  type: keyof typeof CONTROLS_MAP
  value: any
  options: any
}

type FilterDefaultProps = (
  props: Record<string, PropItem>
) => Record<string, PropItem['value']>

export const filterDefaultProps: FilterDefaultProps = (props = {}) =>
  Object.entries(props).reduce(
    (acc, [key, value]) => ({ ...acc, [key]: value.value }),
    {}
  )

type FilterControls = <T extends Record<string, PropItem>>(
  props?: T
) => Record<keyof T, PropItem['value']> | Record<string, unknown>

export const filterControls: FilterControls = (props = {}) =>
  Object.entries(props).reduce(
    (acc, [key, value]) => ({ ...acc, [key]: CONTROLS_MAP[value.type](value) }),
    {}
  )

export const disableControl = (name) => ({
  [name]: { table: { disable: true } },
})

type DisableDimensionControls = (
  name: string,
  dimensions: Record<string, boolean>
) => any

export const disableDimensionControls: DisableDimensionControls = (
  name,
  dimensions
) => {
  const result = disableControl(name)

  const dimensionKeys = Object.values(dimensions)

  return dimensionKeys.reduce((acc, value) => {
    Object.keys(value).forEach((item) => {
      acc = { ...acc, ...disableControl(item) }
    })

    return acc
  }, result)

  // return Object.keys(dimensions).reduce(
  //   (acc, value) => ({
  //     ...acc,
  //     ...disableControl(value),
  //   }),
  //   result
  // )
}
