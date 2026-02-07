/**
 * Memoized content area used inside Element to render one of the three
 * layout slots (before, content, after). Passes alignment, direction,
 * gap, and equalCols styling props to the underlying styled component.
 * Adds a `data-vl-element` attribute in development for debugging.
 */
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
