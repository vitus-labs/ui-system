type IsEmpty = (param: Record<string | number, any>) => boolean

const isEmpty: IsEmpty = (param) =>
  typeof param === 'object' &&
  param !== null &&
  Object.entries(param).length === 0 &&
  param.constructor === Object

export default isEmpty
