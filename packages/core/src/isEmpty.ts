export type IsEmpty = <T extends Record<string, any> | any[] | null>(
  param?: T,
) => T extends null | undefined
  ? true
  : keyof T extends never
  ? true
  : T extends Array<T>
  ? T[number] extends never
    ? true
    : false
  : false

const isEmpty: IsEmpty = (param) => {
  if (!param) return true

  if (typeof param !== 'object') {
    return true as any
  }

  if (Array.isArray(param) && param.length === 0) {
    return true
  }

  if (Object.entries(param).length === 0 && param.constructor === Object) {
    return true
  }

  return false
}

export default isEmpty
