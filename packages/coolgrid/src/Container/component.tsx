// @ts-nocheck
import React, { useContext } from 'react'
import { config, omit } from '@vitus-labs/core'
import {
  extendedCss,
  sortBreakpoints,
  pickThemeProps,
} from '@vitus-labs/unistyle'
import { merge, createGridContext } from '../utils'
import {
  CONTAINER_RESERVED_KEYS as RESERVED_KEYS,
  BASE_RESERVED_KEYS,
} from '../constants'
import Context from '../context/ContainerContext'
import Styled from './styled'

const Element = ({ children, width, component, css, ...props }) => {
  const theme = useContext(config.context)

  const gridContext = createGridContext(props, {}, theme)
  const breakpoints = sortBreakpoints(gridContext.breakpoints)
  const keywords = [...breakpoints, ...RESERVED_KEYS]

  const ctxTheme = pickThemeProps(props, keywords)

  return (
    <Styled
      {...omit(props, [...RESERVED_KEYS, ...BASE_RESERVED_KEYS])}
      as={component}
      coolgrid={{
        ...gridContext,
        width: width || theme.grid.container,
        extendCss: extendedCss(css),
      }}
    >
      <Context.Provider
        value={{
          ...gridContext,
          ...merge(props, {}, RESERVED_KEYS),
          coolgrid: ctxTheme,
        }}
      >
        {children}
      </Context.Provider>
    </Styled>
  )
}

Element.displayName = '@vitus-labs/coolgrid/Container'

export default Element
