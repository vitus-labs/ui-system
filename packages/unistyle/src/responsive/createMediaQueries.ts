export type CreateMediaQueries = <
  B extends {},
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
  Object.keys(breakpoints).reduce(
    (acc, key) => {
      // use em in breakpoints to work properly cross-browser and support users
      // changing their browsers font-size: https://zellwk.com/blog/media-query-units/
      const breakpointValue = breakpoints[key]

      if (breakpointValue === 0) {
        acc[key] = (...args: any[]) => css(...args)
      } else {
        const emSize = breakpoints[key] / rootSize

        acc[key] = (...args: any[]) => css`
          @media only screen and (min-width: ${emSize}em) {
            ${css(...args)};
          }
        `
      }

      return acc
    },
    {} as { [I in keyof typeof breakpoints]: ReturnType<typeof css> },
  )

export default createMediaQueries
