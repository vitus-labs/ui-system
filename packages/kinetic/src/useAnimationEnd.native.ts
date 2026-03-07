import { useIsomorphicLayoutEffect, useLatest } from '@vitus-labs/hooks'
import { useRef } from 'react'

const DEFAULT_TIMEOUT = 5000

export type UseAnimationEnd = (options: {
  ref: React.RefObject<any>
  onEnd: () => void
  active: boolean
  timeout?: number
}) => void

/**
 * React Native version of useAnimationEnd.
 * Since RN animations use Animated.timing().start(callback) for completion,
 * this hook serves only as a safety-net timeout.
 */
const useAnimationEnd: UseAnimationEnd = ({
  onEnd,
  active,
  timeout = DEFAULT_TIMEOUT,
}) => {
  const onEndRef = useLatest(onEnd)
  const calledRef = useRef(false)

  useIsomorphicLayoutEffect(() => {
    if (!active) {
      calledRef.current = false
      return
    }

    calledRef.current = false

    const timer = setTimeout(() => {
      if (calledRef.current) return
      calledRef.current = true
      onEndRef.current()
    }, timeout)

    return () => clearTimeout(timer)
  }, [active, timeout])
}

export default useAnimationEnd
