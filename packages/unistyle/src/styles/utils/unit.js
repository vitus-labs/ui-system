import config from '@vitus-labs/core'

export const stripUnit = (value, unitReturn) => {
  const cssRegex = /^([+-]?(?:\d+|\d*\.\d+))([a-z]*|%)$/
  if (typeof value !== 'string') return unitReturn ? [value, undefined] : value
  const matchedValue = value.match(cssRegex)

  if (unitReturn) {
    if (matchedValue) return [parseFloat(value), matchedValue[2]]
    return [value, undefined]
  }

  if (matchedValue) return parseFloat(value)
  return value
}

export const normalizeUnit = ({
  param,
  rootSize = 16,
  outputUnit = config.isWeb ? 'rem' : 'px'
}) => {
  if (!param && param !== 0) return null

  const [value, unit] = stripUnit(param, true)
  if (!value && value !== 0) return null
  if (value === 0 || typeof value === 'string') return param // zero should be unitless

  if (rootSize && !Number.isNaN(value)) {
    if (!unit && outputUnit === 'px') return `${value}${outputUnit}`
    if (!unit) return `${value / rootSize}rem`
    if (unit === 'px' && outputUnit === 'rem') return `${value / rootSize}rem`
  }

  if (unit) return param

  return `${value}${outputUnit}`
}

export const getValueOf = (...values) =>
  values.find(value => typeof value !== 'undefined' && value !== null)

export const value = (rootSize, values, outputUnit) => {
  const param = getValueOf(...values)

  if (Array.isArray(param)) {
    const result = []

    param.forEach(item => {
      result.push(
        normalizeUnit({
          param: item,
          rootSize,
          outputUnit
        })
      )
    })

    return result.join(' ')
  }

  return normalizeUnit({
    param,
    rootSize,
    outputUnit
  })
}
