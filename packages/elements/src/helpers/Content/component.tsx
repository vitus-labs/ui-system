import type { FC } from 'react'
import { memo } from 'react'
import { IS_DEVELOPMENT } from '~/utils'
import Styled from './styled'
import type { Props } from './types'

const Component: FC<Partial<Props>> = ({
  contentType,
  tag,
  parentDirection,
  direction,
  alignX,
  alignY,
  equalCols,
  gap,
  extendCss,
  ...props
}) => {
  const debugProps = IS_DEVELOPMENT
    ? {
        'data-vl-element': contentType,
      }
    : {}

  const stylingProps = {
    contentType,
    parentDirection,
    direction,
    alignX,
    alignY,
    equalCols,
    gap,
    extraStyles: extendCss,
  }

  return (
    <Styled
      as={tag}
      $contentType={contentType}
      $element={stylingProps}
      {...debugProps}
      {...props}
    />
  )
}

export default memo(Component)
