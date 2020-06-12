import React, { forwardRef, ReactNode, Ref } from 'react'
import { omit } from '@vitus-labs/core'
import { vitusContext, optimizeTheme } from '@vitus-labs/unistyle'
import Styled from './styled'
import { Direction, AlignX, AlignY, Booltype } from '~/types'

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
  contentType: 'before' | 'content' | 'after'
  children: ReactNode
  tag: import('styled-components').StyledComponentPropsWithRef<any>
  contentDirection: Direction
  alignX: AlignX
  alignY: AlignY
  equalCols: Booltype
  [key: string]: any
}
type Reference = Ref<HTMLElement>

const Element = forwardRef<Reference, Partial<Props>>(
  ({ tag, ...props }, ref) => {
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
  }
)

export default Element
