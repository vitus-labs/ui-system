import { INLINE_ELEMENTS, EMPTY_ELEMENTS } from './constants'

type Value = 'rows' | 'inline'
type TransformVerticalProp = (
  vertical: boolean | Record<string, boolean> | Array<boolean>
) => Value | Record<string, Value> | Array<Value>

export const transformVerticalProp: TransformVerticalProp = (vertical) => {
  const verticalType = typeof vertical

  // vertical is a boolean value
  if (verticalType === 'boolean') {
    return vertical ? 'rows' : 'inline'
  }

  // vertical is an object value
  // { xs: true, md: false, ... }
  if (verticalType === 'object') {
    const result = {}
    Object.keys(vertical).forEach((item) => {
      result[item] = vertical[item] ? 'rows' : 'inline'
    })

    return result
  }

  // vertical is an array value
  // [ true, false, ... ]
  if (Array.isArray(vertical)) {
    return vertical.map((item) => (item ? 'rows' : 'inline'))
  }

  return undefined
}

type GetValue = (tag: string) => boolean | undefined

export const calculateSubTag: GetValue = (tag) => INLINE_ELEMENTS[tag]

export const getShouldBeEmpty: GetValue = (tag) => EMPTY_ELEMENTS[tag]
