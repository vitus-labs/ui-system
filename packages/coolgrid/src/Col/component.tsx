import React, { useContext } from 'react'
import { PKG_NAME } from '~/constants'
import { omitCtxKeys } from '~/utils'
import useGridContext from '~/useContext'
import { RowContext } from '~/context'
import type { ElementType } from '~/types'
import Styled from './styled'

const Component: ElementType<
  [
    'containerWidth',
    'width',
    'rowComponent',
    'rowCss',
    'colCss',
    'colComponent',
    'columns',
    'gap',
    'gutter',
    'contentAlignX'
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

const name = `${PKG_NAME}/Col`

Component.displayName = name
Component.pkgName = PKG_NAME
Component.VITUS_LABS__COMPONENT = name

export default Component
