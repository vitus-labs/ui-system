import { Dimensions, DimensionValue, MultiKeys } from '~/types'

// --------------------------------------------------------
// simple object getters
// --------------------------------------------------------
type GetKeys = <T extends Record<string, unknown>>(obj: T) => Array<keyof T>
export const getKeys: GetKeys = (obj) => Object.keys(obj)

type GetValues = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T
) => T[K][]
export const getValues: GetValues = (obj) => Object.values(obj) as any

// --------------------------------------------------------
// get dimensions values array
// --------------------------------------------------------
type ValueType<T> = T extends string ? T : Array<T>[0]
type GetDimensionsValues = <T extends Dimensions, K extends keyof T>(
  obj: T
) => ValueType<T[K]>[]

export const getDimensionsValues: GetDimensionsValues = (obj) =>
  getValues(obj).map((item: DimensionValue) => {
    if (typeof item === 'object') {
      return item.propName as any
    }

    return item
  })

// --------------------------------------------------------
// get multiple dimensions map
// --------------------------------------------------------
type GetMultipleDimensions = <T extends Dimensions>(obj: T) => MultiKeys<T>

export const getMultipleDimensions: GetMultipleDimensions = (obj) =>
  getValues(obj).reduce((accumulator, value: DimensionValue) => {
    if (typeof value === 'object') {
      // eslint-disable-next-line no-param-reassign
      if (value.multi === true) accumulator[value.propName] = true
    }

    return accumulator
  }, {})
