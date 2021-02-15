const breakpoints = {
  rootSize: 16,
  breakpoints: {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
  },
} as const

export type Breakpoints = typeof breakpoints

export default breakpoints
