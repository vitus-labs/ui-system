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
} from 'react'
import type { TransitionCallbacks } from '../types'
import useAnimationEnd from '../useAnimationEnd'
import useTransitionState from '../useTransitionState'
import { applyEnter, applyLeave, applySettled } from '../utils'
import type { KineticConfig } from './types'

type TransitionRendererProps = {
  config: KineticConfig
  htmlProps: Record<string, unknown>
  show: boolean
  appear?: boolean
  unmount?: boolean
  timeout?: number
  callbacks: Partial<TransitionCallbacks>
  children: ReactNode
  forwardedRef: ForwardedRef<unknown>
}

const applyReducedMotion = (
  stage: string,
  cbs: Partial<TransitionCallbacks>,
  complete: () => void,
) => {
  if (stage === 'entering') {
    cbs.onEnter?.()
    cbs.onAfterEnter?.()
    complete()
  } else if (stage === 'leaving') {
    cbs.onLeave?.()
    cbs.onAfterLeave?.()
    complete()
  }
}

/**
 * Renders a single element with CSS transition enter/exit animation.
 * Uses createElement(config.tag) — no cloneElement needed.
 */
const TransitionRenderer = ({
  config,
  htmlProps,
  show,
  appear,
  unmount,
  timeout,
  callbacks,
  children,
  forwardedRef,
}: TransitionRendererProps) => {
  const reducedMotion = useReducedMotion()
  const {
    stage,
    ref: stateRef,
    shouldMount,
    complete,
  } = useTransitionState({
    show,
    appear: appear ?? config.appear ?? false,
  })

  const elementRef = useRef<HTMLElement>(null)
  const mergedRef = useMergedRef(elementRef, stateRef, forwardedRef)

  const callbacksRef = useLatest(callbacks)

  const effectiveUnmount = unmount ?? config.unmount ?? true
  const effectiveTimeout = timeout ?? config.timeout ?? 5000

  useAnimationEnd({
    ref: elementRef,
    active: (stage === 'entering' || stage === 'leaving') && !reducedMotion,
    timeout: effectiveTimeout,
    phase: stage,
    onEnd: () => {
      if (stage === 'entering') {
        callbacksRef.current.onAfterEnter?.()
      } else if (stage === 'leaving') {
        callbacksRef.current.onAfterLeave?.()
      }
      complete()
    },
  })

  useIsomorphicLayoutEffect(() => {
    const el = elementRef.current
    if (!el) return

    if (reducedMotion) {
      return applyReducedMotion(stage, callbacksRef.current, complete)
    }

    if (stage === 'entering') {
      callbacksRef.current.onEnter?.()
      const cancel = applyEnter(el, config)
      return cancel
    }

    if (stage === 'leaving') {
      callbacksRef.current.onLeave?.()
      const cancel = applyLeave(el, config)
      return cancel
    }

    applySettled(el, config, stage)
  }, [stage])

  if (!shouldMount) {
    if (effectiveUnmount) return null

    return createElement(
      config.tag,
      {
        ref: mergedRef,
        ...htmlProps,
        style: {
          ...((htmlProps.style as CSSProperties) ?? {}),
          display: 'none',
        },
      },
      children,
    )
  }

  return createElement(config.tag, { ref: mergedRef, ...htmlProps }, children)
}

export default TransitionRenderer
