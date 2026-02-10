import { get } from '@vitus-labs/core'
import type { Control, Obj, SimpleValue } from '~/types'

// --------------------------------------------------------
// parseProps
// --------------------------------------------------------
type ObjValue = Control

type ParseProps = <
  T extends Record<string, SimpleValue | SimpleValue[] | ObjValue>,
>(
  props: T,
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
      const type = get(value, 'type')
      const options = get(value, 'options')
      const defaultValue = get(value, 'value')

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
type StringifyArray = (props: unknown[]) => string

const stringifyArray: StringifyArray = (props) => {
  let result = '['

  const arrayLength = props.length

  result += props.reduce((acc, value, i) => {
    if (Array.isArray(value)) {
      // TODO: parse arrays
      acc += `${stringifyArray(value)}`
    } else if (typeof value === 'object' && value !== null) {
      acc += `${stringifyObject(value as Record<string, any>)}`
    } else if (['number', 'string'].includes(typeof value)) {
      acc += `"${value}"`
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
    } else if (['string'].includes(typeof value)) {
      acc += `${key}: "${value}"`
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

const stringifyProps: StringifyProps = (props) => {
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

const parseComponentName = (name: string) => {
  const helper = name.split('/')

  if (helper.length > 1) {
    return helper[helper.length - 1]
  }

  return name
}

/**
 * Generates a single self-closing JSX tag string for the given component
 * name and props, e.g. `<Button primary size="large" />`.
 */
type CreateJSXCode = (name: string, props: Obj) => string

export const createJSXCode: CreateJSXCode = (name, props) =>
  `<${parseComponentName(name)} ${stringifyProps(props)} />`

// --------------------------------------------------------
// createJSXCodeArray
// --------------------------------------------------------
type CreateJSXCodeArray = (
  name: string,
  props: Obj,
  dimensionName: string,
  dimensions: Obj,
  useBooleans: boolean,
  isMultiKey: boolean,
) => string

export const createJSXCodeArray: CreateJSXCodeArray = (
  name,
  props,
  dimensionName,
  dimensions,
  useBooleans,
  isMultiKey,
) => {
  if (!dimensions) return `// nothing here`

  let result = ''

  const finalProps = { ...props }
  delete finalProps[dimensionName]

  result += Object.keys(dimensions).reduce((acc, key) => {
    acc += createJSXCode(name, {
      [dimensionName]: isMultiKey ? [key] : key,
      ...finalProps,
    })
    acc += `\n`
    return acc
  }, '')

  if (useBooleans) {
    result += `\n\n`
    result += `// Or alternatively use boolean ${dimensionName} props (${Object.keys(
      dimensions,
    ).toString()})`
    result += `\n`

    result += Object.keys(dimensions).reduce((acc, key) => {
      acc += createJSXCode(name, { [key]: true, ...finalProps })
      acc += `\n`
      return acc
    }, '')
  }

  return result
}

const addBooleanCodeComment = (values: string[]) => {
  let result = `\n\n`
  result += `// Or alternatively use boolean props (e.g. ${values})`
  result += `\n`

  return result
}

/**
 * Generates the JSX code snippet shown in the Storybook docs panel for the
 * main story. Includes the primary JSX tag and, when boolean dimension
 * shorthand is available, an alternative boolean-prop usage example.
 */
type GenerateMainJSXCode = (params: {
  name: string
  props: Record<string, string>
  dimensions: Record<string, string>
  booleanDimensions: Record<string, boolean> | null | undefined
}) => string

export const generateMainJSXCode: GenerateMainJSXCode = ({
  name,
  props,
  dimensions,
  booleanDimensions,
}) => {
  let result = createJSXCode(name, { ...dimensions, ...props })

  if (booleanDimensions) {
    const keys = Object.keys(booleanDimensions)
    result += addBooleanCodeComment(keys)
    result += createJSXCode(name, { ...booleanDimensions, ...props })
  }

  return result
}
