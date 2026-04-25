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
  const callbackCache = useRef<Map<string | number, () => void>>(new Map())
  // Capture latest user-provided onAfterLeave so cached per-key callbacks
  // can call the freshest version without being recreated.
  const onAfterLeaveRef = useRef(onAfterLeave)
  onAfterLeaveRef.current = onAfterLeave
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

  // Cache one stable callback per key. Without this, every render produces
  // fresh `onAfterLeave={() => handleAfterLeave(key)}` props which forces
  // every child <Transition> to re-render when a single leaf finishes leaving.
  const getOnAfterLeave = (key: string | number) => {
    let cb = callbackCache.current.get(key)
    if (!cb) {
      cb = () => {
        leavingRef.current.delete(key)
        callbackCache.current.delete(key)
        onAfterLeaveRef.current?.()
        forceUpdate((c) => c + 1)
      }
      callbackCache.current.set(key, cb)
    }
    return cb
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
            onAfterLeave={getOnAfterLeave(key)}
          >
            {element}
          </Transition>
        )
      })}
    </>
  )
}

export default TransitionGroup
