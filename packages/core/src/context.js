import { useContext } from 'react'
import { sortBreakpoints } from './utils'
import CONFIG from './config'

const isEmpty = param => Object.entries(param).length === 0 && param.constructor === Object

export default () => {
  const { breakpoints } = useContext(CONFIG().context)

  const result = {
    component: CONFIG().component,
    isWeb: CONFIG().isWeb,
    isNative: CONFIG().isNative,
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
