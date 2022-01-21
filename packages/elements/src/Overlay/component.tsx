import React, { useMemo } from 'react'
import { renderContent } from '@vitus-labs/core'
import { PKG_NAME } from '~/constants'
import Portal from '~/Portal'
import type { VLComponent, Content } from '~/types'
import useOverlay, { UseOverlayProps } from './useOverlay'

type Align = 'bottom' | 'top' | 'left' | 'bottom' | 'right'
type AlignX = 'left' | 'center' | 'right'
type AlignY = 'bottom' | 'top' | 'center'

type TriggerRenderer = (
  props: Partial<{
    active: boolean
    showContent: () => void
    hideContent: () => void
  }>
) => Content

type ContentRenderer = (
  props: Partial<{
    active: boolean
    showContent: () => void
    hideContent: () => void
    align: Align
    alignX: AlignX
    alignY: AlignY
  }>
) => Content

export type Props = {
  children: Content | TriggerRenderer
  trigger: Content | ContentRenderer
  DOMLocation?: HTMLElement
  triggerRefName?: string
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
  } = useOverlay(props)

  const passHandlers = useMemo(
    () =>
      props.openOn === 'manual' ||
      props.closeOn === 'manual' ||
      props.closeOn === 'clickOutsideContent',
    [props.openOn, props.closeOn]
  )

  return (
    <>
      {renderContent(trigger, {
        [triggerRefName]: triggerRef,
        active,
        ...(passHandlers ? { showContent, hideContent } : {}),
      })}

      {__BROWSER__ && active && (
        <Portal position={DOMLocation}>
          {renderContent(children, {
            [contentRefName]: contentRef,
            active,
            align,
            alignX,
            alignY,
            ...(passHandlers ? { showContent, hideContent } : {}),
          })}
        </Portal>
      )}
    </>
  )
}

const name = `${PKG_NAME}/Ovelay` as const

Component.displayName = name
Component.pkgName = PKG_NAME
Component.VITUS_LABS__COMPONENT = name

export default Component
