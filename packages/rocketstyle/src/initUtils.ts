import { Dimensions, DimensionValue } from '~/types'

// --------------------------------------------------------
// simple object getters
// --------------------------------------------------------
type GetKeys = <T extends Record<string, unknown>>(obj: T) => Array<keyof T>
export const getKeys: GetKeys = (obj) => Object.keys(obj)

type GetValues = <T extends Dimensions, K extends keyof T>(
  obj: T
) => Array<T[K]>

export const getValues: GetValues = (obj) => Object.values(obj)

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
type ReturnKeyName<T extends Dimensions> = T[keyof T] extends string
  ? T[keyof T]
  : string

type GetMultipleDimensions = <T extends Dimensions>(
  obj: T
) => Record<string, boolean>

export const getMultipleDimensions: GetMultipleDimensions = (obj) =>
  getValues(obj).reduce((accumulator, value: DimensionValue) => {
    if (typeof value === 'object') {
      // eslint-disable-next-line no-param-reassign
      if (value.multi === true) accumulator[value.propName] = true
    }

    return accumulator
  }, {} as Record<ReturnKeyName<typeof obj>, boolean>)
