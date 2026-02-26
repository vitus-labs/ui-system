import {
  useIsomorphicLayoutEffect,
  useLatest,
  useMergedRef,
  useReducedMotion,
} from '@vitus-labs/hooks'
import { createElement, useRef, useState } from 'react'
import type { TransitionCallbacks, TransitionStage } from '../types'
import useAnimationEnd from '../useAnimationEnd'
import type { KineticConfig } from './types'

type CollapseRendererProps = {
  config: KineticConfig
  htmlProps: Record<string, unknown>
  show: boolean
  appear?: boolean
  timeout?: number
  transition?: string
  callbacks: Partial<TransitionCallbacks>
  children: React.ReactNode
  forwardedRef: React.ForwardedRef<unknown>
}

/**
 * Renders a height-animated collapse. The config.tag becomes the outer
 * wrapper (overflow:hidden + animated height). An inner div measures
 * scrollHeight for the target value.
 */
const CollapseRenderer = ({
  config,
  htmlProps,
  show,
  appear,
  timeout,
  transition,
  callbacks,
  children,
  forwardedRef,
}: CollapseRendererProps) => {
  const reducedMotion = useReducedMotion()
  const wrapperRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const isInitialMount = useRef(true)
  const mergedRef = useMergedRef(wrapperRef, forwardedRef)

  const callbacksRef = useLatest(callbacks)

  const effectiveAppear = appear ?? config.appear ?? false
  const effectiveTimeout = timeout ?? config.timeout ?? 5000
  const effectiveTransition =
    transition ?? config.transition ?? 'height 300ms ease'

  const [stage, setStage] = useState<TransitionStage>(() => {
    if (show && !effectiveAppear) return 'entered'
    return 'hidden'
  })

  // State machine transitions
  useIsomorphicLayoutEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      if (show && effectiveAppear) {
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
      // Force reflow
      void wrapper.offsetHeight
      wrapper.style.transition = effectiveTransition
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
      wrapper.style.transition = effectiveTransition
      wrapper.style.height = '0px'
    }
  }, [stage, effectiveTransition, reducedMotion])

  useAnimationEnd({
    ref: wrapperRef,
    active: (stage === 'entering' || stage === 'leaving') && !reducedMotion,
    timeout: effectiveTimeout,
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

  const wrapperStyle: React.CSSProperties = {
    ...((htmlProps.style as React.CSSProperties) ?? {}),
    overflow: stage === 'entered' ? undefined : 'hidden',
    height: stage === 'hidden' ? 0 : stage === 'entered' ? 'auto' : undefined,
  }

  return createElement(
    config.tag,
    { ref: mergedRef, ...htmlProps, style: wrapperStyle },
    shouldRender && <div ref={contentRef}>{children}</div>,
  )
}

export default CollapseRenderer
