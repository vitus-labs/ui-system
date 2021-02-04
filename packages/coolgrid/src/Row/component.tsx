import React, { FC, ReactNode, ComponentType, useContext } from 'react'
import { omit } from '@vitus-labs/core'
import { CONTEXT_KEYS } from '~/constants'
import useGridContext from '~/useContext'
import { ContainerContext, RowContext } from '~/context'
import type { Css, ConfigurationProps } from '~/types'
import Styled from './styled'

type Props = Partial<
  {
    children: ReactNode
    component: ComponentType
    css: Css
  } & ConfigurationProps
>

type ElementType<
  P extends Record<string, unknown> = Record<string, unknown>
> = FC<P & Props>

const Element: ElementType = ({ children, component, css, ...props }) => {
  const parentCtx = useContext(ContainerContext)
  const {
    columns,
    gap,
    gutter,
    rowComponent,
    rowCss,
    ...ctx
  } = useGridContext({ ...parentCtx, ...props })

  const finalProps = {
    ...omit(props, CONTEXT_KEYS),
    as: component || rowComponent,
    $coolgrid: {
      columns,
      gap,
      gutter,
      extendCss: css || rowCss,
    },
  }

  return (
    <Styled {...finalProps}>
      <RowContext.Provider value={{ ...ctx, columns, gap, gutter }}>
        {children}
      </RowContext.Provider>
    </Styled>
  )
}

Element.displayName = '@vitus-labs/coolgrid/Row'

export default Element
