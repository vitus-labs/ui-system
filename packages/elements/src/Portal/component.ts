import { useState, useEffect, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { PKG_NAME } from '~/constants'
import type { VLComponent } from '~/types'

export type Props = {
  position?: HTMLElement
  children: ReactNode
  tag?: string
}

const component: VLComponent<Props> = ({
  position = __BROWSER__ ? document.body : undefined,
  tag = 'div',
  children,
}: Props) => {
  const [element] = useState(
    __BROWSER__ ? document.createElement(tag) : undefined
  )

  if (!position || !element) return null

  useEffect(() => {
    if (__SERVER__) return undefined
    position.appendChild(element)

    return () => {
      position.removeChild(element)
    }
  }, [])

  return createPortal(children, element)
}

const name = `${PKG_NAME}/Portal` as const

component.displayName = name
component.pkgName = PKG_NAME
component.VITUS_LABS__COMPONENT = name

export default component
