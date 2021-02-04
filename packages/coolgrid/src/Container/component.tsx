import React, { ReactNode, FC, ComponentType } from 'react'
import { omit } from '@vitus-labs/core'
import { CONTEXT_KEYS } from '~/constants'
import Context from '~/context/ContainerContext'
import useGridContext from '~/useContext'
import type { ExtendCss, ConfigurationProps, ValueType } from '~/types'
import Styled from './styled'

type Props = Partial<{
  children: ReactNode
  width: ValueType
  component: ComponentType
  columns: number
  css: ExtendCss
  rowCss: ExtendCss
  colCss: ExtendCss
}> &
  ConfigurationProps

type ElementType<
  P extends Record<string, unknown> = Record<string, unknown>
> = FC<P & Props>

const Element: ElementType = ({
  children,
  component,
  css,
  width,
  ...props
}) => {
  const { containerWidth, ...ctx } = useGridContext(props)

  return (
    <Styled
      {...omit(props, [...CONTEXT_KEYS])}
      as={component}
      $coolgrid={{
        width: width || containerWidth,
        extendCss: css,
      }}
    >
      <Context.Provider value={ctx}>{children}</Context.Provider>
    </Styled>
  )
}

Element.displayName = '@vitus-labs/coolgrid/Container'

export default Element
