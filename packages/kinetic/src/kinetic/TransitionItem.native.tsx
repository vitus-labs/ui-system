import { useIsomorphicLayoutEffect, useLatest } from '@vitus-labs/hooks'
import { cloneElement, useMemo, useRef } from 'react'
import { Animated } from 'react-native'
import { buildAnimatedStyle, getPrimaryTransition } from '../nativeAnimations'
import type {
  ClassTransitionProps,
  StyleTransitionProps,
  TransitionCallbacks,
} from '../types'
import useTransitionState from '../useTransitionState'

type TransitionItemProps = ClassTransitionProps &
  StyleTransitionProps &
  TransitionCallbacks & {
    show: boolean
    appear?: boolean
    unmount?: boolean
    timeout?: number
    delay?: number
    children: React.ReactElement<any>
  }

/**
 * Native per-child transition component. Used by StaggerRenderer and
 * GroupRenderer. Wraps the child in an Animated.View with animated styles.
 */
const TransitionItem = ({
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
}: TransitionItemProps) => {
  const { stage, shouldMount, complete } = useTransitionState({
    show,
    appear,
  })

  const callbacksRef = useLatest({
    onEnter,
    onAfterEnter,
    onLeave,
    onAfterLeave,
  })

  const progress = useRef(new Animated.Value(show ? 1 : 0)).current
  const animatingRef = useRef(false)

  const enterConfig = useMemo(
    () => getPrimaryTransition(enterTransition),
    [enterTransition],
  )
  const leaveConfig = useMemo(
    () => getPrimaryTransition(leaveTransition),
    [leaveTransition],
  )

  useIsomorphicLayoutEffect(() => {
    if (stage === 'entering') {
      callbacksRef.current.onEnter?.()
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
  }, [stage])

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
    if (stage === 'entered') {
      return enterToStyle ?? {}
    }
    return {}
  }, [stage, enterStyle, enterToStyle, leaveStyle, leaveToStyle, progress])

  if (!shouldMount) {
    if (unmount) return null
    return cloneElement(children, {
      style: [children.props.style, { display: 'none' }],
    })
  }

  return <Animated.View style={animatedStyle as any}>{children}</Animated.View>
}

export default TransitionItem
