import { useIsomorphicLayoutEffect, useLatest } from '@vitus-labs/hooks'
import { type RefObject, useRef } from 'react'

const DEFAULT_TIMEOUT = 5000

export type UseAnimationEnd = (options: {
  ref: RefObject<HTMLElement | null>
  onEnd: () => void
  active: boolean
  timeout?: number
}) => void

const useAnimationEnd: UseAnimationEnd = ({
  ref,
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

    const el = ref.current
    if (!el) return

    calledRef.current = false

    const done = () => {
      if (calledRef.current) return
      calledRef.current = true
      el.removeEventListener('transitionend', handleEnd)
      el.removeEventListener('animationend', handleEnd)
      clearTimeout(timer)
      onEndRef.current()
    }

    const handleEnd = (e: Event) => {
      // Ignore bubbled events from children
      if (e.target !== el) return
      done()
    }

    el.addEventListener('transitionend', handleEnd)
    el.addEventListener('animationend', handleEnd)

    const timer = setTimeout(done, timeout)

    return () => {
      el.removeEventListener('transitionend', handleEnd)
      el.removeEventListener('animationend', handleEnd)
      clearTimeout(timer)
    }
  }, [active, timeout])
}

export default useAnimationEnd
