import { INLINE_ELEMENTS, EMPTY_ELEMENTS } from './constants'

type GetValue = (tag?: string) => boolean

export const isInlineElement: GetValue = (tag) => {
  if (tag && tag in INLINE_ELEMENTS) return true
  return false
}

export const getShouldBeEmpty: GetValue = (tag) => {
  if (tag && tag in EMPTY_ELEMENTS) return true
  return false
}
