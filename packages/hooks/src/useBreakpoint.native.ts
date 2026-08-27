import { context } from '@vitus-labs/core'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Dimensions, type DimensionsPayload } from 'react-native'

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
    // Build the [name, min] tuples directly from a for-in scan instead of
    // `Object.entries(...).sort(...)`. Same pattern as the web variant.
    const tuples: [string, number][] = []
    for (const name in breakpoints) {
      const value = breakpoints[name]
      if (typeof value === 'number') tuples.push([name, value])
    }
    return tuples.sort(([, a], [, b]) => a - b)
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

    // RN 0.87 types `addEventListener`'s handler as bare `Function`, so the
    // payload has to be annotated here — and `window` is optional on it.
    const sub = Dimensions.addEventListener(
      'change',
      ({ window }: DimensionsPayload) => {
        if (!window) return
        setCurrent(getMatch(window.width))
      },
    )

    return () => sub.remove()
  }, [sorted, getMatch])

  return current
}

export default useBreakpoint
