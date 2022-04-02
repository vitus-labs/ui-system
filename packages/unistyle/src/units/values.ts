import type { Units } from '~/types'
import value from './value'

type GetValueOf = (...values: Array<unknown>) => number | string | unknown
const getValueOf: GetValueOf = (...values) =>
  values.find((value) => typeof value !== 'undefined' && value !== null)

export type Values = (
  values: Array<unknown>,
  rootSize?: number,
  outputUnit?: Units
) => string | number
const values: Values = (values, rootSize, outputUnit) => {
  const param = getValueOf(...values)

  if (Array.isArray(param)) {
    return param
      .reduce((acc, item) => acc.push(value(item, rootSize, outputUnit)), [])
      .join(' ')
  }

  return value(param, rootSize, outputUnit)
}

export default values
