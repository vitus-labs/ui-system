import React, { useContext, useState } from 'react'
import {
  CONFIG,
  extendedCss,
  sortBreakpoints,
  optimizeTheme,
  omit,
  pickThemeProps
} from '@vitus-labs/core'
import { merge, createGridContext } from '../utils'
import { ROW_RESERVED_KEYS as RESERVED_KEYS } from '../constants'
import { Context as ContainerContext } from '../Container'
import RowContext from './context'
import Styled from './styled'

const Element = ({ children, component, css, ...props }) => {
  const theme = useContext(CONFIG().context)
  const [width, setWidth] = useState(0)
  const { coolgrid: ctxTheme, rowCss, rowComponent, ...ctx } = useContext(
    ContainerContext
  )

  const gridContext = createGridContext(props, ctx, theme)
  const breakpoints = sortBreakpoints(gridContext.breakpoints)
  const keywords = [...RESERVED_KEYS, ...breakpoints]

  const normalizedTheme = optimizeTheme({
    breakpoints,
    keywords,
    props: { ...ctxTheme, ...pickThemeProps(props, keywords) }
  })

  const finalProps = {
    ...omit(props, RESERVED_KEYS),
    as: component || rowComponent,
    coolgrid: {
      ...normalizedTheme,
      ...gridContext,
      extendCss: extendedCss(css || rowCss)
    }
  }

  // react native helper to calculate column width
  if (CONFIG().isNative) {
    finalProps.onLayout = event => {
      const { width } = event.nativeEvent.layout
      setWidth(width)
    }
  }

  return (
    <Styled {...finalProps}>
      <RowContext.Provider
        value={{
          ...gridContext,
          ...merge(props, ctx, RESERVED_KEYS),
          coolgrid: {
            ...ctxTheme,
            ...pickThemeProps(props, keywords),
            RNparentWidth: width
          }
        }}
      >
        {children}
      </RowContext.Provider>
    </Styled>
  )
}

Element.displayName = 'vitus-labs/coolgrid/Row'

export default Element
