import { useEffect, useRef } from 'react'

export type UseInterval = (callback: () => void, delay: number | null) => void

/**
 * Declarative `setInterval` with auto-cleanup.
 * Pass `null` as `delay` to pause the interval.
 * Always calls the latest callback (no stale closures).
 */
const useInterval: UseInterval = (callback, delay) => {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    if (delay === null) return undefined

    const id = setInterval(() => callbackRef.current(), delay)
    return () => clearInterval(id)
  }, [delay])
}

export default useInterval
