import { throttle } from '@vitus-labs/core'
import { useEffect, useMemo, useRef } from 'react'

type ThrottledFn<T extends (...args: any[]) => any> = {
  (...args: Parameters<T>): void
  cancel: () => void
}

export type UseThrottledCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
) => ThrottledFn<T>

/**
 * Returns a stable throttled version of the callback.
 * Uses `throttle` from `@vitus-labs/core`.
 * Always calls the latest callback (no stale closures).
 * Cleans up on unmount.
 */
const useThrottledCallback: UseThrottledCallback = (callback, delay) => {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  const throttled = useMemo(
    () => throttle((...args: any[]) => callbackRef.current(...args), delay),
    [delay],
  )

  useEffect(() => () => throttled.cancel(), [throttled])

  return throttled as any
}

export default useThrottledCallback
