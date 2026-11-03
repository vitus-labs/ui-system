import {
  Children,
  type CSSProperties,
  cloneElement,
  isValidElement,
  type ReactElement,
} from 'react'
import Transition from './Transition'
import type { StaggerProps } from './types'
import { useLeaveTracker } from './utils'

const Stagger = ({
  show,
  interval = 50,
  reverseLeave = false,
  appear = false,
  timeout = 5000,
  children,
  onAfterEnter,
  onAfterLeave,
  ...transitionProps
}: StaggerProps) => {
  const track = useLeaveTracker(show)
  const childArray = Children.toArray(children).filter(
    isValidElement,
  ) as ReactElement<any>[]
  const count = childArray.length

  return (
    <>
      {childArray.map((child, index) => {
        const staggerIndex = !show && reverseLeave ? count - 1 - index : index
        const delay = staggerIndex * interval

        return (
          <Transition
            key={child.key ?? index}
            show={show}
            appear={appear}
            timeout={timeout + delay}
            delay={delay}
            {...transitionProps}
            onAfterEnter={index === count - 1 ? onAfterEnter : undefined}
            {...track(child.key ?? index, {
              onLeave: transitionProps.onLeave,
              onAfterLeave,
            })}
          >
            {cloneElement(child, {
              style: {
                ...child.props.style,
                '--stagger-index': staggerIndex,
                '--stagger-interval': `${interval}ms`,
              } as CSSProperties,
            })}
          </Transition>
        )
      })}
    </>
  )
}

export default Stagger
