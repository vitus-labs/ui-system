import type { ReactElement } from 'react'
import { Children, isValidElement, useRef, useState } from 'react'
import Transition from './Transition'
import type {
  ClassTransitionProps,
  StyleTransitionProps,
  TransitionCallbacks,
} from './types'

export type TransitionGroupProps = ClassTransitionProps &
  StyleTransitionProps &
  TransitionCallbacks & {
    appear?: boolean
    timeout?: number
    children: ReactElement<any>[]
  }

type KeyedChild = { key: string | number; element: ReactElement<any> }

const getKeyedChildren = (children: ReactElement<any>[]): KeyedChild[] => {
  const result: KeyedChild[] = []
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.key != null) {
      result.push({ key: child.key, element: child })
    }
  })
  return result
}

const TransitionGroup = ({
  children,
  appear = false,
  timeout,
  onAfterLeave,
  ...transitionProps
}: TransitionGroupProps) => {
  const prevRef = useRef<Map<string | number, ReactElement<any>>>(new Map())
  const leavingRef = useRef<Map<string | number, ReactElement<any>>>(new Map())
  const initialKeysRef = useRef<Set<string | number> | null>(null)
  const [, forceUpdate] = useState(0)

  // Build current keyed children map
  const currentKeyed = getKeyedChildren(children)
  const currentMap = new Map<string | number, ReactElement<any>>()
  for (const { key, element } of currentKeyed) {
    currentMap.set(key, element)
  }

  // Track initial keys to know which children were present on first render
  if (initialKeysRef.current === null) {
    initialKeysRef.current = new Set(currentMap.keys())
  }

  // Detect leaving children (were in prev but not in current)
  for (const [key, child] of prevRef.current) {
    if (!currentMap.has(key)) {
      leavingRef.current.set(key, child)
    }
  }

  // If a leaving child reappears, stop leaving
  for (const key of currentMap.keys()) {
    leavingRef.current.delete(key)
  }

  prevRef.current = currentMap

  const handleAfterLeave = (key: string | number) => {
    leavingRef.current.delete(key)
    onAfterLeave?.()
    forceUpdate((c) => c + 1)
  }

  // Merge current + leaving, preserving insertion order
  const allEntries: KeyedChild[] = [...currentKeyed]

  for (const [key, element] of leavingRef.current) {
    allEntries.push({ key, element })
  }

  return (
    <>
      {allEntries.map(({ key, element }) => {
        // New children (not in initial render) must appear with animation
        const isInitial = initialKeysRef.current?.has(key) ?? false

        return (
          <Transition
            key={key}
            show={currentMap.has(key)}
            appear={isInitial ? appear : true}
            timeout={timeout}
            {...transitionProps}
            onAfterLeave={() => handleAfterLeave(key)}
          >
            {element}
          </Transition>
        )
      })}
    </>
  )
}

export default TransitionGroup
