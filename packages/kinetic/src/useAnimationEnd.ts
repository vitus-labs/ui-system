import { useIsomorphicLayoutEffect, useLatest } from '@vitus-labs/hooks'
import { type RefObject, useRef } from 'react'
import { devWarn } from './utils'

const DEFAULT_TIMEOUT = 5000

export type UseAnimationEnd = (options: {
  ref: RefObject<HTMLElement | null>
  onEnd: () => void
  active: boolean
  timeout?: number
  /**
   * Current lifecycle phase (e.g. the transition stage). Changing it while
   * `active` stays true (entering -> leaving) restarts listeners + fallback timer.
   */
  phase?: string
}) => void

/**
 * True only when computed transition AND animation durations/delays are all
 * explicitly zero. Unknown values (jsdom reports '') are never "zero".
 */
const isZeroLength = (cs: CSSStyleDeclaration): boolean =>
  !!cs.transitionDuration &&
  !!cs.animationDuration &&
  [
    cs.transitionDuration,
    cs.transitionDelay,
    cs.animationDuration,
    cs.animationDelay,
  ]
    .join()
    .split(',')
    .every((v) => Number.parseFloat(v) === 0)

const hasRunningTransition = (el: HTMLElement | null): boolean =>
  !!el?.getAnimations?.().some((a) => 'transitionProperty' in a)

const useAnimationEnd: UseAnimationEnd = ({
  ref,
  onEnd,
  active,
  timeout = DEFAULT_TIMEOUT,
  phase,
}) => {
  const onEndRef = useLatest(onEnd)
  const calledRef = useRef(false)

  useIsomorphicLayoutEffect(() => {
    if (!active) {
      calledRef.current = false
      return
    }

    const el = ref.current
    calledRef.current = false

    const done = () => {
      if (calledRef.current) return
      calledRef.current = true
      el?.removeEventListener('transitionend', handleEnd)
      el?.removeEventListener('animationend', handleEnd)
      clearTimeout(timer)
      onEndRef.current()
    }

    const handleEnd = (e: Event) => {
      // Ignore bubbled events from children
      if (e.target !== el) return
      // Several properties transition: wait until the longest one is done.
      if (e.type === 'transitionend' && hasRunningTransition(el)) return
      done()
    }

    const timer = setTimeout(done, timeout)

    if (!el) {
      // Child didn't attach the ref: no events can be observed, so only the
      // fallback timer can complete the transition.
      devWarn('The child did not attach `ref`; completing via timeout only.')
      return () => clearTimeout(timer)
    }

    el.addEventListener('transitionend', handleEnd)
    el.addEventListener('animationend', handleEnd)

    // Nothing to wait for when styles are explicitly zero-length — complete
    // instead of idling until the timeout. Checked 3 frames in, after the
    // enter/leave "to" state has been applied (see nextFrame in utils).
    let cancelled = false
    let frames = 3
    let frame = 0
    const tick = () => {
      if (cancelled) return
      if (--frames) frame = requestAnimationFrame(tick)
      else if (isZeroLength(getComputedStyle(el))) done()
    }
    frame = requestAnimationFrame(tick)

    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      el.removeEventListener('transitionend', handleEnd)
      el.removeEventListener('animationend', handleEnd)
      clearTimeout(timer)
    }
  }, [active, timeout, phase])
}

export default useAnimationEnd
