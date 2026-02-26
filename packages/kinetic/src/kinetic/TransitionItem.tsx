import {
  useIsomorphicLayoutEffect,
  useLatest,
  useMergedRef,
  useReducedMotion,
} from '@vitus-labs/hooks'
import { cloneElement, useRef } from 'react'
import type {
  ClassTransitionProps,
  StyleTransitionProps,
  TransitionCallbacks,
} from '../types'
import useAnimationEnd from '../useAnimationEnd'
import useTransitionState from '../useTransitionState'
import { addClasses, mergeStyles, nextFrame, removeClasses } from '../utils'

type TransitionItemProps = ClassTransitionProps &
  StyleTransitionProps &
  TransitionCallbacks & {
    show: boolean
    appear?: boolean
    unmount?: boolean
    timeout?: number
    children: React.ReactElement
  }

const applyEnter = (
  el: HTMLElement,
  config: ClassTransitionProps & StyleTransitionProps,
) => {
  addClasses(el, config.enter)
  addClasses(el, config.enterFrom)
  if (config.enterStyle) Object.assign(el.style, config.enterStyle)
  if (config.enterTransition) el.style.transition = config.enterTransition

  return nextFrame(() => {
    removeClasses(el, config.enterFrom)
    addClasses(el, config.enterTo)
    if (config.enterToStyle) Object.assign(el.style, config.enterToStyle)
  })
}

const applyLeave = (
  el: HTMLElement,
  config: ClassTransitionProps & StyleTransitionProps,
) => {
  removeClasses(el, config.enter)
  removeClasses(el, config.enterTo)

  addClasses(el, config.leave)
  addClasses(el, config.leaveFrom)
  if (config.leaveStyle) Object.assign(el.style, config.leaveStyle)
  if (config.leaveTransition) el.style.transition = config.leaveTransition

  return nextFrame(() => {
    removeClasses(el, config.leaveFrom)
    addClasses(el, config.leaveTo)
    if (config.leaveToStyle) Object.assign(el.style, config.leaveToStyle)
  })
}

const applyReducedMotion = (
  stage: string,
  callbacks: React.RefObject<Partial<TransitionCallbacks>>,
  complete: () => void,
) => {
  if (stage === 'entering') {
    callbacks.current.onEnter?.()
    callbacks.current.onAfterEnter?.()
    complete()
  } else if (stage === 'leaving') {
    callbacks.current.onLeave?.()
    callbacks.current.onAfterLeave?.()
    complete()
  }
}

/**
 * Internal per-child transition component. Used by StaggerRenderer and
 * GroupRenderer to give each child its own hook-based animation state.
 *
 * Uses cloneElement to inject ref onto the child — the child must accept ref.
 */
const TransitionItem = ({
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
}: TransitionItemProps) => {
  const reducedMotion = useReducedMotion()
  const {
    stage,
    ref: stateRef,
    shouldMount,
    complete,
  } = useTransitionState({ show, appear })

  const elementRef = useRef<HTMLElement>(null)
  const mergedRef = useMergedRef(
    elementRef,
    stateRef,
    (children.props as Record<string, unknown>).ref as React.Ref<HTMLElement>,
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
      applyReducedMotion(stage, callbacksRef, complete)
      return
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
          | React.CSSProperties
          | undefined,
        { display: 'none' },
      ),
    })
  }

  return cloneElement(children, { ref: mergedRef })
}

export default TransitionItem
