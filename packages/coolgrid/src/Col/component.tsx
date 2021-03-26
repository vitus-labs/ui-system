import React, { useContext } from 'react'
import { omitCtxKeys } from '~/utils'
import useGridContext from '~/useContext'
import { RowContext } from '~/context'
import type { ElementType } from '~/types'
import Styled from './styled'

const Element: ElementType<
  [
    'containerWidth',
    'width',
    'rowComponent',
    'rowCss',
    'colCss',
    'colComponent',
    'columns',
    'gap',
    'gutter'
  ]
> = ({ children, component, css, ...props }) => {
  const parentCtx = useContext(RowContext)
  const { colCss, colComponent, columns, gap, size, padding } = useGridContext({
    ...parentCtx,
    ...props,
  })

  return (
    <Styled
      {...omitCtxKeys(props)}
      as={component || colComponent}
      $coolgrid={{
        columns,
        gap,
        size,
        padding,
        extraStyles: css || colCss,
      }}
    >
      {children}
    </Styled>
  )
}

Element.displayName = '@vitus-labs/coolgrid/Col'

export default Element
