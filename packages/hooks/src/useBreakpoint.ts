import { context } from '@vitus-labs/core'
import { useCallback, useContext, useMemo, useSyncExternalStore } from 'react'

export type UseBreakpoint = () => string | undefined

// ── Shared viewport subscription ─────────────────────────────────────
// Every hook instance shares ONE rAF-throttled `resize` listener on
// `window` (hot path — previously one listener per instance, and before
// that one matchMedia listener per breakpoint). The listener is attached
// when the first instance subscribes and removed with the last.
const subscribers = new Set<() => void>()
let raf = 0

const flush = () => {
  raf = 0
  for (const cb of subscribers) cb()
}

const onResize = () => {
  if (raf === 0) raf = requestAnimationFrame(flush)
}

const subscribe = (cb: () => void) => {
  subscribers.add(cb)
  if (subscribers.size === 1) {
    window.addEventListener('resize', onResize, { passive: true })
  }
  return () => {
    subscribers.delete(cb)
    if (subscribers.size === 0) {
      window.removeEventListener('resize', onResize)
      if (raf !== 0) {
        cancelAnimationFrame(raf)
        raf = 0
      }
    }
  }
}

const noopSubscribe = () => () => {
  // nothing to unsubscribe: no breakpoints, no listener
}

/**
 * Returns the name of the currently active breakpoint from the
 * unistyle/core theme context (e.g. `"xs"`, `"md"`, `"lg"`).
 *
 * Reads `theme.breakpoints` from the nearest `Provider` and
 * subscribes to viewport changes via a single shared, rAF-throttled
 * `resize` listener (`useSyncExternalStore`, hydration-safe).
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
    // Build the [name, min] tuples directly from a for-in scan instead of
    // `Object.entries(...).sort(...)`. Skips the intermediate entries
    // tuple-array allocation. Cached by useMemo so this runs only when
    // breakpoints identity changes (typically once per Provider mount).
    const tuples: [string, number][] = []
    for (const name in breakpoints) {
      const value = breakpoints[name]
      if (typeof value === 'number') tuples.push([name, value])
    }
    return tuples.sort(([, a], [, b]) => a - b)
  }, [breakpoints])

  const getSnapshot = useCallback(() => {
    const width = window.innerWidth
    let match = sorted[0]?.[0]
    for (const [name, min] of sorted) {
      if (width >= min) match = name
    }
    return match
  }, [sorted])

  // Server + hydration render use the smallest breakpoint (mobile-first),
  // matching what the server could know; React re-renders with the real
  // viewport right after hydration. Client-only renders read the viewport
  // directly on the first render.
  const getServerSnapshot = useCallback(() => sorted[0]?.[0], [sorted])

  return useSyncExternalStore(
    sorted.length === 0 ? noopSubscribe : subscribe,
    getSnapshot,
    getServerSnapshot,
  )
}

export default useBreakpoint
