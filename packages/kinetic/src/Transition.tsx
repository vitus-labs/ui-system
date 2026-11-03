import {
  useIsomorphicLayoutEffect,
  useLatest,
  useMergedRef,
  useReducedMotion,
} from '@vitus-labs/hooks'
import { type CSSProperties, cloneElement, type Ref, useRef } from 'react'
import type { TransitionProps } from './types'
import useAnimationEnd from './useAnimationEnd'
import useTransitionState from './useTransitionState'
import { appearProps, mergeStyles, runStage } from './utils'

const Transition = ({
  show,
  appear = false,
  unmount = true,
  timeout = 5000,
  enter,
  enterFrom,
  enterTo,
  leave,
  leaveFrom,
  leaveTo,
  enterStyle,
  enterToStyle,
  enterTransition,
  leaveStyle,
  leaveToStyle,
  leaveTransition,
  delay,
  onEnter,
  onAfterEnter,
  onLeave,
  onAfterLeave,
  children,
}: TransitionProps) => {
  const reducedMotion = useReducedMotion()
  const {
    stage,
    ref: stateRef,
    shouldMount,
    appearing,
    complete,
  } = useTransitionState({
    show,
    appear,
  })

  const elementRef = useRef<HTMLElement>(null)
  const mergedRef = useMergedRef(
    elementRef,
    stateRef,
    (children.props as Record<string, unknown>).ref as Ref<HTMLElement>,
  )

  const callbacksRef = useLatest({
    onEnter,
    onAfterEnter,
    onLeave,
    onAfterLeave,
  })

  useAnimationEnd({
    ref: elementRef,
    active: (stage === 'entering' || stage === 'leaving') && !reducedMotion,
    timeout,
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

  // Ref: a delay change (Stagger sibling removed) must not restart a phase
  const delayRef = useRef(delay)
  delayRef.current = delay

  useIsomorphicLayoutEffect(() => {
    const el = elementRef.current
    if (!el) return
    // Config built here (not per render): Stagger renders n of these.
    return runStage(
      el,
      stage,
      {
        enter,
        enterFrom,
        enterTo,
        leave,
        leaveFrom,
        leaveTo,
        enterStyle,
        enterToStyle,
        enterTransition,
        leaveStyle,
        leaveToStyle,
        leaveTransition,
      },
      callbacksRef.current,
      complete,
      reducedMotion,
      delayRef.current,
    )
  }, [stage, reducedMotion])

  if (appearing)
    return cloneElement(children, {
      ref: mergedRef,
      ...appearProps(children.props, { enter, enterFrom, enterStyle }),
    })

  if (!shouldMount) {
    if (unmount) return null

    return cloneElement(children, {
      ref: mergedRef,
      style: mergeStyles(
        (children.props as Record<string, unknown>).style as
          | CSSProperties
          | undefined,
        { display: 'none' },
      ),
    })
  }

  return cloneElement(children, { ref: mergedRef })
}

export default Transition
