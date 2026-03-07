import { useCallback, useContext, useMemo, useState } from 'react'
import type { LayoutChangeEvent } from 'react-native'
import { PKG_NAME } from '~/constants'
import { ContainerContext, RowContext } from '~/context'
import type { ElementType } from '~/types'
import useGridContext from '~/useContext'
import { omitCtxKeys } from '~/utils'
import Styled from './styled'

/**
 * Native Row component that measures its own width via onLayout and passes
 * it as RNparentWidth through RowContext so Col children can compute
 * absolute pixel widths (CSS calc() is unavailable on React Native).
 */

const Component: ElementType<
  ['containerWidth', 'width', 'rowComponent', 'rowCss']
> = ({ children, component, css, contentAlignX: rowAlignX, ...props }) => {
  const parentCtx = useContext(ContainerContext)
  const [parentWidth, setParentWidth] = useState(0)

  const {
    columns,
    gap,
    gutter,
    rowComponent,
    rowCss,
    contentAlignX,
    containerWidth,
    size,
    padding,
    colCss,
    colComponent,
  } = useGridContext({ ...parentCtx, ...props })

  const context = useMemo(
    () => ({
      containerWidth,
      size,
      padding,
      colCss,
      colComponent,
      columns,
      gap,
      gutter,
      RNparentWidth: parentWidth,
    }),
    [
      containerWidth,
      size,
      padding,
      colCss,
      colComponent,
      columns,
      gap,
      gutter,
      parentWidth,
    ],
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

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const newWidth = e.nativeEvent.layout.width
    setParentWidth((prev) => (prev === newWidth ? prev : newWidth))
  }, [])

  return (
    <Styled
      {...omitCtxKeys(props)}
      as={component || rowComponent}
      {...finalProps}
      onLayout={onLayout}
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
