import { useEffect, useState, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { PKG_NAME } from '~/constants'
import type { VLComponent } from '~/types'

export type Props = {
  DOMLocation?: HTMLElement
  children: ReactNode
  tag?: string
}

const Component: VLComponent<Props> = ({
  DOMLocation,
  tag = 'div',
  children,
}: Props) => {
  const [element, setElement] = useState<HTMLElement>()

  useEffect(() => {
    if (!tag) return undefined

    const position = DOMLocation || document.body
    const element = document.createElement(tag)
    setElement(element)

    position.appendChild(element)

    return () => {
      position.removeChild(element)
    }
  }, [tag, DOMLocation])

  if (!tag || !element) return null

  return createPortal(children, element)
}

const name = `${PKG_NAME}/Portal` as const

Component.displayName = name
Component.pkgName = PKG_NAME
Component.VITUS_LABS__COMPONENT = name

export default Component
