import { useIsomorphicLayoutEffect } from '@vitus-labs/hooks'
import { useCallback, useRef, useState } from 'react'
import type { TransitionStage, TransitionStateResult } from './types'

export type UseTransitionState = (options: {
  show: boolean
  appear?: boolean
}) => TransitionStateResult

const useTransitionState: UseTransitionState = ({ show, appear = false }) => {
  const isInitialMount = useRef(true)
  const elementRef = useRef<HTMLElement | null>(null)

  const [stage, setStage] = useState<TransitionStage>(() => {
    if (show && !appear) return 'entered'
    return 'hidden'
  })

  useIsomorphicLayoutEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      if (show && appear) {
        setStage('entering')
      }
      return
    }

    if (show && (stage === 'hidden' || stage === 'leaving')) {
      setStage('entering')
    } else if (!show && (stage === 'entered' || stage === 'entering')) {
      setStage('leaving')
    }
  }, [show])

  const complete = useCallback(() => {
    setStage((current) => {
      if (current === 'entering') return 'entered'
      if (current === 'leaving') return 'hidden'
      return current
    })
  }, [])

  return {
    stage,
    ref: elementRef,
    shouldMount: stage !== 'hidden',
    complete,
  }
}

export default useTransitionState
