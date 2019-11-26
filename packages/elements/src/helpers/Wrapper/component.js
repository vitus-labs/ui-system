import React, { forwardRef, memo } from 'react'
import { CONFIG, vitusContext, optimizeTheme, omit } from '@vitus-labs/core'
import { INLINE_ELEMENTS_FLEX_FIX } from './constants'
import Styled from './styled'

const KEYWORDS = [
  'block',
  'contentDirection',
  'alignX',
  'alignY',
  'equalCols',
  'extendCss'
]

const Element = forwardRef(({ children, tag, innerRef, ...props }, ref) => {
  const restProps = omit(props, KEYWORDS)

  const needsFix = CONFIG().isWeb
    ? INLINE_ELEMENTS_FLEX_FIX.includes(tag)
    : null

  const ctx = vitusContext()
  const normalizedTheme = optimizeTheme({
    breakpoints: ctx.sortedBreakpoints,
    keywords: KEYWORDS,
    props
  })

  if (!needsFix || CONFIG().isNative) {
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
      element={{
        ...normalizedTheme,
        alignX: undefined,
        alignY: undefined,
        contentDirection: undefined,
        extendCss: undefined
      }}
    >
      <Styled
        as="span"
        element={{
          ...normalizedTheme,
          block: undefined
        }}
        extendCss={[
          CONFIG().css`
          height: 100%;
          width: 100%;
        `
        ]}
      >
        {children}
      </Styled>
    </Styled>
  )
})

export default Element
