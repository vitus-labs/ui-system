import {
  useIsomorphicLayoutEffect,
  useLatest,
  useReducedMotion,
} from '@vitus-labs/hooks'
import { useRef, useState } from 'react'
import type { CollapseProps, TransitionStage } from './types'
import useAnimationEnd from './useAnimationEnd'

const Collapse = ({
  show,
  transition = 'height 300ms ease',
  appear = false,
  timeout = 5000,
  onEnter,
  onAfterEnter,
  onLeave,
  onAfterLeave,
  children,
}: CollapseProps) => {
  const reducedMotion = useReducedMotion()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const isInitialMount = useRef(true)
  const callbacksRef = useLatest({
    onEnter,
    onAfterEnter,
    onLeave,
    onAfterLeave,
  })

  const [stage, setStage] = useState<TransitionStage>(() => {
    if (show && !appear) return 'entered'
    return 'hidden'
  })

  // State machine transitions
  useIsomorphicLayoutEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      if (show && appear) {
        setStage('entering')
      }
      return
    }

    if (show && (stage === 'hidden' || stage === 'leaving')) {
      setStage('entering')
    } else if (!show && (stage === 'entered' || stage === 'entering')) {
      setStage('leaving')
    }
  }, [show])

  // Animate height
  useIsomorphicLayoutEffect(() => {
    const wrapper = wrapperRef.current
    const content = contentRef.current
    if (!wrapper || !content) return

    if (reducedMotion) {
      if (stage === 'entering') {
        callbacksRef.current.onEnter?.()
        wrapper.style.height = 'auto'
        wrapper.style.overflow = ''
        callbacksRef.current.onAfterEnter?.()
        setStage('entered')
      } else if (stage === 'leaving') {
        callbacksRef.current.onLeave?.()
        wrapper.style.height = '0px'
        wrapper.style.overflow = 'hidden'
        callbacksRef.current.onAfterLeave?.()
        setStage('hidden')
      }
      return
    }

    if (stage === 'entering') {
      callbacksRef.current.onEnter?.()
      const height = content.scrollHeight
      wrapper.style.transition = 'none'
      wrapper.style.height = '0px'
      wrapper.style.overflow = 'hidden'
      // Force reflow so the browser registers height: 0
      void wrapper.offsetHeight
      wrapper.style.transition = transition
      wrapper.style.height = `${height}px`
    }

    if (stage === 'leaving') {
      callbacksRef.current.onLeave?.()
      const height = content.scrollHeight
      wrapper.style.transition = 'none'
      wrapper.style.height = `${height}px`
      wrapper.style.overflow = 'hidden'
      // Force reflow
      void wrapper.offsetHeight
      wrapper.style.transition = transition
      wrapper.style.height = '0px'
    }
  }, [stage, transition, reducedMotion])

  // Listen for animation end
  useAnimationEnd({
    ref: wrapperRef,
    active: (stage === 'entering' || stage === 'leaving') && !reducedMotion,
    timeout,
    onEnd: () => {
      const wrapper = wrapperRef.current
      if (stage === 'entering') {
        if (wrapper) {
          wrapper.style.height = 'auto'
          wrapper.style.overflow = ''
          wrapper.style.transition = ''
        }
        callbacksRef.current.onAfterEnter?.()
        setStage('entered')
      } else if (stage === 'leaving') {
        callbacksRef.current.onAfterLeave?.()
        setStage('hidden')
      }
    },
  })

  const shouldRender = stage !== 'hidden'

  return (
    <div
      ref={wrapperRef}
      style={{
        overflow: stage === 'entered' ? undefined : 'hidden',
        height:
          stage === 'hidden' ? 0 : stage === 'entered' ? 'auto' : undefined,
      }}
    >
      {shouldRender && <div ref={contentRef}>{children}</div>}
    </div>
  )
}

export default Collapse
