import { useIsomorphicLayoutEffect, useLatest } from '@vitus-labs/hooks'
import {
  createElement,
  type ForwardedRef,
  type ReactNode,
  useMemo,
  useRef,
} from 'react'
import { Animated } from 'react-native'
import { buildAnimatedStyle, getPrimaryTransition } from '../nativeAnimations'
import type { TransitionCallbacks } from '../types'
import useTransitionState from '../useTransitionState'
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

const animatedComponentCache = new WeakMap<any, any>()

const getAnimatedComponent = (tag: any) => {
  let cached = animatedComponentCache.get(tag)
  if (!cached) {
    cached = Animated.createAnimatedComponent(tag)
    animatedComponentCache.set(tag, cached)
  }
  return cached
}

const TransitionRenderer = ({
  config,
  htmlProps,
  show,
  appear,
  unmount,
  timeout: _timeout,
  callbacks,
  children,
  forwardedRef,
}: TransitionRendererProps) => {
  const { stage, shouldMount, complete } = useTransitionState({
    show,
    appear: appear ?? config.appear ?? false,
  })

  const effectiveUnmount = unmount ?? config.unmount ?? true
  const callbacksRef = useLatest(callbacks)
  const progress = useRef(new Animated.Value(show ? 1 : 0)).current
  const animatingRef = useRef(false)

  const enterTransition = useMemo(
    () => getPrimaryTransition(config.enterTransition),
    [config.enterTransition],
  )
  const leaveTransition = useMemo(
    () => getPrimaryTransition(config.leaveTransition),
    [config.leaveTransition],
  )

  useIsomorphicLayoutEffect(() => {
    if (stage === 'entering') {
      callbacksRef.current.onEnter?.()
      progress.setValue(0)
      animatingRef.current = true

      Animated.timing(progress, {
        toValue: 1,
        duration: enterTransition.duration,
        easing: enterTransition.easing,
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
        duration: leaveTransition.duration,
        easing: leaveTransition.easing,
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
        config.enterStyle as any,
        config.enterToStyle as any,
      )
    }
    if (stage === 'leaving') {
      return buildAnimatedStyle(
        progress,
        config.leaveStyle as any,
        config.leaveToStyle as any,
      )
    }
    // Entered or hidden — no animation, use final styles
    if (stage === 'entered') {
      return config.enterToStyle ?? {}
    }
    return {}
  }, [stage, config, progress])

  if (!shouldMount) {
    if (effectiveUnmount) return null

    const AnimatedTag = getAnimatedComponent(config.tag)
    return createElement(
      AnimatedTag,
      {
        ref: forwardedRef,
        ...htmlProps,
        style: [htmlProps.style, { display: 'none' }],
      },
      children,
    )
  }

  const AnimatedTag = getAnimatedComponent(config.tag)
  return createElement(
    AnimatedTag,
    {
      ref: forwardedRef,
      ...htmlProps,
      style: [htmlProps.style, animatedStyle],
    },
    children,
  )
}

export default TransitionRenderer
