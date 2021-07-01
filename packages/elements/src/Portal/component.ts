import { useState, useEffect, FC, ReactNode } from 'react'
import ReactDOM from 'react-dom'
import { PKG_NAME } from '~/constants'

export type Props = {
  position?: HTMLElement
  children: ReactNode
  tag?: string
}

const Component: FC<Props> = ({
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

const name = `${PKG_NAME}/Portal`

Component.displayName = name
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
Component.pkgName = PKG_NAME
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
Component.VITUS_LABS__COMPONENT = name

export default Component
