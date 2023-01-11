export type CreateMediaQueries = <
  B extends {},
  R extends number,
  C extends (...args: any) => any
>(props: {
  breakpoints: B
  rootSize: R
  css: C
}) => Record<keyof B, ReturnType<C>>

const createMediaQueries: CreateMediaQueries = ({
  breakpoints,
  rootSize,
  css,
}) =>
  Object.keys(breakpoints).reduce((acc, key) => {
    // use em in breakpoints to work properly cross-browser and support users
    // changing their browsers font-size: https://zellwk.com/blog/media-query-units/
    const breakpointValue = breakpoints[key]
    const result = { ...acc }
    /* eslint-disable-next-line no-param-reassign */

    if (breakpointValue === 0) {
      result[key] = (...args: any[]) => css(...args)
    } else {
      const emSize = breakpoints[key] / rootSize

      result[key] = (...args: any[]) =>
        css`
          @media only screen and (min-width: ${emSize}em) {
            ${css(...args)};
          }
        `
    }

    return result
  }, {} as { [I in keyof typeof breakpoints]: ReturnType<typeof css> })

export default createMediaQueries
