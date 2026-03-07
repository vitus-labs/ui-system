import { Children, createElement, isValidElement } from 'react'
import type { TransitionCallbacks } from '../types'
import TransitionItem from './TransitionItem'
import type { KineticConfig } from './types'

type StaggerRendererProps = {
  config: KineticConfig
  htmlProps: Record<string, unknown>
  show: boolean
  appear?: boolean
  timeout?: number
  interval?: number
  reverseLeave?: boolean
  callbacks: Partial<TransitionCallbacks>
  children: React.ReactElement<any>[]
  forwardedRef: React.ForwardedRef<unknown>
}

const StaggerRenderer = ({
  config,
  htmlProps,
  show,
  appear,
  timeout,
  interval,
  reverseLeave,
  callbacks,
  children,
  forwardedRef,
}: StaggerRendererProps) => {
  const effectiveAppear = appear ?? config.appear ?? false
  const effectiveTimeout = timeout ?? config.timeout ?? 5000
  const effectiveInterval = interval ?? config.interval ?? 50
  const effectiveReverseLeave = reverseLeave ?? config.reverseLeave ?? false

  const childArray = Children.toArray(children).filter(
    isValidElement,
  ) as React.ReactElement<any>[]
  const count = childArray.length

  const staggeredChildren = childArray.map((child, index) => {
    const staggerIndex =
      !show && effectiveReverseLeave ? count - 1 - index : index
    const delay = staggerIndex * effectiveInterval

    return (
      <TransitionItem
        key={child.key ?? index}
        show={show}
        appear={effectiveAppear}
        timeout={effectiveTimeout + delay}
        delay={delay}
        enterStyle={config.enterStyle}
        enterToStyle={config.enterToStyle}
        enterTransition={config.enterTransition}
        leaveStyle={config.leaveStyle}
        leaveToStyle={config.leaveToStyle}
        leaveTransition={config.leaveTransition}
        onAfterLeave={
          index === (effectiveReverseLeave ? 0 : count - 1)
            ? callbacks.onAfterLeave
            : undefined
        }
      >
        {child}
      </TransitionItem>
    )
  })

  return createElement(
    config.tag,
    { ref: forwardedRef, ...htmlProps },
    ...staggeredChildren,
  )
}

export default StaggerRenderer
