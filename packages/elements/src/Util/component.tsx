import { ReactNode } from 'react'
import { renderContent } from '@vitus-labs/core'
import { PKG_NAME } from '~/constants'
import type { VLComponent } from '~/types'

export type Props = {
  children: ReactNode
  className?: string | string[]
  style?: Record<string, unknown>
}

const component: VLComponent<Props> = ({
  children,
  className = '',
  style = { color: 'blue' },
}) => renderContent(children, { className, style })

const name = `${PKG_NAME}/Util` as const

component.displayName = name
component.pkgName = PKG_NAME
component.VITUS_LABS__COMPONENT = name

export default component
