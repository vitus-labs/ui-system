import { INLINE_ELEMENTS, EMPTY_ELEMENTS } from './constants'

export const transformVerticalProp = (vertical) => {
  if (typeof vertical === 'boolean') {
    return vertical ? 'rows' : 'inline'
  }

  if (typeof vertical === 'object') {
    const result = {}
    Object.keys(vertical).forEach((item) => {
      result[item] = vertical[item] ? 'rows' : 'inline'
    })

    return result
  }

  if (Array.isArray(vertical)) {
    return vertical.map((item) => (vertical ? 'rows' : 'inline'))
  }

  return undefined
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
