const compose = <R>(fn1: (a: R) => R, ...fns: Array<(a: R) => R>) =>
  fns.reduce((a, b) => (value) => a(b(value)), fn1)

export default compose
