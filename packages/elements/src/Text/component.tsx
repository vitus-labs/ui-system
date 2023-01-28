import React, { forwardRef, ForwardRefRenderFunction, ReactNode } from 'react'
import type { HTMLTextTags } from '@vitus-labs/core'
import { PKG_NAME } from '~/constants'
import type { VLForwardedComponent, ExtendCss } from '~/types'
import Styled from './styled'

export type Props = Partial<{
  paragraph: boolean
  label: ReactNode
  children: ReactNode
  tag: HTMLTextTags
  extendCss: ExtendCss
}>

type RenderContent = (as?: any) => ReturnType<ForwardRefRenderFunction<Props>>

const component: VLForwardedComponent<Props> & {
  isText?: true
} = forwardRef(
  ({ paragraph, label, children, tag, extendCss, ...props }, ref) => {
    const renderContent: RenderContent = (as = undefined) => (
      <Styled ref={ref} as={as} $text={{ extraStyles: extendCss }} {...props}>
        {children || label}
      </Styled>
    )

    let finalTag

    if (__WEB__) {
      if (paragraph) finalTag = 'p'
      else {
        finalTag = tag
      }
    }

    return renderContent(finalTag)
  }
)

const name = `${PKG_NAME}/Text` as const

component.displayName = name
component.pkgName = PKG_NAME
component.VITUS_LABS__COMPONENT = name
component.isText = true

export default component
