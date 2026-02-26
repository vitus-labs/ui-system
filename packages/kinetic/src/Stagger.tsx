import { Children, cloneElement, isValidElement } from 'react'
import Transition from './Transition'
import type { StaggerProps } from './types'

const Stagger = ({
  show,
  interval = 50,
  reverseLeave = false,
  appear = false,
  timeout = 5000,
  children,
  onAfterLeave,
  ...transitionProps
}: StaggerProps) => {
  const childArray = Children.toArray(children).filter(isValidElement)
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
            {...transitionProps}
            onAfterLeave={
              index === (reverseLeave ? 0 : count - 1)
                ? onAfterLeave
                : undefined
            }
          >
            {cloneElement(child, {
              style: {
                ...(child.props as Record<string, unknown>).style,
                '--stagger-index': staggerIndex,
                '--stagger-interval': `${interval}ms`,
                transitionDelay: `${delay}ms`,
              } as React.CSSProperties,
            })}
          </Transition>
        )
      })}
    </>
  )
}

export default Stagger
