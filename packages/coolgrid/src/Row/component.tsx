// @ts-nocheck
import React, { useContext, useState } from 'react'
import { config, omit } from '@vitus-labs/core'
import {
  extendedCss,
  sortBreakpoints,
  optimizeTheme,
  pickThemeProps,
} from '@vitus-labs/unistyle'
import { merge, createGridContext } from '../utils'
import { ROW_RESERVED_KEYS as RESERVED_KEYS } from '../constants'
import { Context as ContainerContext } from '../Container'
import RowContext from './context'
import Styled from './styled'

const Element = ({ children, component, css, ...props }) => {
  const theme = useContext(config.context)

  const [width, setWidth] = useState(0)
  const { coolgrid, rowCss, rowComponent, ...ctx } = useContext(
    ContainerContext
  )

  const gridContext = createGridContext(props, ctx, theme)
  const breakpoints = sortBreakpoints(gridContext.breakpoints)
  const keywords = [...breakpoints, ...RESERVED_KEYS]

  const ctxTheme = { ...coolgrid, ...pickThemeProps(props, keywords) }

  // creates responsive params
  const normalizedTheme = optimizeTheme({
    breakpoints,
    keywords,
    props: ctxTheme,
  })

  const finalProps = {
    ...omit(props, RESERVED_KEYS),
    as: component || rowComponent,
    coolgrid: {
      ...normalizedTheme,
      ...gridContext,
      extendCss: extendedCss(css || rowCss),
    },
  }

  // react native helper to calculate column width
  // if (config.isNative) {
  //   finalProps.onLayout = (event) => {
  //     const { width } = event.nativeEvent.layout
  //     setWidth(width)
  //   }
  // }

  return (
    <Styled {...finalProps}>
      <RowContext.Provider
        value={{
          ...gridContext,
          ...merge(props, ctx, RESERVED_KEYS),
          coolgrid: { RNparentWidth: width, ...ctxTheme },
        }}
      >
        {children}
      </RowContext.Provider>
    </Styled>
  )
}

Element.displayName = '@vitus-labs/coolgrid/Row'

export default Element
