import {
  text,
  boolean,
  number,
  color,
  object,
  select,
  radios,
} from '@storybook/addon-knobs'

const knobsMap = {
  boolean,
  number: (key, value, id) => number(key, value, undefined, id),
  string: text,
  range: number,
  color,
  object,
  select: (key, { defaultValue, data }, id) =>
    select(key, data, defaultValue, id),
  radios: (key, { defaultValue, data }, id) =>
    radios(key, data, defaultValue, id),
  array: (key, data, id) => object(key, data, id),
}

const isColor = (strColor) => {
  const s = new Option().style
  s.color = strColor
  return s.color == strColor
}

const getKnobType = (value) => {
  const primitiveType = typeof value

  if (Array.isArray(value)) return 'array'

  if (['number', 'boolean'].includes(primitiveType)) {
    return primitiveType
  }

  if (primitiveType === 'string') {
    if (isColor(value)) return 'color'

    return primitiveType
  }

  if (primitiveType === 'object' && value !== null) {
    const type = value?.type
    if (type) return type

    return primitiveType
  }

  return primitiveType
}

const generateKnobs = (props = {}, ID) =>
  Object.entries(props).reduce((acc, [key, value]) => {
    // skip empty values
    if (value === null || value === undefined) return acc

    const helper = getKnobType(value)
    const knob = knobsMap[helper]

    return { ...acc, [key]: knob(key, value, ID) }
  }, {})

export default generateKnobs
