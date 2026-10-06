/**
 * Overlay component that renders a trigger element and conditionally shows
 * content via a Portal. The trigger receives a ref and optional show/hide
 * callbacks; the content is positioned and managed by the useOverlay hook.
 * A context Provider wraps the content to support nested overlays (e.g.,
 * a dropdown inside another dropdown) via blocked-state propagation.
 */
import { render } from '@vitus-labs/core'
import { isValidElement, type ReactNode, useId } from 'react'
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

  const isTooltip = type === 'tooltip'

  // dialog for modal/popover, menu for dropdowns, generic popup otherwise.
  const ariaHasPopup =
    type === 'modal' || type === 'popover'
      ? ('dialog' as const)
      : type === 'dropdown'
        ? ('menu' as const)
        : ('true' as const)

  // DOM element children (`<div />`) must not receive component-level props
  // (active/align/alignX/...) — React warns about unknown DOM props and the
  // user's own alignX would be overridden.
  const isDomNode = (node: unknown): boolean =>
    isValidElement(node) && typeof node.type === 'string'

  const triggerProps: Record<string, unknown> = {
    [triggerRefName]: triggerRef,
  }
  if (isTooltip) {
    triggerProps['aria-describedby'] = active ? contentId : undefined
  } else {
    triggerProps['aria-expanded'] = active
    triggerProps['aria-haspopup'] = ariaHasPopup
    triggerProps['aria-controls'] = active ? contentId : undefined
  }
  if (!isDomNode(trigger)) {
    triggerProps.active = active
    if (passHandlers) {
      triggerProps.showContent = showContent
      triggerProps.hideContent = hideContent
    }
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
            role:
              type === 'modal' ? 'dialog' : isTooltip ? 'tooltip' : undefined,
            'aria-modal': type === 'modal' ? true : undefined,
          }
          if (!isDomNode(children)) {
            contentProps.active = active
            contentProps.align = align
            contentProps.alignX = alignX
            contentProps.alignY = alignY
            if (passHandlers) {
              contentProps.showContent = showContent
              contentProps.hideContent = hideContent
            }
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
