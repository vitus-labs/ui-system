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
import { applyEnter, applyLeave, applySettled, mergeStyles } from './utils'

const applyReducedMotion = (
  stage: string,
  callbacks: {
    onEnter?: () => void
    onAfterEnter?: () => void
    onLeave?: () => void
    onAfterLeave?: () => void
  },
  complete: () => void,
) => {
  if (stage === 'entering') {
    callbacks.onEnter?.()
    callbacks.onAfterEnter?.()
    complete()
  } else if (stage === 'leaving') {
    callbacks.onLeave?.()
    callbacks.onAfterLeave?.()
    complete()
  }
}

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

    if (reducedMotion) {
      return applyReducedMotion(stage, callbacksRef.current, complete)
    }

    // Built inside the effect (which fires on [stage] changes and
    // closes over fresh props) so parent re-renders don't allocate a fresh
    // ~12-key object per render — Stagger renders n of these per update.
    const transitionConfig = {
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
    }

    // `delay` is re-applied inside applyEnter/applyLeave AFTER the
    // `transition` shorthand (which would otherwise reset it to 0), and
    // cleared on 'entered' so later transitions (e.g. hover) aren't delayed.
    if (stage === 'entering') {
      callbacksRef.current.onEnter?.()
      const cancel = applyEnter(el, transitionConfig, delayRef.current)
      return cancel
    }

    if (stage === 'leaving') {
      callbacksRef.current.onLeave?.()
      const cancel = applyLeave(el, transitionConfig, delayRef.current)
      return cancel
    }

    applySettled(el, transitionConfig, stage, delayRef.current)
  }, [stage])

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
