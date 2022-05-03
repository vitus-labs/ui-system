import { get, isEmpty, set } from '@vitus-labs/core'
import { Dimensions, DimensionValue, MultiKeys } from '~/types/dimensions'

// --------------------------------------------------------
// Is value a valid key
// --------------------------------------------------------
type IsValidKey = (value: any) => boolean
export const isValidKey: IsValidKey = (value) =>
  value !== undefined && value !== null && value !== false

// --------------------------------------------------------
// Is value a multi key
// --------------------------------------------------------
type IsMultiKey = (value: any) => [boolean, string]
export const isMultiKey: IsMultiKey = (value) => {
  if (typeof value === 'object') return [true, get(value, 'propName')]
  return [false, value]
}

// --------------------------------------------------------
// calculate dimensions map
// --------------------------------------------------------
type GetDimensionsMap = ({
  themes,
  useBooleans,
}: {
  themes: Record<string, any>
  useBooleans?: boolean
}) => { keysMap: Record<string, any>; keywords: Record<string, any> }

export const getDimensionsMap: GetDimensionsMap = ({ themes, useBooleans }) => {
  const result = { keysMap: {}, keywords: {} }
  if (isEmpty(themes)) return result

  return Object.entries(themes).reduce((accumulator, [key, value]) => {
    const { keysMap, keywords } = accumulator
    keywords[key] = true

    Object.entries(value).forEach(([itemKey, itemValue]) => {
      if (!isValidKey(itemValue)) return

      if (useBooleans) {
        keywords[itemKey] = true
      }

      set(keysMap, [key, itemKey], true)
    })

    return accumulator
  }, result)
}

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
