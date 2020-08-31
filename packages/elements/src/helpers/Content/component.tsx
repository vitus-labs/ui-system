import React, { forwardRef, useMemo, ReactNode, Ref } from 'react'
import { vitusContext, optimizeTheme } from '@vitus-labs/unistyle'
import { Direction, AlignX, AlignY, Booltype } from '~/types'
import Styled from './styled'

const KEYWORDS = [
  'parentDirection',
  'direction',
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
  direction: Direction
  alignX: AlignX
  alignY: AlignY
  equalCols: Booltype
  [key: string]: any
}
type Reference = Ref<HTMLElement>

const Element = forwardRef<Reference, Partial<Props>>(
  (
    {
      tag,
      parentDirection,
      direction,
      alignX,
      alignY,
      equalCols,
      gap,
      extendCss,
      ...props
    },
    ref
  ) => {
    const stylingProps = {
      parentDirection,
      direction,
      alignX,
      alignY,
      equalCols,
      gap,
      extendCss,
    }

    const debugProps =
      process.env.NODE_ENV !== 'production'
        ? {
            'data-vb-element': props.contentType,
          }
        : {}

    const { sortedBreakpoints } = vitusContext()
    const normalizedTheme = useMemo(
      () =>
        optimizeTheme({
          breakpoints: sortedBreakpoints,
          keywords: KEYWORDS,
          props: stylingProps,
        }),
      [
        sortedBreakpoints,
        parentDirection,
        direction,
        alignX,
        alignY,
        equalCols,
        gap,
        extendCss,
      ]
    )

    return (
      <Styled
        ref={ref}
        as={tag}
        $element={normalizedTheme}
        {...debugProps}
        {...props}
      />
    )
  }
)

export default Element
