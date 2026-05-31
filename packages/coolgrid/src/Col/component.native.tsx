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
> = ({ children, component, css, offset, order, auto, ...props }) => {
  const parentCtx = useContext(RowContext)
  const { colCss, colComponent, columns, gap, size, padding } = useGridContext({
    ...parentCtx,
    ...props,
  })

  const RNparentWidth = parentCtx.RNparentWidth ?? 0

  // offset/order/auto were silently dropped here — styled.ts has native
  // code paths for all three (offset% margins, flex order, flex: 1 1 auto)
  // but the props never reached it. Mirrors component.tsx on web.
  const finalProps = useMemo(
    () => ({
      $coolgrid: {
        columns,
        gap,
        size,
        padding,
        offset,
        order,
        auto,
        RNparentWidth,
        extraStyles: css ?? colCss,
      },
    }),
    [
      columns,
      gap,
      size,
      padding,
      offset,
      order,
      auto,
      RNparentWidth,
      css,
      colCss,
    ],
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
