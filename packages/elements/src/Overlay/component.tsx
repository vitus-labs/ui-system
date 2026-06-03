/**
 * Overlay component that renders a trigger element and conditionally shows
 * content via a Portal. The trigger receives a ref and optional show/hide
 * callbacks; the content is positioned and managed by the useOverlay hook.
 * A context Provider wraps the content to support nested overlays (e.g.,
 * a dropdown inside another dropdown) via blocked-state propagation.
 */
import { render } from '@vitus-labs/core'
import { type ReactNode, useId } from 'react'
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

  // Primitives — useMemo overhead exceeds recomputation cost.
  const passHandlers =
    openOn === 'manual' ||
    closeOn === 'manual' ||
    closeOn === 'clickOutsideContent'

  const ariaHasPopup =
    type === 'modal'
      ? ('dialog' as const)
      : type === 'tooltip'
        ? ('true' as const)
        : ('menu' as const)

  const triggerProps: Record<string, unknown> = {
    [triggerRefName]: triggerRef,
    active,
    'aria-expanded': active,
    'aria-haspopup': ariaHasPopup,
    'aria-controls': active ? contentId : undefined,
  }
  if (passHandlers) {
    triggerProps.showContent = showContent
    triggerProps.hideContent = hideContent
  }

  return (
    <>
      {render(trigger, triggerProps)}

      {IS_BROWSER &&
        active &&
        (() => {
          const contentProps: Record<string, unknown> = {
            [contentRefName]: contentRef,
            id: contentId,
            role: type === 'modal' ? 'dialog' : undefined,
            'aria-modal': type === 'modal' ? true : undefined,
            active,
            align,
            alignX,
            alignY,
          }
          if (passHandlers) {
            contentProps.showContent = showContent
            contentProps.hideContent = hideContent
          }
          return (
            <Portal DOMLocation={DOMLocation}>
              <Provider {...ctx}>{render(children, contentProps)}</Provider>
            </Portal>
          )
        })()}
    </>
  )
}

const name = `${PKG_NAME}/Overlay` as const

Component.displayName = name
Component.pkgName = PKG_NAME
Component.VITUS_LABS__COMPONENT = name

export default Component
