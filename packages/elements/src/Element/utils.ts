import { INLINE_ELEMENTS, EMPTY_ELEMENTS } from './constants'

type Value<T = unknown> = T extends true ? 'rows' : 'inline'

type TransformVerticalProp = <
  T extends boolean | Record<string, boolean> | Array<boolean>
>(
  vertical: T
) => T extends boolean
  ? Value<T>
  : T extends Record<string, boolean>
  ? Record<keyof T, Value<T[keyof T]>>
  : T extends Array<boolean>
  ? Array<Value<T[number]>>
  : T

export const transformVerticalProp: TransformVerticalProp = (vertical) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (vertical == null) return undefined as any

  const verticalType = typeof vertical

  // vertical is a boolean value
  if (verticalType === 'boolean') {
    return vertical ? 'rows' : 'inline'
  }

  if (Array.isArray(vertical)) {
    return (vertical as Array<boolean>).map((item) =>
      item ? 'rows' : 'inline'
    )
  }

  if (verticalType === 'object') {
    return Object.keys(vertical).reduce((accumulator, item) => {
      // eslint-disable-next-line no-param-reassign
      accumulator[item] = vertical[item] ? 'rows' : 'inline'
      return accumulator
    }, {} as Record<string, 'rows' | 'inline'>)
  }

  return undefined
}

type GetValue = (tag: string) => boolean | undefined

export const isInlineElement: GetValue = (tag) => INLINE_ELEMENTS[tag]

export const getShouldBeEmpty: GetValue = (tag) => EMPTY_ELEMENTS[tag]
