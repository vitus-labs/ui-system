import React, { useContext } from 'react'
import { PKG_NAME } from '~/constants'
import { omitCtxKeys } from '~/utils'
import useGridContext from '~/useContext'
import { ContainerContext, RowContext } from '~/context'
import type { ElementType } from '~/types'
import Styled from './styled'

const Component: ElementType<
  ['containerWidth', 'width', 'rowComponent', 'rowCss']
> = ({ children, component, css, contentAlignX: rowAlignX, ...props }) => {
  const parentCtx = useContext(ContainerContext)
  const { columns, gap, gutter, rowComponent, rowCss, contentAlignX, ...ctx } =
    useGridContext({ ...parentCtx, ...props })

  const finalProps = {
    ...omitCtxKeys(props),
    as: component || rowComponent,
    $coolgrid: {
      contentAlignX: rowAlignX || contentAlignX,
      columns,
      gap,
      gutter,
      extraStyles: css || rowCss,
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

const name = `${PKG_NAME}/Row`

Component.displayName = name
Component.pkgName = PKG_NAME
Component.VITUS_LABS__COMPONENT = name

export default Component
