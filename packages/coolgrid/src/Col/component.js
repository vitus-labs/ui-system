import React, { useContext } from 'react'
import {
  extendedCss,
  sortBreakpoints,
  optimizeTheme,
  pickThemeProps,
  omit
} from '@vitus-labs/core'
import { COLUMN_RESERVED_KEYS as RESERVED_KEYS } from '../constants'
import RowContext from '../Row/context'
import Styled from './styled'

const Element = ({ children, component, css, ...rest }) => {
  const { coolgrid: ctxTheme, colCss, colComponent, ...ctx } = useContext(RowContext)

  const breakpoints = sortBreakpoints(ctx.breakpoints)
  const omitKeywords = ['columns', 'gap', 'gutter', 'RNparentWidth']
  const keywords = [...RESERVED_KEYS, ...omitKeywords, ...breakpoints]
  // delete gap, it can be passed only via context from Container or Row
  const props = omit(rest, omitKeywords)

  const normalizedTheme = optimizeTheme({
    breakpoints,
    keywords,
    props: { ...ctxTheme, ...pickThemeProps(rest, keywords), columns: ctx.columns }
  })

  return (
    <Styled
      {...omit(props, RESERVED_KEYS)}
      as={component || colComponent}
      coolgrid={{
        RNparentWidth: ctxTheme.RNparentWidth,
        ...ctx,
        ...normalizedTheme,
        extendCss: extendedCss(css || colCss)
      }}
    >
      {children}
    </Styled>
  )
}

Element.displayName = 'vitus-labs/coolgrid/Col'

export default Element
