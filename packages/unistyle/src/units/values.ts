import type { Units } from '~/types'
import value from './value'

type GetValueOf = (...values: unknown[]) => number | string
const getValueOf: GetValueOf = (...values: any[]) =>
  values.find((value) => typeof value !== 'undefined' && value !== null)

export type Values = (
  values: unknown[],
  rootSize?: number,
  outputUnit?: Units,
) => string | number | null

const values: Values = (values, rootSize, outputUnit) => {
  const param = getValueOf(...values)

  if (Array.isArray(param)) {
    return param.map((item) => value(item, rootSize, outputUnit)).join(' ')
  }

  return value(param, rootSize, outputUnit)
}

export default values
