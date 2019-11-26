import React, { memo } from 'react'
import { vitusContext, optimizeTheme, omit } from '@vitus-labs/core'
import Styled from './styled'

const KEYWORDS = [
  'contentDirection',
  'alignX',
  'alignY',
  'equalCols',
  'extendCss'
]

const Element = ({ tag, ...props }) => {
  const ctx = vitusContext()

  const normalizedTheme = optimizeTheme({
    breakpoints: ctx.sortedBreakpoints,
    keywords: KEYWORDS,
    props
  })

  return (
    <Styled as={tag} element={normalizedTheme} {...omit(props, KEYWORDS)} />
  )
}

export default Element
