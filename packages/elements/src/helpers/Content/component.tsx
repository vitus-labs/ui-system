import React, { forwardRef, ReactNode } from 'react'
import { omit } from '@vitus-labs/core'
import { vitusContext, optimizeTheme } from '@vitus-labs/unistyle'
import Styled from './styled'

const KEYWORDS = [
  'parentDirection',
  'contentDirection',
  'alignX',
  'alignY',
  'equalCols',
  'gap',
  'extendCss',
]

type Props = {
  children: ReactNode
  tag?: import('styled-components').StyledComponentPropsWithRef<any>
}
type Ref = HTMLElement

const Element = forwardRef<Ref, Props>(({ tag, ...props }, ref) => {
  const { sortedBreakpoints } = vitusContext()

  const normalizedTheme = optimizeTheme({
    breakpoints: sortedBreakpoints,
    keywords: KEYWORDS,
    props,
  })

  return (
    <Styled
      ref={ref}
      as={tag}
      element={normalizedTheme}
      {...omit(props, KEYWORDS)}
    />
  )
})

export default Element
