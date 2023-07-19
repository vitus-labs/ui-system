import React, { forwardRef, ForwardRefRenderFunction, ReactNode } from 'react'
import type { HTMLTextTags } from '@vitus-labs/core'
import { PKG_NAME } from '~/constants'
import type { VLForwardedComponent, ExtendCss } from '~/types'
import Styled from './styled'

export type Props = Partial<{
  /**
   * Label can be used instead of children for inline syntax. But **children** prop takes a precedence
   */
  label: ReactNode
  /**
   * Children to be rendered within **Text** component.
   */
  children: ReactNode
  /**
   * Defines whether should behave as a block text element. Automatically adds **p** HTML tag
   */
  paragraph: boolean
  /**
   * Defines what kind of HTML tag should be rendered
   */
  tag: HTMLTextTags
  /**
   * If an additional styling needs to be added, it can be do so via injecting styles using this property.
   */
  css: ExtendCss
}>

type RenderContent = (as?: any) => ReturnType<ForwardRefRenderFunction<Props>>

const Component: VLForwardedComponent<Props> & {
  isText?: true
} = forwardRef(({ paragraph, label, children, tag, css, ...props }, ref) => {
  const renderContent: RenderContent = (as = undefined) => (
    <Styled ref={ref} as={as} $text={{ extraStyles: css }} {...props}>
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
})

// ----------------------------------------------
// DEFINE STATICS
// ----------------------------------------------
const name = `${PKG_NAME}/Text` as const

Component.displayName = name
Component.pkgName = PKG_NAME
Component.VITUS_LABS__COMPONENT = name
Component.isText = true

export default Component
