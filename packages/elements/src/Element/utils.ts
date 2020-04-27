/* eslint-disable import/prefer-default-export */

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
