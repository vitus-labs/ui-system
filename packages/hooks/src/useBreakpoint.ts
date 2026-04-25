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

    let raf = 0
    const update = () => {
      raf = 0
      const width = window.innerWidth
      let match = sorted[0]?.[0]
      for (const [name, min] of sorted) {
        if (width >= min) match = name
      }
      setCurrent(match)
    }

    // Single rAF-throttled resize listener instead of one matchMedia listener
    // per breakpoint. With 5-8 breakpoints this saves 4-7 listener registrations
    // per hook instance.
    const onResize = () => {
      if (raf === 0) raf = requestAnimationFrame(update)
    }

    window.addEventListener('resize', onResize, { passive: true })
    return () => {
      if (raf !== 0) cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [sorted])

  return current
}

export default useBreakpoint
