import React, { forwardRef, ReactNode, Ref } from 'react'
import { config, omit, pick } from '@vitus-labs/core'
import { vitusContext, optimizeTheme } from '@vitus-labs/unistyle'
import { INLINE_ELEMENTS_FLEX_FIX } from './constants'
import Styled from './styled'
import { Direction, AlignX, AlignY, Booltype } from '~/types'

const KEYWORDS_WRAPPER = ['block', 'extendCss']
const KEYWORDS_INNER = ['contentDirection', 'alignX', 'alignY', 'equalCols']
const KEYWORDS = [...KEYWORDS_WRAPPER, ...KEYWORDS_INNER]

type Reference = any

type Props = {
  children: ReactNode
  tag: import('styled-components').StyledComponentPropsWithRef<any>
  innerRef: Reference
  contentDirection: Direction
  alignX: AlignX
  alignY: AlignY
  equalCols: Booltype
  [key: string]: any
}

const Element = forwardRef<Reference, Partial<Props>>(
  ({ children, tag, innerRef, ...props }, ref) => {
    const needsFix = config.isWeb
      ? INLINE_ELEMENTS_FLEX_FIX.includes(tag)
      : false
    const restProps = omit(props, KEYWORDS)

    const { sortedBreakpoints } = vitusContext()
    const normalizedTheme = optimizeTheme({
      breakpoints: sortedBreakpoints,
      keywords: KEYWORDS,
      props,
    })

    if (!needsFix || config.isNative) {
      return (
        <Styled
          ref={ref || innerRef}
          as={tag}
          {...restProps}
          element={normalizedTheme}
        >
          {children}
        </Styled>
      )
    }

    return (
      <Styled
        ref={ref || innerRef}
        as={tag}
        {...restProps}
        needsFix
        element={pick(normalizedTheme, KEYWORDS_WRAPPER)}
      >
        <Styled
          as="span"
          isInner
          element={pick(normalizedTheme, KEYWORDS_INNER)}
          extendCss={config.css`
          height: 100%;
          width: 100%;
        `}
        >
          {children}
        </Styled>
      </Styled>
    )
  }
)

export default Element
