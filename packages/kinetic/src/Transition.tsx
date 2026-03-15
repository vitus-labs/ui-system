import {
  useIsomorphicLayoutEffect,
  useLatest,
  useMergedRef,
  useReducedMotion,
} from '@vitus-labs/hooks'
import { type CSSProperties, cloneElement, type Ref, useRef } from 'react'
import type {
  ClassTransitionProps,
  StyleTransitionProps,
  TransitionProps,
} from './types'
import useAnimationEnd from './useAnimationEnd'
import useTransitionState from './useTransitionState'
import { addClasses, mergeStyles, nextFrame, removeClasses } from './utils'

const applyEnter = (
  el: HTMLElement,
  {
    enter,
    enterFrom,
    enterTo,
    enterStyle,
    enterToStyle,
    enterTransition,
  }: ClassTransitionProps & StyleTransitionProps,
) => {
  addClasses(el, enter)
  addClasses(el, enterFrom)
  if (enterStyle) Object.assign(el.style, enterStyle)
  if (enterTransition) el.style.transition = enterTransition

  return nextFrame(() => {
    removeClasses(el, enterFrom)
    addClasses(el, enterTo)
    if (enterToStyle) Object.assign(el.style, enterToStyle)
  })
}

const applyLeave = (
  el: HTMLElement,
  {
    enter,
    enterTo,
    leave,
    leaveFrom,
    leaveTo,
    leaveStyle,
    leaveToStyle,
    leaveTransition,
  }: ClassTransitionProps & StyleTransitionProps,
) => {
  removeClasses(el, enter)
  removeClasses(el, enterTo)

  addClasses(el, leave)
  addClasses(el, leaveFrom)
  if (leaveStyle) Object.assign(el.style, leaveStyle)
  if (leaveTransition) el.style.transition = leaveTransition

  return nextFrame(() => {
    removeClasses(el, leaveFrom)
    addClasses(el, leaveTo)
    if (leaveToStyle) Object.assign(el.style, leaveToStyle)
  })
}

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

  useAnimationEnd({
    ref: elementRef,
    active: (stage === 'entering' || stage === 'leaving') && !reducedMotion,
    timeout,
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
      const frameId = applyEnter(el, transitionConfig)
      return () => cancelAnimationFrame(frameId)
    }

    if (stage === 'leaving') {
      callbacksRef.current.onLeave?.()
      const frameId = applyLeave(el, transitionConfig)
      return () => cancelAnimationFrame(frameId)
    }

    if (stage === 'entered') {
      removeClasses(el, enter)
      el.style.transition = ''
    }
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
