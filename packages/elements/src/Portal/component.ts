import { useState, useEffect, FC, ReactNode } from 'react'
import ReactDOM from 'react-dom'

interface Props {
  position?: HTMLElement
  children: ReactNode
  tag?: string
}

const component: FC<Props> = ({
  position = document.body,
  tag = 'div',
  children,
}: Props) => {
  const [element, setElement] = useState(null)

  useEffect(() => {
    setElement(document.createElement(tag))

    position.appendChild(element)

    return () => {
      position.removeChild(element)
    }
  }, [tag, position])

  return ReactDOM.createPortal(children, element)
}

component.displayName = 'vitus-labs/elements/Portal'

export default component
