// const compose = <R>(fn1: (a: R) => R, ...fns: Array<(a: R) => R>) =>
//   fns.reduce((a, b) => (value) => a(b(value)), fn1)

// const compose = (funcs) =>
//   funcs.reduce(
//     (a, b) => (...args) => a(b(...args)),
//     (arg) => arg
//   )

type ArityOneFn = (arg: any) => any
type PickLastInTuple<T extends any[]> = T extends [
  ...rest: infer U,
  argn: infer L
]
  ? L
  : any
type FirstFnParameterType<T extends any[]> = Parameters<PickLastInTuple<T>>[any]
type LastFnReturnType<T extends any[]> = ReturnType<T[0]>

const compose = <T extends ArityOneFn[]>(...fns: T) => (
  p: FirstFnParameterType<T>
): LastFnReturnType<T> => fns.reduceRight((acc: any, cur: any) => cur(acc), p)

export default compose
