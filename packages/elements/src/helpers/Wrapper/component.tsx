/**
 * Wrapper component that serves as the outermost styled container for Element.
 * On web, it detects button/fieldset/legend tags and applies a two-layer flex fix
 * (parent + child Styled) because these HTML elements do not natively
 * support `display: flex` consistently across browsers.
 */
import { memo, useMemo } from 'react'
import { IS_DEVELOPMENT } from '~/utils'
import Styled from './styled'
import type { Props } from './types'
import { isWebFixNeeded } from './utils'

const DEV_PROPS: Record<string, string> | null = IS_DEVELOPMENT
  ? { 'data-vl-element': 'Element' }
  : null

const Component = ({
  children,
  ref,
  tag,
  block,
  extendCss,
  direction,
  alignX,
  alignY,
  equalCols,
  isInline,
  ...props
}: Partial<Props> & { ref?: any }) => {
  const needsFix = __WEB__
    ? !props.dangerouslySetInnerHTML && isWebFixNeeded(tag)
    : false

  // Collapsed from three separate `useMemo` calls into one — the previous
  // version paid the dep-array compare cost for all three on every render
  // even though only one shape is used. One memo, one dep set, one allocation.
  const $element = useMemo(() => {
    if (!__WEB__ || !needsFix) {
      return {
        block,
        direction,
        alignX,
        alignY,
        equalCols,
        extraStyles: extendCss,
      }
    }
    return {
      parent: { parentFix: true as const, block, extraStyles: extendCss },
      child: { childFix: true as const, direction, alignX, alignY, equalCols },
    }
  }, [needsFix, block, direction, alignX, alignY, equalCols, extendCss])

  if (!needsFix || __NATIVE__) {
    return (
      <Styled
        {...props}
        {...DEV_PROPS}
        ref={ref}
        as={tag}
        $element={$element as Record<string, unknown>}
      >
        {children}
      </Styled>
    )
  }

  const asTag = __WEB__ ? (isInline ? 'span' : 'div') : undefined
  const fix = $element as {
    parent: Record<string, unknown>
    child: Record<string, unknown>
  }

  return (
    <Styled {...props} {...DEV_PROPS} ref={ref} as={tag} $element={fix.parent}>
      <Styled as={asTag} $childFix $element={fix.child}>
        {children}
      </Styled>
    </Styled>
  )
}

export default memo(Component)
