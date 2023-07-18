import React, { useMemo, ReactNode } from 'react'
import { render } from '@vitus-labs/core'
import { PKG_NAME } from '~/constants'
import Portal from '~/Portal'
import type { VLComponent, Content } from '~/types'
import useOverlay, { UseOverlayProps } from './useOverlay'

const IS_BROWSER = typeof window !== 'undefined'

type Align = 'bottom' | 'top' | 'left' | 'bottom' | 'right'
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
  children: Content | TriggerRenderer
  /**
   * React component to be used as a trigger (e.g. `Button` for opening
   * dropdowns). Component must acept accept `ref` or any other prop name
   * defined in `triggerRefName` prop.
   */
  trigger: Content | ContentRenderer
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

  const { openOn, closeOn } = props

  const passHandlers = useMemo(
    () =>
      openOn === 'manual' ||
      closeOn === 'manual' ||
      closeOn === 'clickOutsideContent',
    [openOn, closeOn],
  )

  return (
    <>
      {render(trigger, {
        [triggerRefName]: triggerRef,
        active,
        ...(passHandlers ? { showContent, hideContent } : {}),
      })}

      {IS_BROWSER && active && (
        <Portal DOMLocation={DOMLocation}>
          <Provider {...ctx}>
            {render(children, {
              [contentRefName]: contentRef,
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
