/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { forwardRef, ReactNode, ForwardRefExoticComponent } from 'react'
import type { HTMLTags } from '@vitus-labs/core'
import Styled from './styled'
import type { ExtendCss } from '~/types'

export type Props = Partial<{
  paragraph: boolean
  label: ReactNode
  children: ReactNode
  tag: HTMLTags
  extendCss: ExtendCss
}>

const Element: ForwardRefExoticComponent<Props> & {
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

Element.displayName = 'vitus-labs/elements/Text'
Element.isText = true

export default Element
