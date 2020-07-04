import { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'

interface Props {
  position?: HTMLElement
  children: React.ReactNode
  tag?: string
}

const component = ({
  position = document.body,
  tag = 'div',
  children,
}: Props) => {
  const [element] = useState(document.createElement(tag))

  useEffect(() => {
    position.appendChild(element)

    return () => {
      position.removeChild(element)
    }
  }, [])

  return ReactDOM.createPortal(children, element)
}

component.displayName = 'vitus-labs/elements/Portal'

export default component
