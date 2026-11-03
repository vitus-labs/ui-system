import { useCallback, useMemo, useSyncExternalStore } from 'react'

export type UseMediaQuery = (query: string) => boolean

const noop = () => {
  // nothing to unsubscribe: matchMedia unavailable
}
const getServerSnapshot = () => false

/**
 * Subscribes to a CSS media query and returns whether it currently matches.
 * Uses `window.matchMedia` with an event listener for live updates.
 *
 * Built on `useSyncExternalStore`, so it is hydration-safe: the server and
 * the hydrating client render `false`, then React immediately re-renders
 * with the real value. Client-only renders (no SSR) get the real value on
 * the very first render.
 */
const useMediaQuery: UseMediaQuery = (query) => {
  // One MediaQueryList per query per instance — `matches` is live, so the
  // snapshot read is a property access rather than a fresh matchMedia() call.
  const mql = useMemo(
    () =>
      typeof window !== 'undefined' && typeof window.matchMedia === 'function'
        ? window.matchMedia(query)
        : null,
    [query],
  )

  const subscribe = useCallback(
    (onChange: () => void) => {
      if (!mql) return noop
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    [mql],
  )

  const getSnapshot = () => (mql ? mql.matches : false)

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export default useMediaQuery
