/**
 * Overlay component that renders a trigger element and conditionally shows
 * content via a Portal. The trigger receives a ref and optional show/hide
 * callbacks; the content is positioned and managed by the useOverlay hook.
 * A context Provider wraps the content to support nested overlays (e.g.,
 * a dropdown inside another dropdown) via blocked-state propagation.
 */
import { render } from '@vitus-labs/core'
import { type ReactNode, useId, useMemo } from 'react'
import { PKG_NAME } from '~/constants'
import Portal from '~/Portal'
import type { Content, VLComponent } from '~/types'
import useOverlay, { type UseOverlayProps } from './useOverlay'

const IS_BROWSER = typeof window !== 'undefined'

type Align = 'bottom' | 'top' | 'left' | 'right'
type AlignX = 'left' | 'center' | 'right'
type AlignY = 'bottom' | 'top' | 'center'

type TriggerRenderer = (
  props: Partial<{
    active: boolean
    showContent: () => void
    hideContent: () => void
  }>,
) => ReactNode

type ContentRenderer = (
  props: Partial<{
    active: boolean
    showContent: () => void
    hideContent: () => void
    align: Align
    alignX: AlignX
    alignY: AlignY
  }>,
) => ReactNode

export type Props = {
  /**
   * Children to be rendered within **Overlay** component when Overlay is active.
   */
  children: ContentRenderer | Content
  /**
   * React component to be used as a trigger (e.g. `Button` for opening
   * dropdowns). Component must acept accept `ref` or any other prop name
   * defined in `triggerRefName` prop.
   */
  trigger: TriggerRenderer | Content
  /**
   * Defines a HTML DOM where children to be appended. Component uses JavaScript
   * [`Node.appendChild`](https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild)
   *
   * For more information follow [Portal](https://vitus-labs.com/docs/ui-system/elements/portal)
   * component.
   */
  DOMLocation?: HTMLElement
  /**
   * Defines a prop name to be used for passing `ref` for **trigger**. By default,
   * the value is `ref`.
   */
  triggerRefName?: string
  /**
   * Defines a prop name to be used for passing `ref` for **content** (passed `children`).
   * By default, the value is `ref`.
   */
  contentRefName?: string
} & UseOverlayProps

const Component: VLComponent<Props> = ({
  children,
  trigger,
  DOMLocation,
  triggerRefName = 'ref',
  contentRefName = 'ref',
  ...props
}) => {
  const {
    active,
    triggerRef,
    contentRef,
    showContent,
    hideContent,
    align,
    alignX,
    alignY,
    Provider,
    ...ctx
  } = useOverlay(props)

  const { openOn, closeOn, type } = props
  const contentId = useId()

  const passHandlers = useMemo(
    () =>
      openOn === 'manual' ||
      closeOn === 'manual' ||
      closeOn === 'clickOutsideContent',
    [openOn, closeOn],
  )

  const ariaHasPopup = useMemo(() => {
    switch (type) {
      case 'modal':
        return 'dialog' as const
      case 'tooltip':
        return 'true' as const
      default:
        return 'menu' as const
    }
  }, [type])

  return (
    <>
      {render(trigger, {
        [triggerRefName]: triggerRef,
        active,
        'aria-expanded': active,
        'aria-haspopup': ariaHasPopup,
        'aria-controls': active ? contentId : undefined,
        ...(passHandlers ? { showContent, hideContent } : {}),
      })}

      {IS_BROWSER && active && (
        <Portal DOMLocation={DOMLocation}>
          <Provider {...ctx}>
            {render(children, {
              [contentRefName]: contentRef,
              id: contentId,
              role: type === 'modal' ? 'dialog' : undefined,
              'aria-modal': type === 'modal' ? true : undefined,
              active,
              align,
              alignX,
              alignY,
              ...(passHandlers ? { showContent, hideContent } : {}),
            })}
          </Provider>
        </Portal>
      )}
    </>
  )
}

const name = `${PKG_NAME}/Overlay` as const

Component.displayName = name
Component.pkgName = PKG_NAME
Component.VITUS_LABS__COMPONENT = name

export default Component
