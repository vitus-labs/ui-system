type ArityOneFn = (arg: any) => any

/** Extracts the last function from a tuple type. */
type PickLastInTuple<T extends any[]> = T extends [
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ...rest: infer U,
  argn: infer L,
]
  ? L
  : any

/** Parameter type of the rightmost (first-applied) function. */
type FirstFnParameterType<T extends any[]> = Parameters<PickLastInTuple<T>>[any]
/** Return type of the leftmost (last-applied) function. */
type LastFnReturnType<T extends any[]> = ReturnType<T[0]>

/**
 * Right-to-left function composition.
 * `compose(f, g, h)(x)` === `f(g(h(x)))`.
 *
 * Used throughout the system to build HOC chains —
 * `compose(attrsHoc, userHoc1, userHoc2)(Component)`.
 */
const compose =
  <T extends ArityOneFn[]>(...fns: T) =>
  (p: FirstFnParameterType<T>): LastFnReturnType<T> =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    fns.reduceRight((acc: any, cur: any) => cur(acc), p)

export default compose
