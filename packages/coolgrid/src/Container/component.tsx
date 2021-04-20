import React from 'react'
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

  let finalWidth = containerWidth
  if (width) {
    // @ts-ignore
    finalWidth = typeof width === 'function' ? width(containerWidth) : width
  }

  return (
    <Styled
      {...omitCtxKeys(props)}
      as={component}
      $coolgrid={{
        width: finalWidth,
        extraStyles: css,
      }}
    >
      <Context.Provider value={ctx}>{children}</Context.Provider>
    </Styled>
  )
}

const name = `${PKG_NAME}/Container`

Component.displayName = name
Component.pkgName = PKG_NAME
Component.VITUS_LABS__COMPONENT = name

export default Element
