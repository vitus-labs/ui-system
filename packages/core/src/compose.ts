// const compose = <R>(fn1: (a: R) => R, ...fns: Array<(a: R) => R>) =>
//   fns.reduce((a, b) => (value) => a(b(value)), fn1)

const compose = (funcs) =>
  funcs.reduce(
    (a, b) => (...args) => a(b(...args)),
    (arg) => arg
  )

export default compose
