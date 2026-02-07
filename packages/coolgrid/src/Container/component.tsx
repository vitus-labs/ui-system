import { useMemo } from 'react'
import { PKG_NAME } from '~/constants'
import Context from '~/context/ContainerContext'
import type { ElementType } from '~/types'
import useGridContext from '~/useContext'
import { omitCtxKeys } from '~/utils'
import Styled from './styled'

/**
 * Container component that establishes the outermost grid boundary.
 * Resolves grid config from the theme, provides it to descendant Row/Col
 * components via ContainerContext, and renders a styled wrapper with
 * responsive max-width.
 */

const DEV_PROPS: Record<string, string> =
  process.env.NODE_ENV !== 'production' ? { 'data-coolgrid': 'container' } : {}

const Component: ElementType<['containerWidth']> = ({
  children,
  component,
  css,
  width,
  ...props
}) => {
  const {
    containerWidth = {},
    columns,
    size,
    gap,
    padding,
    gutter,
    colCss,
    colComponent,
    rowCss,
    rowComponent,
    contentAlignX,
  } = useGridContext(props)

  const context = useMemo(
    () => ({
      columns,
      size,
      gap,
      padding,
      gutter,
      colCss,
      colComponent,
      rowCss,
      rowComponent,
      contentAlignX,
    }),
    [
      columns,
      size,
      gap,
      padding,
      gutter,
      colCss,
      colComponent,
      rowCss,
      rowComponent,
      contentAlignX,
    ],
  )

  const finalWidth = useMemo(() => {
    if (!width) return containerWidth
    // @ts-expect-error
    return typeof width === 'function' ? width(containerWidth) : width
  }, [width, containerWidth])

  const finalProps = useMemo(
    () => ({
      $coolgrid: {
        width: finalWidth,
        extraStyles: css,
      },
    }),
    [finalWidth, css],
  )

  return (
    <Styled
      {...omitCtxKeys(props)}
      as={component}
      {...finalProps}
      {...DEV_PROPS}
    >
      <Context.Provider value={context}>{children}</Context.Provider>
    </Styled>
  )
}

const name = `${PKG_NAME}/Container`

Component.displayName = name
Component.pkgName = PKG_NAME
Component.VITUS_LABS__COMPONENT = name

export default Component
