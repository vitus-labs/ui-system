import { useContext, useMemo } from 'react'
import { PKG_NAME } from '~/constants'
import { RowContext } from '~/context'
import type { ElementType } from '~/types'
import useGridContext from '~/useContext'
import { omitCtxKeys } from '~/utils'
import Styled from './styled'

/**
 * Col (column) component that reads grid settings from RowContext
 * (columns, gap, gutter) and calculates its own width as a fraction
 * of the total columns. Supports responsive size, padding, and visibility.
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

  const finalComponent = useMemo(
    () => component ?? colComponent,
    [component, colComponent],
  )

  const finalProps = useMemo(
    () => ({
      $coolgrid: {
        columns,
        gap,
        size,
        padding,
        extraStyles: css ?? colCss,
      },
    }),
    [columns, gap, size, padding, css, colCss],
  )

  const getDevProps = () => {
    const result = {}
    if (process.env.NODE_ENV !== 'production') {
      result['data-coolgrid'] = 'col'
    }

    return result
  }

  return (
    <Styled
      {...omitCtxKeys(props)}
      as={finalComponent}
      {...finalProps}
      {...getDevProps()}
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
