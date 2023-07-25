export type IsEmpty = <
  T extends Record<number | string, any> | any[] | null | undefined,
>(
  param: T,
) => T extends null | undefined
  ? true
  : keyof T extends never
  ? true
  : T extends T[]
  ? T[number] extends never
    ? true
    : false
  : false

const isEmpty: IsEmpty = (param) => {
  if (!param || param === null) return true

  if (typeof param !== 'object') {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
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
