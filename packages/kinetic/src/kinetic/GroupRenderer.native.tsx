import type { ReactElement } from 'react'
import {
  Children,
  createElement,
  isValidElement,
  useRef,
  useState,
} from 'react'
import type { TransitionCallbacks } from '../types'
import TransitionItem from './TransitionItem'
import type { KineticConfig } from './types'

type GroupRendererProps = {
  config: KineticConfig
  htmlProps: Record<string, unknown>
  appear?: boolean
  timeout?: number
  callbacks: Partial<TransitionCallbacks>
  children: ReactElement<any>[]
  forwardedRef: React.ForwardedRef<unknown>
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

const GroupRenderer = ({
  config,
  htmlProps,
  appear,
  timeout,
  callbacks,
  children,
  forwardedRef,
}: GroupRendererProps) => {
  const effectiveAppear = appear ?? config.appear ?? false
  const effectiveTimeout = timeout ?? config.timeout ?? 5000

  const prevRef = useRef<Map<string | number, ReactElement<any>>>(new Map())
  const leavingRef = useRef<Map<string | number, ReactElement<any>>>(new Map())
  const initialKeysRef = useRef<Set<string | number> | null>(null)
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

  const handleAfterLeave = (key: string | number) => {
    leavingRef.current.delete(key)
    callbacks.onAfterLeave?.()
    forceUpdate((c) => c + 1)
  }

  const allEntries: KeyedChild[] = [...currentKeyed]
  for (const [key, element] of leavingRef.current) {
    allEntries.push({ key, element })
  }

  const groupedChildren = allEntries.map(({ key, element }) => {
    const isInitial = initialKeysRef.current?.has(key) ?? false

    return (
      <TransitionItem
        key={key}
        show={currentMap.has(key)}
        appear={isInitial ? effectiveAppear : true}
        timeout={effectiveTimeout}
        enterStyle={config.enterStyle}
        enterToStyle={config.enterToStyle}
        enterTransition={config.enterTransition}
        leaveStyle={config.leaveStyle}
        leaveToStyle={config.leaveToStyle}
        leaveTransition={config.leaveTransition}
        onAfterLeave={() => handleAfterLeave(key)}
      >
        {element}
      </TransitionItem>
    )
  })

  return createElement(
    config.tag,
    { ref: forwardedRef, ...htmlProps },
    ...groupedChildren,
  )
}

export default GroupRenderer
