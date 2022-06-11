import { useState, useEffect, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { PKG_NAME } from '~/constants'
import type { VLComponent } from '~/types'

export type Props = {
  position?: HTMLElement
  children: ReactNode
  tag?: string
}

const Component: VLComponent<Props> = ({
  position = __BROWSER__ ? document.body : undefined,
  tag = 'div',
  children,
}: Props) => {
  const [element] = useState(
    __BROWSER__ ? document.createElement(tag) : undefined
  )

  useEffect(() => {
    if (__SERVER__ || !position || !element) return undefined

    position.appendChild(element)

    return () => {
      position.removeChild(element)
    }
  }, [element, position])

  if (!position || !element) return null

  return createPortal(children, element)
}

const name = `${PKG_NAME}/Portal` as const

Component.displayName = name
Component.pkgName = PKG_NAME
Component.VITUS_LABS__COMPONENT = name

export default Component
