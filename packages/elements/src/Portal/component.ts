import { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'

interface Props {
  children: React.ReactNode
  tag?: string
}

const component = ({ tag = 'div', children }: Props) => {
  const [element] = useState(document.createElement(tag))

  useEffect(() => {
    document.body.appendChild(element)

    return () => {
      document.body.removeChild(element)
    }
  }, [])

  return ReactDOM.createPortal(children, element)
}

component.displayName = 'vitus-labs/elements/Portal'

export default component
