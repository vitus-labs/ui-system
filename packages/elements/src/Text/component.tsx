/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import type { ReactNode } from 'react'
import type { StyledComponentPropsWithRef } from 'styled-components'
import Styled from './styled'

type Props = Partial<{
  paragraph: boolean
  label: ReactNode
  children: ReactNode
  tag: StyledComponentPropsWithRef<any>
}>

const Element: React.FC<Props> & { isText: boolean } = ({
  paragraph,
  label,
  children,
  tag,
  ...props
}) => {
  const renderContent = (as = undefined) => (
    <Styled as={as} {...props}>
      {children || label}
    </Styled>
  )

  // eslint-disable-next-line no-nested-ternary
  const finalTag = __WEB__ ? (paragraph ? 'p' : tag) : undefined

  return renderContent(finalTag)
}

Element.displayName = 'vitus-labs/elements/Text'
Element.isText = true

export default Element
