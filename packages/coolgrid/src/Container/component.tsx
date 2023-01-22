import React, { useMemo } from 'react'
import { PKG_NAME } from '~/constants'
import { omitCtxKeys } from '~/utils'
import Context from '~/context/ContainerContext'
import useGridContext from '~/useContext'
import type { ElementType } from '~/types'
import Styled from './styled'

const Component: ElementType<['containerWidth']> = ({
  children,
  component,
  css,
  width,
  ...props
}) => {
  const { containerWidth = {}, ...ctx } = useGridContext(props)
  const context = useMemo(() => ctx, [ctx])

  let finalWidth = containerWidth
  if (width) {
    // @ts-ignore
    finalWidth = typeof width === 'function' ? width(containerWidth) : width
  }

  const finalProps = useMemo(
    () => ({
      $coolgrid: {
        width: finalWidth,
        extraStyles: css,
      },
    }),
    [finalWidth, css]
  )

  const getDevProps = () => {
    const result = {}
    if (process.env.NODE_ENV !== 'production') {
      result['data-coolgrid'] = 'container'
    }

    return result
  }

  return (
    <Styled
      {...omitCtxKeys(props)}
      as={component}
      {...finalProps}
      {...getDevProps()}
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
