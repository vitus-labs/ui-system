import React, { ComponentType, FC, ReactNode, useContext } from 'react'
import { omit } from '@vitus-labs/core'
import { CONTEXT_KEYS } from '~/constants'
import useGridContext from '~/useContext'
import { RowContext } from '~/context'
import type { ExtendCss, ConfigurationProps } from '~/types'
import Styled from './styled'

type Props = Partial<{
  children: ReactNode
  component: ComponentType
  css: ExtendCss
}> &
  ConfigurationProps &
  Partial<{
    columns: never
    gap: never
    gutter: never
  }>

type ElementType<
  P extends Record<string, unknown> = Record<string, unknown>
> = FC<P & Props>

const Element: ElementType = ({ children, component, css, ...props }) => {
  const parentCtx = useContext(RowContext)
  const { colCss, colComponent, ...ctx } = useGridContext({
    ...parentCtx,
    ...props,
  })

  return (
    <Styled
      {...omit(props, CONTEXT_KEYS)}
      as={component || colComponent}
      $coolgrid={{
        ...ctx,
        extendCss: css || colCss,
      }}
    >
      {children}
    </Styled>
  )
}

Element.displayName = '@vitus-labs/coolgrid/Col'

export default Element
