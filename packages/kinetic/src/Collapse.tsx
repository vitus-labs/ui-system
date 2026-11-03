import {
  useIsomorphicLayoutEffect,
  useLatest,
  useReducedMotion,
} from '@vitus-labs/hooks'
import { useRef, useState } from 'react'
import type { CollapseProps, TransitionStage } from './types'
import useAnimationEnd from './useAnimationEnd'
import { runCollapse } from './utils'

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
  const prevRef = useRef(stage)
  useIsomorphicLayoutEffect(() => {
    const prev = prevRef.current
    prevRef.current = stage
    const wrapper = wrapperRef.current
    const content = contentRef.current
    if (wrapper && content)
      runCollapse(
        wrapper,
        content,
        stage,
        prev,
        transition,
        callbacksRef.current,
        reducedMotion,
        setStage,
      )
  }, [stage, transition, reducedMotion])

  // Listen for animation end
  useAnimationEnd({
    ref: wrapperRef,
    active: (stage === 'entering' || stage === 'leaving') && !reducedMotion,
    timeout,
    phase: stage,
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

  // First render of `show && appear` (incl. SSR): content at height 0
  const shouldRender =
    stage !== 'hidden' || (isInitialMount.current && show && appear)

  return (
    <div
      ref={wrapperRef}
      style={{
        overflow: stage === 'entered' ? undefined : 'hidden',
        height:
          stage === 'hidden' ? 0 : stage === 'entered' ? 'auto' : undefined,
      }}
    >
      {shouldRender && (
        <div ref={contentRef} style={{ display: 'flow-root' }}>
          {children}
        </div>
      )}
    </div>
  )
}

export default Collapse
