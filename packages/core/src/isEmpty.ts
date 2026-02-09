/**
 * Type-safe emptiness check for objects, arrays, null, and undefined.
 * Returns `true` for null, undefined, empty objects `{}`, and empty arrays `[]`.
 * Non-object primitives (string, number) also return `true` as any.
 */
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
  if (!param) return true

  if (typeof param !== 'object') {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return true as any
  }

  if (Array.isArray(param)) {
    return param.length === 0
  }

  return Object.keys(param).length === 0
}

export default isEmpty
