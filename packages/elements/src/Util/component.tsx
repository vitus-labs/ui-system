import { ReactNode } from 'react'
import { render } from '@vitus-labs/core'
import { PKG_NAME } from '~/constants'
import type { VLComponent } from '~/types'

export type Props = {
  children: ReactNode
  className?: string | string[]
  style?: Record<string, unknown>
}

const Component: VLComponent<Props> = ({
  children,
  className = '',
  style = { color: 'blue' },
}) => render(children, { className, style })

const name = `${PKG_NAME}/Util` as const

Component.displayName = name
Component.pkgName = PKG_NAME
Component.VITUS_LABS__COMPONENT = name

export default Component
