export type IsEmpty = <T extends Record<string, unknown> | unknown[] | null>(
  param?: T
) => null | undefined extends T ? true : keyof T extends never ? true : false

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
