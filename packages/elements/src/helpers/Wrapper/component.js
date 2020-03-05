import React, { forwardRef, memo } from 'react'
import config, { omit } from '@vitus-labs/core'
import { vitusContext, optimizeTheme } from '@vitus-labs/unistyle'
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

  const needsFix = config.isWeb ? INLINE_ELEMENTS_FLEX_FIX.includes(tag) : false

  const ctx = vitusContext()
  const normalizedTheme = optimizeTheme({
    breakpoints: ctx.sortedBreakpoints,
    keywords: KEYWORDS,
    props
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
          config.css`
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
