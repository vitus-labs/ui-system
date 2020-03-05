import { useContext } from 'react'
import config from '@vitus-labs/core'
import { sortBreakpoints } from './mediaQueries'
import useWindowSize from './useWindowSize'

const isEmpty = param =>
  Object.entries(param).length === 0 && param.constructor === Object

const calculateBreakpointState = (breakpoints, width) => {
  const result = {}

  Object.keys(breakpoints).forEach(item => {
    const breakpointWidth = breakpoints[item]

    result[item] = width >= breakpointWidth
  })

  return result
}

const calculateCurrentBreakpoint = ({ sortedBreakpoints, breakpoints, width }) => {
  let result = ''

  sortedBreakpoints.forEach((item, i) => {
    const breakpointWidth = breakpoints[sortedBreakpoints[i]]

    if (width >= breakpointWidth) result = item
  })

  return result
}

export default () => {
  const { breakpoints } = useContext(config.context)
  const { width, height } = useWindowSize()

  const result = {
    component: config.component,
    isWeb: config.isWeb,
    isNative: config.isNative,
    viewport: { width, height }
  }

  if (!breakpoints || isEmpty(breakpoints)) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`
        vitusLabs Context Consumer is not getting any breakpoints
        from your Theme Provider
      `)
    }
  } else {
    const sortedBreakpoints = sortBreakpoints(breakpoints)

    result.sortedBreakpoints = sortedBreakpoints
    result.breakpoints = calculateBreakpointState(breakpoints, width)
    result.currentBreakpoint = calculateCurrentBreakpoint({
      breakpoints,
      sortedBreakpoints,
      width
    })
  }

  return result
}
