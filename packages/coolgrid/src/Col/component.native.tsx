import { useContext, useMemo } from 'react'
import { PKG_NAME } from '~/constants'
import { RowContext } from '~/context'
import type { ElementType } from '~/types'
import useGridContext from '~/useContext'
import { omitCtxKeys } from '~/utils'
import Styled from './styled'

/**
 * Native Col component that reads RNparentWidth from RowContext
 * and passes it into the styled component so column widths can be
 * computed as absolute pixels (CSS calc() is unavailable on RN).
 */

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
    'contentAlignX',
  ]
> = ({ children, component, css, ...props }) => {
  const parentCtx = useContext(RowContext)
  const { colCss, colComponent, columns, gap, size, padding } = useGridContext({
    ...parentCtx,
    ...props,
  })

  const RNparentWidth = parentCtx.RNparentWidth ?? 0

  const finalProps = useMemo(
    () => ({
      $coolgrid: {
        columns,
        gap,
        size,
        padding,
        RNparentWidth,
        extraStyles: css ?? colCss,
      },
    }),
    [columns, gap, size, padding, RNparentWidth, css, colCss],
  )

  return (
    <Styled
      {...omitCtxKeys(props)}
      as={component ?? colComponent}
      {...finalProps}
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
