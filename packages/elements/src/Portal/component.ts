import { useState, useEffect, FC, ReactNode } from 'react'
import ReactDOM from 'react-dom'

export type Props = {
  position?: HTMLElement
  children: ReactNode
  tag?: string
}

const component: FC<Props> = ({
  position = document.body,
  tag = 'div',
  children,
}: Props) => {
  const [element] = useState(
    __BROWSER__ ? document.createElement(tag) : undefined
  )

  useEffect(() => {
    if (__SERVER__) return undefined

    position.appendChild(element)

    return () => {
      position.removeChild(element)
    }
  }, [tag, position])

  return ReactDOM.createPortal(children, element)
}

component.displayName = 'vitus-labs/elements/Portal'

export default component
