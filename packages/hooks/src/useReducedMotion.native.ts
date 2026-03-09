import { useEffect, useState } from 'react'
import { AccessibilityInfo } from 'react-native'

export type UseReducedMotion = () => boolean

/**
 * Returns `true` when the user prefers reduced motion.
 * Uses React Native's `AccessibilityInfo.isReduceMotionEnabled()`.
 */
const useReducedMotion: UseReducedMotion = () => {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduced)

    const sub = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduced,
    )

    return () => sub.remove()
  }, [])

  return reduced
}

export default useReducedMotion
