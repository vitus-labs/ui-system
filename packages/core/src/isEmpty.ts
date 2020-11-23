type IsEmpty = (param: Record<string | number, any>) => boolean

const isEmpty: IsEmpty = (param) =>
  Object.entries(param).length === 0 && param.constructor === Object

export default isEmpty
