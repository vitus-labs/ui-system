import { Children, isValidElement } from 'react'
import Transition from './Transition'
import type { StaggerProps } from './types'

const Stagger = ({
  show,
  interval = 50,
  reverseLeave = false,
  appear = false,
  timeout,
  children,
  onAfterLeave,
  ...transitionProps
}: StaggerProps) => {
  const childArray = Children.toArray(children).filter(
    isValidElement,
  ) as React.ReactElement<any>[]
  const count = childArray.length

  return (
    <>
      {childArray.map((child, index) => {
        const staggerIndex = !show && reverseLeave ? count - 1 - index : index
        const _delay = staggerIndex * interval

        return (
          <Transition
            key={child.key ?? index}
            show={show}
            appear={appear}
            timeout={timeout}
            {...transitionProps}
            onAfterLeave={
              index === (reverseLeave ? 0 : count - 1)
                ? onAfterLeave
                : undefined
            }
          >
            {child}
          </Transition>
        )
      })}
    </>
  )
}

export default Stagger
