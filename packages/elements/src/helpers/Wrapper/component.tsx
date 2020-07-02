import React, { forwardRef, useMemo, ReactNode } from 'react'
import { config, pick } from '@vitus-labs/core'
import { vitusContext, optimizeTheme } from '@vitus-labs/unistyle'
import { Direction, AlignX, AlignY, Booltype } from '~/types'
import { INLINE_ELEMENTS_FLEX_FIX } from './constants'
import Styled from './styled'

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
  (
    {
      children,
      tag,
      innerRef,
      block,
      extendCss,
      contentDirection,
      alignX,
      alignY,
      equalCols,
      ...props
    },
    ref
  ) => {
    const needsFix = config.isWeb
      ? INLINE_ELEMENTS_FLEX_FIX.includes(tag)
      : false

    const localProps = {
      block,
      extendCss,
      contentDirection,
      alignX,
      alignY,
      equalCols,
    }

    // const { sortedBreakpoints } = vitusContext()

    // const normalizedTheme = useMemo(
    //   () =>
    //     optimizeTheme({
    //       breakpoints: sortedBreakpoints,
    //       keywords: KEYWORDS,
    //       props: localProps,
    //     }),
    //   [block, extendCss, contentDirection, alignX, alignY, equalCols]
    // )

    if (!needsFix || config.isNative) {
      return (
        <Styled ref={ref || innerRef} as={tag} {...props} $element={localProps}>
          {children}
        </Styled>
      )
    }

    return (
      <Styled
        ref={ref || innerRef}
        as={tag}
        {...props}
        needsFix
        element={pick(localProps, KEYWORDS_WRAPPER)}
      >
        <Styled
          as="span"
          isInner
          element={pick(localProps, KEYWORDS_INNER)}
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
