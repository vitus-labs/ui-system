const parseProps = (props) =>
  Object.entries(props).reduce((acc, [key, value]) => {
    const valueType = typeof value

    if (['string', 'number', 'boolean', 'bigint'].includes(valueType)) {
      acc[key] = value
    } else if (Array.isArray(value)) {
      acc[key] = value
    } else if (valueType === 'object') {
      const type = value?.type
      const data = value?.data
      const defaultValue = value?.defaultValue

      // if has custom knobs configuration
      if (type && data && defaultValue) {
        acc[key] = defaultValue || data
      } else {
        acc[key] = value
      }
    }

    return acc
  }, {})

const stringifyArray = (props: any[]) => {
  let result = '['

  const arrayLength = props.length

  result += props.reduce((acc, value, i) => {
    if (Array.isArray(value)) {
      // TODO: parse arrays
      acc += `${stringifyArray(value)}`
    } else if (typeof value === 'object' && value !== null) {
      acc += `${stringifyObject(value)}`
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

const stringifyObject = (props) => {
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

export const stringifyProps = (props) => {
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
    } else if (typeof value === 'object') {
      acc += `${key}={${stringifyObject(value)}}`
    }

    if (arrayLength !== i + 1) {
      acc += ' '
    }

    return acc
  }, '')
}

export const createJSXCode = (name, props) => {
  let result = `<${name} `

  result += stringifyProps(props)

  result += ` />`

  return result
}

export const createJSXCodeArray = (
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
