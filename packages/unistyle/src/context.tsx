// @ts-ignore
import React, { ReactNode, useContext, useMemo, FC } from 'react'
import { config, isEmpty } from '@vitus-labs/core'
import { sortBreakpoints, createMediaQueries } from './mediaQueries'
// import useWindowSize from './useWindowSize'

const StyledProvider = config.context.Provider

// const calculateBreakpointState = (breakpoints, width) => {
//   const result = {}

//   Object.keys(breakpoints).forEach((item) => {
//     const breakpointWidth = breakpoints[item]

//     result[item] = width >= breakpointWidth
//   })

//   return result
// }

// const calculateCurrentBreakpoint = (breakpoints, width) => {
//   const sortedBreakpoints = sortBreakpoints(breakpoints)
//   let result = ''

//   sortedBreakpoints.forEach((item, i) => {
//     const breakpointWidth = breakpoints[sortedBreakpoints[i]]

//     if (width >= breakpointWidth) result = item
//   })

//   return result
// }

export default () => {
  const { breakpoints } = useContext(config.context)
  // const { width, height } = useWindowSize()

  const result = {
    breakpoints: {},
    sortedBreakpoints: [],
    // breakpointsState: {},
    // currentBreakpoint: {},
    // component: config.component,
    // viewport: { width, height },
    // getCurrentBreakpoint: (breakpoints) =>
    //   calculateCurrentBreakpoint(breakpoints, width),
    // getAllBreakpointsState: (breakpoints) =>
    //   calculateBreakpointState(breakpoints, width),
  }

  if (!breakpoints || isEmpty(breakpoints)) {
    // if (process.env.NODE_ENV !== 'production') {
    //   console.warn(`
    //     vitusLabs Context Consumer is not getting any breakpoints
    //     from your Theme Provider
    //   `)
    // }
  } else {
    const sortedBreakpoints = useMemo(() => sortBreakpoints(breakpoints), [
      breakpoints,
    ])

    result.breakpoints = breakpoints
    result.sortedBreakpoints = sortedBreakpoints
    // result.breakpointsState = calculateBreakpointState(breakpoints, width)
    // result.currentBreakpoint = calculateCurrentBreakpoint(breakpoints, width)
  }

  return result
}

type VitusLabsContext = {
  sortedBreakpoints?: ReturnType<typeof sortBreakpoints>
  media?: ReturnType<typeof createMediaQueries>
}

type Theme = {
  breakpoints?: Record<string, number>
  rootSize: number
}

type ProviderType = {
  theme: Theme
  children: ReactNode
}

const Provider: FC<ProviderType> = ({ theme, children }) => {
  // eslint-disable-next-line no-underscore-dangle
  const __VITUS_LABS__: VitusLabsContext = {}

  const { breakpoints, rootSize } = theme

  if (breakpoints) {
    __VITUS_LABS__.sortedBreakpoints = sortBreakpoints(breakpoints)
    __VITUS_LABS__.media = createMediaQueries({
      breakpoints,
      css: config.css,
      rootSize,
    })
  }

  const result = {
    ...theme,
    __VITUS_LABS__,
  }

  return <StyledProvider value={result}>{children}</StyledProvider>
}
