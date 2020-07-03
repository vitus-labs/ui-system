const isEmpty = (param: object) =>
  Object.entries(param).length === 0 && param.constructor === Object

export default isEmpty
