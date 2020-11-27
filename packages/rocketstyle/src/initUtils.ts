import { Dimensions } from '~/types'

// --------------------------------------------------------
// simple object getters
// --------------------------------------------------------
type GetKeys = <T extends Record<string, unknown>>(obj: T) => Array<keyof T>
export const getKeys: GetKeys = (obj) => Object.keys(obj)

type GetValues = <T extends Record<string, unknown>>(
  obj: T
) => ReturnType<typeof Object.values>
export const getValues: GetValues = (obj) => Object.values(obj)

// --------------------------------------------------------
// get dimensions values array
// --------------------------------------------------------
type GetDimensionsValues = <T extends Dimensions>(obj: T) => Array<string>
export const getDimensionsValues: GetDimensionsValues = (obj) =>
  getValues(obj).map((item) => {
    if (Array.isArray(item)) return item[0]
    return item
  })

// --------------------------------------------------------
// get multiple dimensions map
// --------------------------------------------------------
type GetMultipleDimensions = <T extends Dimensions>(
  obj: T
) => Record<keyof T, boolean>
export const getMultipleDimensions: GetMultipleDimensions = (obj) =>
  getValues(obj).reduce((accumulator, value) => {
    if (Array.isArray(value) && value[1].multi) {
      // eslint-disable-next-line no-param-reassign
      accumulator[value[0]] = true
    }

    return accumulator
  }, {})
