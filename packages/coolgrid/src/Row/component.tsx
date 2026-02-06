import { useContext, useMemo } from 'react'
import { PKG_NAME } from '~/constants'
import { ContainerContext, RowContext } from '~/context'
import type { ElementType } from '~/types'
import useGridContext from '~/useContext'
import { omitCtxKeys } from '~/utils'
import Styled from './styled'

const Component: ElementType<
  ['containerWidth', 'width', 'rowComponent', 'rowCss']
> = ({ children, component, css, contentAlignX: rowAlignX, ...props }) => {
  const parentCtx = useContext(ContainerContext)

  const { columns, gap, gutter, rowComponent, rowCss, contentAlignX, ...ctx } =
    useGridContext({ ...parentCtx, ...props })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const context = useMemo(
    () => ({ ...ctx, columns, gap, gutter }),
    [columns, gap, gutter, ...Object.values(ctx)],
  )

  const finalComponent = useMemo(
    () => component || rowComponent,
    [component, rowComponent],
  )

  const finalProps = useMemo(
    () => ({
      $coolgrid: {
        contentAlignX: rowAlignX || contentAlignX,
        columns,
        gap,
        gutter,
        extraStyles: css || rowCss,
      },
    }),
    [rowAlignX, contentAlignX, columns, gap, gutter, css, rowCss],
  )

  const getDevProps = () => {
    const result = {}
    if (process.env.NODE_ENV !== 'production') {
      result['data-coolgrid'] = 'row'
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
      <RowContext.Provider value={context}>{children}</RowContext.Provider>
    </Styled>
  )
}

const name = `${PKG_NAME}/Row`

Component.displayName = name
Component.pkgName = PKG_NAME
Component.VITUS_LABS__COMPONENT = name

export default Component
