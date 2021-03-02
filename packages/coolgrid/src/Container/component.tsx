import React from 'react'
import { omitCtxKeys } from '~/utils'
import Context from '~/context/ContainerContext'
import useGridContext from '~/useContext'
import type { ElementType } from '~/types'
import Styled from './styled'

const Element: ElementType<['containerWidth']> = ({
  children,
  component,
  css,
  width,
  ...props
}) => {
  const { containerWidth, ...ctx } = useGridContext(props)

  console.log('row')
  console.log(ctx)

  return (
    <Styled
      {...omitCtxKeys(props)}
      as={component}
      $coolgrid={{
        width: width || containerWidth,
        extendCss: css,
      }}
    >
      <Context.Provider value={ctx}>{children}</Context.Provider>
    </Styled>
  )
}

Element.displayName = '@vitus-labs/coolgrid/Container'

export default Element
