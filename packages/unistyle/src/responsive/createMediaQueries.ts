export type CreateMediaQueries = <
  B extends Record<string, number>,
  R extends number,
  C extends (...args: any) => any,
>(props: {
  breakpoints: B
  rootSize: R
  css: C
}) => Record<keyof B, ReturnType<C>>

/**
 * Builds a map of breakpoint-name → tagged-template function.
 * The smallest breakpoint (value 0) gets no media wrapper.
 * Others are wrapped in `@media (min-width: <em>)` — em units
 * ensure correct behaviour when users change browser font size.
 */
const createMediaQueries: CreateMediaQueries = ({
  breakpoints,
  rootSize,
  css,
}) =>
  Object.keys(breakpoints).reduce<Record<string, any>>((acc, key) => {
    // use em in breakpoints to work properly cross-browser and support users
    // changing their browsers font-size: https://zellwk.com/blog/media-query-units/
    const breakpointValue = (breakpoints as Record<string, number>)[key]

    if (breakpointValue === 0) {
      acc[key] = (...args: any[]) => css(...args)
    } else if (breakpointValue != null) {
      const emSize = breakpointValue / rootSize

      acc[key] = (...args: any[]) => css`
          @media only screen and (min-width: ${emSize}em) {
            ${css(...args)};
          }
        `
    }

    return acc
  }, {}) as any

export default createMediaQueries
