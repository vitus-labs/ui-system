import React, { useMemo, ReactNode } from 'react'
import { render } from '@vitus-labs/core'
import { PKG_NAME } from '~/constants'
import Portal from '~/Portal'
import type { VLComponent, Content } from '~/types'
import useOverlay, { UseOverlayProps } from './useOverlay'
import Provider from './context'

type Align = 'bottom' | 'top' | 'left' | 'bottom' | 'right'
type AlignX = 'left' | 'center' | 'right'
type AlignY = 'bottom' | 'top' | 'center'

type TriggerRenderer = (
  props: Partial<{
    active: boolean
    showContent: () => void
    hideContent: () => void
  }>
) => ReactNode

type ContentRenderer = (
  props: Partial<{
    active: boolean
    showContent: () => void
    hideContent: () => void
    align: Align
    alignX: AlignX
    alignY: AlignY
  }>
) => ReactNode

export type Props = {
  children: Content | TriggerRenderer
  trigger: Content | ContentRenderer
  DOMLocation?: HTMLElement
  triggerRefName?: string
  contentRefName?: string
} & UseOverlayProps

const component: VLComponent<Props> = ({
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
    ...ctx
  } = useOverlay(props)

  const { openOn, closeOn } = props

  const passHandlers = useMemo(
    () =>
      openOn === 'manual' ||
      closeOn === 'manual' ||
      closeOn === 'clickOutsideContent',
    [openOn, closeOn]
  )

  return (
    <>
      {render(trigger, {
        [triggerRefName]: triggerRef,
        active,
        ...(passHandlers ? { showContent, hideContent } : {}),
      })}

      {__BROWSER__ && active && (
        <Portal position={DOMLocation}>
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

component.displayName = name
component.pkgName = PKG_NAME
component.VITUS_LABS__COMPONENT = name

export default component
