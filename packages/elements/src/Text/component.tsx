import React, { forwardRef, ReactNode } from 'react'
import type { HTMLTags } from '@vitus-labs/core'
import { PKG_NAME } from '~/constants'
import Styled from './styled'
import type { ExtendCss, VLForwardedComponent } from '~/types'

export type Props = Partial<{
  paragraph: boolean
  label: ReactNode
  children: ReactNode
  tag: HTMLTags
  extendCss: ExtendCss
}>

const component: VLForwardedComponent<Props> & {
  isText?: true
} = forwardRef(
  ({ paragraph, label, children, tag, extendCss, ...props }, ref) => {
    const renderContent = (as = undefined) => (
      <Styled ref={ref} as={as} $text={{ extraStyles: extendCss }} {...props}>
        {children || label}
      </Styled>
    )

    // eslint-disable-next-line no-nested-ternary
    const finalTag = __WEB__ ? (paragraph ? 'p' : tag) : undefined

    return renderContent(finalTag)
  }
)

const name = `${PKG_NAME}/Text` as const

component.displayName = name
component.pkgName = PKG_NAME
component.VITUS_LABS__COMPONENT = name
component.isText = true

export default component
