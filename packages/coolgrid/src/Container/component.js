import React, { useContext } from 'react'
import {
  CONFIG,
  extendedCss,
  sortBreakpoints,
  omit,
  pickThemeProps
} from '@vitus-labs/core'
import { merge, createGridContext } from '../utils'
import {
  CONTAINER_RESERVED_KEYS as RESERVED_KEYS,
  BASE_RESERVED_KEYS
} from '../constants'
import Context from './context'
import Styled from './styled'

const Element = ({ children, width, component, css, ...props }) => {
  const theme = useContext(CONFIG().context)
  const gridContext = createGridContext(props, {}, theme)
  const breakpoints = sortBreakpoints(gridContext.breakpoints)
  const ctxTheme = pickThemeProps(props, [...RESERVED_KEYS, ...breakpoints])

  return (
    <Styled
      {...omit(props, [...RESERVED_KEYS, ...BASE_RESERVED_KEYS])}
      as={component}
      coolgrid={{
        ...gridContext,
        width: width || theme.grid.container,
        extendCss: extendedCss(css)
      }}
    >
      <Context.Provider
        value={{
          ...gridContext,
          ...merge(props, {}, RESERVED_KEYS),
          coolgrid: ctxTheme
        }}
      >
        {children}
      </Context.Provider>
    </Styled>
  )
}

Element.displayName = 'vitus-labs/coolgrid/Container'

export default Element
