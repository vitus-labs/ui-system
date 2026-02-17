/**
 * Memoized content area used inside Element to render one of the three
 * layout slots (before, content, after). Passes alignment, direction,
 * gap, and equalCols styling props to the underlying styled component.
 * Adds a `data-vl-element` attribute in development for debugging.
 *
 * Children are passed as raw content and rendered inside the memo boundary
 * via core `render()` — this lets React.memo skip re-renders when the
 * content reference is stable (common for component-type or string content).
 */
import { render } from '@vitus-labs/core'
import type { FC } from 'react'
import { memo, useMemo } from 'react'
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
  children,
  ...props
}) => {
  const debugProps = IS_DEVELOPMENT
    ? {
        'data-vl-element': contentType,
      }
    : {}

  const stylingProps = useMemo(
    () => ({
      contentType,
      parentDirection,
      direction,
      alignX,
      alignY,
      equalCols,
      gap,
      extraStyles: extendCss,
    }),
    [
      contentType,
      parentDirection,
      direction,
      alignX,
      alignY,
      equalCols,
      gap,
      extendCss,
    ],
  )

  return (
    <Styled
      as={tag}
      $contentType={contentType}
      $element={stylingProps}
      {...debugProps}
      {...props}
    >
      {render(children)}
    </Styled>
  )
}

export default memo(Component)
