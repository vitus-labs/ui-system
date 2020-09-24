import React from 'react'
import { config } from '@vitus-labs/core'
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
  const result = (as = undefined) => (
    <Styled as={as} {...props}>
      {children || label}
    </Styled>
  )

  if (config.isWeb) {
    const finalTag = paragraph ? 'p' : tag
    return result(finalTag)
  }

  return result()
}

Element.displayName = 'vitus-labs/elements/Text'
Element.isText = true

export default Element
