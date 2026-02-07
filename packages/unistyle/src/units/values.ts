import type { Units } from '~/types'
import value from './value'

/** Returns the first non-null/undefined value from the arguments. */
type GetValueOf = (...values: unknown[]) => number | string
const getValueOf: GetValueOf = (...values: any[]) =>
  values.find((value) => typeof value !== 'undefined' && value !== null)

export type Values = (
  values: unknown[],
  rootSize?: number,
  outputUnit?: Units,
) => string | number | null

/**
 * Picks the first non-null value from the array, converts it via `value()`,
 * and returns the result. If the picked value is itself an array, each item
 * is converted and joined with spaces (e.g. for shorthand properties).
 */
const values: Values = (values, rootSize, outputUnit) => {
  const param = getValueOf(...values)

  if (Array.isArray(param)) {
    return param.map((item) => value(item, rootSize, outputUnit)).join(' ')
  }

  return value(param, rootSize, outputUnit)
}

export default values
