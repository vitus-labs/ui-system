/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactText } from 'react'
import { memoize } from '@vitus-labs/core'

type StripUnit = (value: ReactText, unitReturn?: boolean) => any

export const stripUnit: StripUnit = (value, unitReturn) => {
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

type NormalizeUnit = ({
  param,
  rootSize,
  outputUnit,
}: {
  param: any
  rootSize?: number
  outputUnit?: 'px' | 'rem' | '%' | string
}) => string | number

export const normalizeUnit: NormalizeUnit = memoize(
  ({ param, rootSize = 16, outputUnit = __WEB__ ? 'rem' : 'px' }) => {
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
  },
  { isSerialized: true, maxSize: 100 }
)

type GetValueOf = (...values: Array<unknown>) => number | string | unknown
export const getValueOf: GetValueOf = (...values) =>
  values.find((value) => typeof value !== 'undefined' && value !== null)

type Value = (
  rootSize: number,
  values: Array<unknown>,
  outputUnit?: 'px' | 'rem' | '%' | string
) => string | number
export const value: Value = (rootSize, values, outputUnit?: string) => {
  const param = getValueOf(...values)

  if (Array.isArray(param)) {
    return param
      .reduce(
        (acc, item) =>
          acc.push(
            normalizeUnit({
              param: item,
              rootSize,
              outputUnit,
            })
          ),
        []
      )
      .join(' ')
  }

  return normalizeUnit({
    param,
    rootSize,
    outputUnit,
  })
}
