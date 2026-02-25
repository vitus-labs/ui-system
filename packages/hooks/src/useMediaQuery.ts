import { useCallback, useEffect, useState } from 'react'

export type UseMediaQuery = (query: string) => boolean

/**
 * Subscribes to a CSS media query and returns whether it currently matches.
 * Uses `window.matchMedia` with an event listener for live updates.
 */
const useMediaQuery: UseMediaQuery = (query) => {
  const getMatch = useCallback(
    () =>
      typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
    [query],
  )

  const [matches, setMatches] = useState(getMatch)

  useEffect(() => {
    const mql = window.matchMedia(query)
    setMatches(mql.matches)

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    mql.addEventListener('change', handler)

    return () => mql.removeEventListener('change', handler)
  }, [query])

  return matches
}

export default useMediaQuery
