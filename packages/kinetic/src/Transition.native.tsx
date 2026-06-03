import {
  useIsomorphicLayoutEffect,
  useLatest,
  useReducedMotion,
} from '@vitus-labs/hooks'
import { cloneElement, useMemo, useRef } from 'react'
import { Animated } from 'react-native'
import { buildAnimatedStyle, getPrimaryTransition } from './nativeAnimations'
import type { TransitionProps } from './types'
import useTransitionState from './useTransitionState'

const Transition = ({
  show,
  appear = false,
  unmount = true,
  timeout: _timeout,
  delay = 0,
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
  const { stage, shouldMount, complete } = useTransitionState({
    show,
    appear,
  })

  // Honor the OS-level Reduce Motion preference: when on, skip the
  // animation and snap to the final state — synchronously firing
  // onEnter+onAfterEnter / onLeave+onAfterLeave so consumer state machines
  // still progress. Web Transition relies on CSS `prefers-reduced-motion`;
  // native needs an explicit check since RN style animations don't honor
  // the OS setting automatically.
  const reduced = useReducedMotion()

  const callbacksRef = useLatest({
    onEnter,
    onAfterEnter,
    onLeave,
    onAfterLeave,
  })

  const progress = useRef(new Animated.Value(show ? 1 : 0)).current
  const animatingRef = useRef(false)

  const enterConfig = getPrimaryTransition(enterTransition)
  const leaveConfig = getPrimaryTransition(leaveTransition)

  useIsomorphicLayoutEffect(() => {
    if (stage === 'entering') {
      callbacksRef.current.onEnter?.()
      if (reduced) {
        progress.setValue(1)
        callbacksRef.current.onAfterEnter?.()
        complete()
        return undefined
      }
      progress.setValue(0)
      animatingRef.current = true

      Animated.timing(progress, {
        toValue: 1,
        duration: enterConfig.duration,
        easing: enterConfig.easing,
        delay,
        useNativeDriver: true,
      }).start(({ finished }) => {
        animatingRef.current = false
        if (finished) {
          callbacksRef.current.onAfterEnter?.()
          complete()
        }
      })
    }

    if (stage === 'leaving') {
      callbacksRef.current.onLeave?.()
      if (reduced) {
        progress.setValue(1)
        callbacksRef.current.onAfterLeave?.()
        complete()
        return undefined
      }
      progress.setValue(0)
      animatingRef.current = true

      Animated.timing(progress, {
        toValue: 1,
        duration: leaveConfig.duration,
        easing: leaveConfig.easing,
        delay,
        useNativeDriver: true,
      }).start(({ finished }) => {
        animatingRef.current = false
        if (finished) {
          callbacksRef.current.onAfterLeave?.()
          complete()
        }
      })
    }

    return () => {
      if (animatingRef.current) {
        progress.stopAnimation()
        animatingRef.current = false
      }
    }
  }, [stage, reduced, delay])

  const animatedStyle = useMemo(() => {
    if (stage === 'entering') {
      return buildAnimatedStyle(
        progress,
        enterStyle as any,
        enterToStyle as any,
      )
    }
    if (stage === 'leaving') {
      return buildAnimatedStyle(
        progress,
        leaveStyle as any,
        leaveToStyle as any,
      )
    }
    if (stage === 'entered') return enterToStyle ?? {}
    return {}
  }, [stage, enterStyle, enterToStyle, leaveStyle, leaveToStyle, progress])

  if (!shouldMount) {
    if (unmount) return null
    return cloneElement(children, {
      style: [children.props.style, { display: 'none' }],
    })
  }

  return (
    <Animated.View style={animatedStyle as any}>
      {cloneElement(children)}
    </Animated.View>
  )
}

export default Transition
