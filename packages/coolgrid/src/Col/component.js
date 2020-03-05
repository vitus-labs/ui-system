import React, { useContext } from 'react'
import { omit } from '@vitus-labs/core'
import {
  vitusContext,
  extendedCss,
  sortBreakpoints,
  optimizeTheme,
  pickThemeProps
} from '@vitus-labs/unistyle'
import { COLUMN_RESERVED_KEYS as RESERVED_KEYS } from '../constants'
import RowContext from '../Row/context'
import Styled from './styled'

const isHidden = ({ sortedBreakpoints, size, currentBreakpoint }) => {
  let foundBp = false
  let isHidden = false
  const reversed = sortedBreakpoints.slice().reverse()

  for (let i = 0; i < sortedBreakpoints.length; i += 1) {
    const item = reversed[i]

    if (item === currentBreakpoint) {
      foundBp = true
    }

    if (foundBp && Number.isFinite(size[item])) {
      isHidden = size[item] === 0 || false
      break
    }
  }

  return isHidden
}

const Element = ({ children, component, css, ...rest }) => {
  const vitusLabsCtx = vitusContext()
  const { coolgrid, colCss, colComponent, ...ctx } = useContext(RowContext)

  const breakpoints = sortBreakpoints(ctx.breakpoints)
  const omitKeywords = ['columns', 'gap', 'gutter', 'RNparentWidth']
  const keywords = [...breakpoints, ...RESERVED_KEYS, ...omitKeywords]
  // delete gap, and some other props which can be passed only
  // via context from Container or Row
  const props = omit(rest, omitKeywords)

  const normalizedTheme = optimizeTheme({
    breakpoints,
    keywords,
    props: { ...coolgrid, ...pickThemeProps(rest, keywords), columns: ctx.columns }
  })

  // hide column when size=0 for a breakpoint and up
  if (normalizedTheme.size) {
    if (
      isHidden({
        sortedBreakpoints: breakpoints,
        size: normalizedTheme.size,
        currentBreakpoint: vitusLabsCtx.getCurrentBreakpoint(ctx.breakpoints)
      })
    )
      return null
  }

  return (
    <Styled
      {...omit(props, RESERVED_KEYS)}
      as={component || colComponent}
      coolgrid={{
        RNparentWidth: coolgrid.RNparentWidth,
        ...ctx,
        ...normalizedTheme,
        extendCss: extendedCss(css || colCss)
      }}
    >
      {children}
    </Styled>
  )
}

Element.displayName = '@vitus-labs/coolgrid/Col'

export default Element
