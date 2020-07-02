import { INLINE_ELEMENTS, EMPTY_ELEMENTS } from './constants'

export const transformVerticalProp = (vertical) => {
  let result
  if (typeof vertical === 'boolean') {
    result = vertical ? 'rows' : 'inline'
  } else if (typeof vertical === 'object') {
    result = {}
    Object.keys(vertical).forEach((item) => {
      result[item] = vertical[item] ? 'rows' : 'inline'
    })
  }

  return result
}

export const calculateSubTag = (tag, isWeb) => {
  if (isWeb) {
    return INLINE_ELEMENTS.includes(tag) ? 'span' : 'div'
  }

  return undefined
}

export const getShouldBeEmpty = (tag, isWeb) => {
  if (isWeb) {
    return EMPTY_ELEMENTS.includes(tag)
  }

  return undefined
}
