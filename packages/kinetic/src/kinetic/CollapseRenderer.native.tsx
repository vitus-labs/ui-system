import { useIsomorphicLayoutEffect, useLatest } from '@vitus-labs/hooks'
import {
  createElement,
  type ForwardedRef,
  type ReactNode,
  useCallback,
  useRef,
  useState,
} from 'react'
import { Animated, Easing, type LayoutChangeEvent, View } from 'react-native'
import type { TransitionCallbacks, TransitionStage } from '../types'
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

const parseDuration = (transition?: string): number => {
  if (!transition) return 300
  const match = transition.match(/(\d+)\s*ms/)
  if (match?.[1]) return Number.parseInt(match[1], 10)
  const secMatch = transition.match(/([\d.]+)\s*s(?!e)/)
  if (secMatch?.[1]) return Number.parseFloat(secMatch[1]) * 1000
  return 300
}

const CollapseRenderer = ({
  config,
  htmlProps,
  show,
  appear,
  timeout: _timeout,
  transition,
  callbacks,
  children,
  forwardedRef,
}: CollapseRendererProps) => {
  const effectiveAppear = appear ?? config.appear ?? false
  const effectiveTransition =
    transition ?? config.transition ?? 'height 300ms ease'
  const duration = parseDuration(effectiveTransition)

  const callbacksRef = useLatest(callbacks)
  const heightAnim = useRef(new Animated.Value(0)).current
  const contentHeight = useRef(0)
  const animatingRef = useRef(false)
  const isInitialMount = useRef(true)

  const [stage, setStage] = useState<TransitionStage>(() => {
    if (show && !effectiveAppear) return 'entered'
    return 'hidden'
  })

  const onContentLayout = useCallback((e: LayoutChangeEvent) => {
    contentHeight.current = e.nativeEvent.layout.height
  }, [])

  // State machine transitions
  useIsomorphicLayoutEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      if (show && effectiveAppear) {
        setStage('entering')
      } else if (show) {
        // Already entered — set height to content height
        heightAnim.setValue(contentHeight.current || 1000)
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
    if (stage === 'entering') {
      callbacksRef.current.onEnter?.()
      heightAnim.setValue(0)
      animatingRef.current = true

      Animated.timing(heightAnim, {
        toValue: contentHeight.current || 1000,
        duration,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start(({ finished }) => {
        animatingRef.current = false
        if (finished) {
          callbacksRef.current.onAfterEnter?.()
          setStage('entered')
        }
      })
    }

    if (stage === 'leaving') {
      callbacksRef.current.onLeave?.()
      heightAnim.setValue(contentHeight.current || 0)
      animatingRef.current = true

      Animated.timing(heightAnim, {
        toValue: 0,
        duration,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start(({ finished }) => {
        animatingRef.current = false
        if (finished) {
          callbacksRef.current.onAfterLeave?.()
          setStage('hidden')
        }
      })
    }

    return () => {
      if (animatingRef.current) {
        heightAnim.stopAnimation()
        animatingRef.current = false
      }
    }
  }, [stage, duration])

  const shouldRender = stage !== 'hidden'

  const wrapperStyle: any =
    stage === 'entered'
      ? { overflow: 'visible' as const }
      : {
          height: heightAnim,
          overflow: 'hidden' as const,
        }

  return createElement(
    Animated.View,
    {
      ref: forwardedRef as any,
      ...htmlProps,
      style: [htmlProps.style, wrapperStyle],
    },
    shouldRender &&
      createElement(View, { onLayout: onContentLayout }, children),
  )
}

export default CollapseRenderer
