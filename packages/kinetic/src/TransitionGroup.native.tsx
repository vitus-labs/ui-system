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
  const onAfterLeaveRef = useRef(onAfterLeave)
  onAfterLeaveRef.current = onAfterLeave
  const [, forceUpdate] = useState(0)

  const currentKeyed = getKeyedChildren(children)
  const currentMap = new Map<string | number, ReactElement<any>>()
  for (const { key, element } of currentKeyed) {
    currentMap.set(key, element)
  }

  if (initialKeysRef.current === null) {
    initialKeysRef.current = new Set(currentMap.keys())
  }

  for (const [key, child] of prevRef.current) {
    if (!currentMap.has(key)) {
      leavingRef.current.set(key, child)
    }
  }

  for (const key of currentMap.keys()) {
    leavingRef.current.delete(key)
  }

  prevRef.current = currentMap

  // Cache one stable callback per key. Without this, every render produces
  // fresh `onAfterLeave={() => handleAfterLeave(key)}` props which forces
  // every child <Transition> to re-render when a single leaf finishes leaving.
  // (Mirrors TransitionGroup.tsx — keep in sync.)
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

  const allEntries: KeyedChild[] = [...currentKeyed]
  for (const [key, element] of leavingRef.current) {
    allEntries.push({ key, element })
  }

  return (
    <>
      {allEntries.map(({ key, element }) => {
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
