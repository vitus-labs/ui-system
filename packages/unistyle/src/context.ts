//@ts-ignore
import { useContext, useMemo } from 'react'
import { config } from '@vitus-labs/core'
import { sortBreakpoints } from './mediaQueries'
// import useWindowSize from './useWindowSize'

const isEmpty = (param: object) =>
  Object.entries(param).length === 0 && param.constructor === Object

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
    sortedBreakpoints: {},
    breakpointsState: {},
    currentBreakpoint: {},
    component: config.component,
    isWeb: config.isWeb,
    isNative: config.isNative,
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
