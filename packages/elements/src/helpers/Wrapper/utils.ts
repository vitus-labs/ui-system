import { INLINE_ELEMENTS_FLEX_FIX } from './constants'

export const isFixNeeded = (tag, isWeb) => {
  if (isWeb) {
    return INLINE_ELEMENTS_FLEX_FIX.includes(tag)
  }

  return false
}
