import { useIsomorphicLayoutEffect, useLatest } from '@vitus-labs/hooks'
import { useCallback, useRef, useState } from 'react'
import { Animated, Easing, type LayoutChangeEvent, View } from 'react-native'
import type { CollapseProps, TransitionStage } from './types'

const parseDuration = (transition?: string): number => {
  if (!transition) return 300
  const match = transition.match(/(\d+)\s*ms/)
  if (match) return Number.parseInt(match[1], 10)
  const secMatch = transition.match(/([\d.]+)\s*s(?!e)/)
  if (secMatch) return Number.parseFloat(secMatch[1]) * 1000
  return 300
}

const Collapse = ({
  show,
  transition = 'height 300ms ease',
  appear = false,
  timeout: _timeout,
  onEnter,
  onAfterEnter,
  onLeave,
  onAfterLeave,
  children,
}: CollapseProps) => {
  const duration = parseDuration(transition)
  const callbacksRef = useLatest({
    onEnter,
    onAfterEnter,
    onLeave,
    onAfterLeave,
  })

  const heightAnim = useRef(new Animated.Value(0)).current
  const contentHeight = useRef(0)
  const measured = useRef(false)
  const animatingRef = useRef(false)
  const isInitialMount = useRef(true)
  const pendingStage = useRef<TransitionStage | null>(null)

  const [stage, setStage] = useState<TransitionStage>(() => {
    if (show && !appear) return 'entered'
    return 'hidden'
  })

  const onContentLayout = useCallback((e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height
    if (contentHeight.current === h && measured.current) return
    contentHeight.current = h
    measured.current = true

    // If an animation was deferred waiting for measurement, kick it off now
    if (pendingStage.current) {
      const pending = pendingStage.current
      pendingStage.current = null
      setStage(pending)
    }
  }, [])

  useIsomorphicLayoutEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      if (show && appear) {
        setStage('entering')
      } else if (show) {
        heightAnim.setValue(contentHeight.current)
      }
      return
    }

    if (show && (stage === 'hidden' || stage === 'leaving')) {
      setStage('entering')
    } else if (!show && (stage === 'entered' || stage === 'entering')) {
      setStage('leaving')
    }
  }, [show])

  useIsomorphicLayoutEffect(() => {
    if (stage === 'entering') {
      if (!measured.current) {
        pendingStage.current = 'entering'
        return
      }
      callbacksRef.current.onEnter?.()
      heightAnim.setValue(0)
      animatingRef.current = true

      Animated.timing(heightAnim, {
        toValue: contentHeight.current,
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
      : { height: heightAnim, overflow: 'hidden' as const }

  return (
    <Animated.View style={wrapperStyle}>
      {shouldRender && <View onLayout={onContentLayout}>{children}</View>}
    </Animated.View>
  )
}

export default Collapse
