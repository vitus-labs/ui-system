import { useCallback, useEffect, useRef } from 'react'

type DebouncedFn<T extends (...args: any[]) => any> = {
  (...args: Parameters<T>): void
  cancel: () => void
  flush: () => void
}

export type UseDebouncedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
) => DebouncedFn<T>

/**
 * Returns a stable debounced version of the callback.
 * The returned function has `.cancel()` and `.flush()` methods.
 * Always calls the latest callback (no stale closures).
 * Cleans up on unmount.
 */
const useDebouncedCallback: UseDebouncedCallback = (callback, delay) => {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastArgsRef = useRef<any[] | null>(null)

  const cancel = useCallback(() => {
    if (timerRef.current != null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    lastArgsRef.current = null
  }, [])

  const flush = useCallback(() => {
    if (timerRef.current != null && lastArgsRef.current != null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
      callbackRef.current(...lastArgsRef.current)
      lastArgsRef.current = null
    }
  }, [])

  useEffect(() => cancel, [cancel])

  const debounced = useCallback(
    (...args: any[]) => {
      lastArgsRef.current = args
      if (timerRef.current != null) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        timerRef.current = null
        callbackRef.current(...args)
        lastArgsRef.current = null
      }, delay)
    },
    [delay],
  )

  return Object.assign(debounced, { cancel, flush }) as any
}

export default useDebouncedCallback
