import { context } from '@vitus-labs/core'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Dimensions } from 'react-native'

export type UseBreakpoint = () => string | undefined

/**
 * Returns the name of the currently active breakpoint from the
 * unistyle/core theme context (e.g. `"xs"`, `"md"`, `"lg"`).
 *
 * Uses React Native's `Dimensions` API instead of `matchMedia`.
 */
const useBreakpoint: UseBreakpoint = () => {
  const ctx = useContext(context) as
    | { theme?: { breakpoints?: Record<string, number> } }
    | undefined

  const breakpoints = ctx?.theme?.breakpoints

  const sorted = useMemo(() => {
    if (!breakpoints) return []
    return Object.entries(breakpoints).sort(([, a], [, b]) => a - b)
  }, [breakpoints])

  const getMatch = useCallback(
    (width: number) => {
      let match = sorted[0]?.[0]
      for (const [name, min] of sorted) {
        if (width >= min) match = name
      }
      return match
    },
    [sorted],
  )

  const [current, setCurrent] = useState<string | undefined>(() => {
    if (sorted.length === 0) return undefined
    return getMatch(Dimensions.get('window').width)
  })

  useEffect(() => {
    if (sorted.length === 0) return undefined

    const sub = Dimensions.addEventListener('change', ({ window }) => {
      setCurrent(getMatch(window.width))
    })

    return () => sub.remove()
  }, [sorted, getMatch])

  return current
}

export default useBreakpoint
