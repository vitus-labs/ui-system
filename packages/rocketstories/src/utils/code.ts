/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
import type { Control, SimpleValue, Obj } from '~/types'

// --------------------------------------------------------
// parseProps
// --------------------------------------------------------
type ObjValue = Control

type ParseProps = <
  T extends Record<string, SimpleValue | Array<SimpleValue> | ObjValue>
>(
  props: T
) => Record<keyof T, unknown>

const parseProps: ParseProps = (props) =>
  Object.entries(props).reduce((acc, [key, value]) => {
    if (value === null) return acc

    const valueType = typeof value

    if (['string', 'number', 'boolean', 'bigint'].includes(valueType)) {
      return { ...acc, [key]: value }
    }

    if (Array.isArray(value)) {
      return { ...acc, [key]: value }
    }

    if (valueType === 'object') {
      const type = (value as ObjValue)?.type
      const options = (value as ObjValue)?.options
      const defaultValue = (value as ObjValue)?.value

      // if has custom knobs configuration
      if (type && options && defaultValue) {
        return { ...acc, [key]: defaultValue || options }
      }

      return { ...acc, [key]: value }
    }

    return acc
  }, {} as any)

// --------------------------------------------------------
// stringifyArray
// --------------------------------------------------------
type StringifyArray = (props: Array<unknown>) => string

const stringifyArray: StringifyArray = (props) => {
  let result = '['

  const arrayLength = props.length

  result += props.reduce((acc, value, i) => {
    if (Array.isArray(value)) {
      // TODO: parse arrays
      acc += `${stringifyArray(value)}`
    } else if (typeof value === 'object' && value !== null) {
      acc += `${stringifyObject(value as Record<string, any>)}`
    } else {
      acc += `${value}`
    }

    // if not last item, add comma and space
    if (arrayLength !== i + 1) {
      acc += `, `
    }

    return acc
  }, '')

  result += ']'

  return result
}

// --------------------------------------------------------
// stringifyObject
// --------------------------------------------------------
type StringifyObject = (props: Obj) => string

const stringifyObject: StringifyObject = (props) => {
  let result = '{ '

  const propsArray = Object.entries(props)
  const arrayLength = propsArray.length

  result += propsArray.reduce((acc, [key, value], i) => {
    if (Array.isArray(value)) {
      // TODO: parse arrays
      acc += `${key}: ${value}`
    } else if (typeof value === 'object' && value !== null) {
      acc += `${key}: ${stringifyObject(value)}`
    } else {
      acc += `${key}: ${value}`
    }

    if (arrayLength !== i + 1) {
      acc += `, `
    }

    return acc
  }, '')

  result += ' }'

  return result
}

// --------------------------------------------------------
// stringifyObject
// --------------------------------------------------------
type StringifyProps = (props: Obj) => string

export const stringifyProps: StringifyProps = (props) => {
  const parsedProps = parseProps(props)
  const arrayProps = Object.entries(parsedProps)
  const arrayLength = arrayProps.length

  return arrayProps.reduce((acc, [key, value], i) => {
    if (typeof value === 'boolean') {
      if (value === true) acc += `${key}`
      else acc += `${key}=${value}`
    } else if (
      ['string', 'number'].includes(typeof value) ||
      value === null ||
      value === undefined
    ) {
      acc += `${key}="${value}"`
    } else if (Array.isArray(value)) {
      acc += `${key}={${stringifyArray(value)}}`
    } else if (typeof value === 'object' && value !== null) {
      acc += `${key}={${stringifyObject(value as Record<string, any>)}}`
    }

    if (arrayLength !== i + 1) {
      acc += ' '
    }

    return acc
  }, '')
}

// --------------------------------------------------------
// createJSXCode
// --------------------------------------------------------
type CreateJSXCode = (name: string, props: Obj) => string

export const createJSXCode: CreateJSXCode = (name, props) => {
  let result = `<${name} `

  result += stringifyProps(props)

  result += ` />`

  return result
}

// --------------------------------------------------------
// createJSXCodeArray
// --------------------------------------------------------

type CreateJSXCodeArray = (
  name: string,
  props: Obj,
  dimensionName: string,
  dimensions: Obj,
  useBooleans: boolean
) => string

export const createJSXCodeArray: CreateJSXCodeArray = (
  name,
  props,
  dimensionName,
  dimensions,
  useBooleans
) => {
  let result = ''

  result += Object.keys(dimensions).reduce((acc, key) => {
    acc += createJSXCode(name, { [dimensionName]: key, ...props })
    acc += `\n`
    return acc
  }, '')

  if (useBooleans) {
    result += `\n\n`
    result += `// Or alternatively use boolean ${dimensionName} props (${Object.keys(
      dimensions
    ).toString()})`
    result += `\n`

    result += Object.keys(dimensions).reduce((acc, key) => {
      acc += createJSXCode(name, { [key]: true, ...props })
      acc += `\n`
      return acc
    }, '')
  }

  return result
}
