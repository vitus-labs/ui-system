type ArityOneFn = (arg: any) => any
type PickLastInTuple<T extends any[]> = T extends [
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ...rest: infer U,
  argn: infer L,
]
  ? L
  : any

type FirstFnParameterType<T extends any[]> = Parameters<PickLastInTuple<T>>[any]
type LastFnReturnType<T extends any[]> = ReturnType<T[0]>

const compose =
  <T extends ArityOneFn[]>(...fns: T) =>
  (p: FirstFnParameterType<T>): LastFnReturnType<T> =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    fns.reduceRight((acc: any, cur: any) => cur(acc), p)

export default compose
