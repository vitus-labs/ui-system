/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { forwardRef, ReactNode, ForwardRefExoticComponent } from 'react'
import type { HTMLTags } from '@vitus-labs/core'
import { PKG_NAME } from '~/constants'
import Styled from './styled'
import type { ExtendCss } from '~/types'

export type Props = Partial<{
  paragraph: boolean
  label: ReactNode
  children: ReactNode
  tag: HTMLTags
  extendCss: ExtendCss
}>

const Component: ForwardRefExoticComponent<Props> & {
  isText?: true
} = forwardRef<any, Props>(
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

const name = `${PKG_NAME}/Text`

Component.displayName = name
// @ts-ignore
Component.pkgName = PKG_NAME
// @ts-ignore
Component.VITUS_LABS__COMPONENT = name

Component.isText = true

export default Element
