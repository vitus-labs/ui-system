import React, { useContext } from 'react'
import { omitCtxKeys } from '~/utils'
import useGridContext from '~/useContext'
import { ContainerContext, RowContext } from '~/context'
import type { ElementType } from '~/types'
import Styled from './styled'

const Element: ElementType<
  ['containerWidth', 'width', 'rowComponent', 'rowCss']
> = ({ children, component, css, contentAlignX: rowAlignX, ...props }) => {
  const parentCtx = useContext(ContainerContext)
  const {
    columns,
    gap,
    gutter,
    rowComponent,
    rowCss,
    contentAlignX,
    ...ctx
  } = useGridContext({ ...parentCtx, ...props })

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

Element.displayName = '@vitus-labs/coolgrid/Row'

export default Element
