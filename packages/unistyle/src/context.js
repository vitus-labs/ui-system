import { useContext } from 'react'
import config from '@vitus-labs/core'
import { sortBreakpoints } from './mediaQueries'

const isEmpty = param =>
  Object.entries(param).length === 0 && param.constructor === Object

export default () => {
  const { breakpoints } = useContext(config().context)

  const result = {
    component: config().component,
    isWeb: config().isWeb,
    isNative: config().isNative
  }

  if (!breakpoints || isEmpty(breakpoints)) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`
        vitusLabs Context Consumer is not getting any breakpoints
        from your Theme Provider
      `)
    }
  } else {
    result.sortedBreakpoints = sortBreakpoints(breakpoints)
  }

  return result
}
