import { context } from '@vitus-labs/core'
import { useContext, useEffect, useMemo, useState } from 'react'

export type UseBreakpoint = () => string | undefined

/**
 * Returns the name of the currently active breakpoint from the
 * unistyle/core theme context (e.g. `"xs"`, `"md"`, `"lg"`).
 *
 * Reads `theme.breakpoints` from the nearest `Provider` and
 * subscribes to viewport changes via `matchMedia`.
 *
 * Returns `undefined` when no Provider or breakpoints are available.
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

  const [current, setCurrent] = useState<string | undefined>(() => {
    if (sorted.length === 0) return undefined
    if (typeof window === 'undefined') return sorted[0]?.[0]

    const width = window.innerWidth
    let match = sorted[0]?.[0]
    for (const [name, min] of sorted) {
      if (width >= min) match = name
    }
    return match
  })

  useEffect(() => {
    if (sorted.length === 0) return undefined

    const mqls: {
      mql: MediaQueryList
      handler: (e: MediaQueryListEvent) => void
    }[] = []

    const update = () => {
      const width = window.innerWidth
      let match = sorted[0]?.[0]
      for (const [name, min] of sorted) {
        if (width >= min) match = name
      }
      setCurrent(match)
    }

    for (const [, min] of sorted) {
      const mql = window.matchMedia(`(min-width: ${min}px)`)
      const handler = () => update()
      mql.addEventListener('change', handler)
      mqls.push({ mql, handler })
    }

    return () => {
      for (const { mql, handler } of mqls) {
        mql.removeEventListener('change', handler)
      }
    }
  }, [sorted])

  return current
}

export default useBreakpoint
