import {
  useIsomorphicLayoutEffect,
  useLatest,
  useMergedRef,
  useReducedMotion,
} from '@vitus-labs/hooks'
import {
  type CSSProperties,
  createElement,
  type ForwardedRef,
  type ReactNode,
  useRef,
  useState,
} from 'react'
import type { TransitionCallbacks, TransitionStage } from '../types'
import useAnimationEnd from '../useAnimationEnd'
import { runCollapse } from '../utils'
import type { KineticConfig } from './types'

type CollapseRendererProps = {
  config: KineticConfig
  htmlProps: Record<string, unknown>
  show: boolean
  appear?: boolean
  timeout?: number
  transition?: string
  callbacks: Partial<TransitionCallbacks>
  children: ReactNode
  forwardedRef: ForwardedRef<unknown>
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
        effectiveTransition,
        callbacksRef.current,
        reducedMotion,
        setStage,
      )
  }, [stage, effectiveTransition, reducedMotion])

  useAnimationEnd({
    ref: wrapperRef,
    active: (stage === 'entering' || stage === 'leaving') && !reducedMotion,
    timeout: effectiveTimeout,
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
    stage !== 'hidden' || (isInitialMount.current && show && effectiveAppear)

  const wrapperStyle: CSSProperties = {
    ...((htmlProps.style as CSSProperties) ?? {}),
    overflow: stage === 'entered' ? undefined : 'hidden',
    height: stage === 'hidden' ? 0 : stage === 'entered' ? 'auto' : undefined,
  }

  return createElement(
    config.tag,
    { ref: mergedRef, ...htmlProps, style: wrapperStyle },
    shouldRender && (
      <div ref={contentRef} style={{ display: 'flow-root' }}>
        {children}
      </div>
    ),
  )
}

export default CollapseRenderer
