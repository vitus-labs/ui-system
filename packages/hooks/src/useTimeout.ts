import { useCallback, useEffect, useRef } from 'react'

export type UseTimeout = (
  callback: () => void,
  delay: number | null,
) => { reset: () => void; clear: () => void }

/**
 * Declarative `setTimeout` with auto-cleanup.
 * Pass `null` as `delay` to disable. Returns `reset` and `clear` controls.
 * Always calls the latest callback (no stale closures).
 */
const useTimeout: UseTimeout = (callback, delay) => {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clear = useCallback(() => {
    if (timerRef.current != null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const reset = useCallback(() => {
    clear()
    if (delay !== null) {
      timerRef.current = setTimeout(() => {
        timerRef.current = null
        callbackRef.current()
      }, delay)
    }
  }, [delay, clear])

  useEffect(() => {
    reset()
    return clear
  }, [reset, clear])

  return { reset, clear }
}

export default useTimeout
