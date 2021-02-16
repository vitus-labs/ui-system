export type IsEmpty = (
  param: Record<string | number, any> | null | undefined
) => boolean

const isEmpty: IsEmpty = (param) => {
  if (typeof param !== 'object') return true
  if (param === null) return true

  return Object.entries(param).length === 0 && param.constructor === Object
}

export default isEmpty
