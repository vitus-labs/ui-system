import React, { useRef, useState, useEffect, useContext } from 'react'
import { config, renderContent, throttle } from '@vitus-labs/core'
import { value } from '@vitus-labs/unistyle'
import Portal from '~/Portal'
import Util from '~/Util'

interface Props {
  children: React.ReactNode
  trigger: React.ReactNode
  refName?: string
  isOpen?: boolean
  openOn?: 'click' | 'triggerClick' | 'hover' | 'manual'
  closeOn?: 'click' | 'triggerClick' | 'hover' | 'manual'
  type?: 'dropdown' | 'tooltip' | 'popover' | 'modal'
  position?: 'absolute' | 'fixed' | 'relative' | 'static'
  align?: 'bottom' | 'top' | 'left' | 'bottom' | 'right'
  alignX?: 'left' | 'center' | 'right'
  alignY?: 'bottom' | 'top' | 'center'
  offsetX?: number
  offsetY?: number
  throttleDelay?: number
}

type OverlayPosition = {
  position: 'absolute' | 'fixed' | 'static' | 'relative'
  top?: number | string
  bottom?: number | string
  left?: number | string
  right?: number | string
  transformY?: string
  transformX?: string
}

const component = ({
  children,
  trigger,
  refName = 'ref',
  isOpen = false,
  openOn = 'click', // click | hover
  closeOn = 'click', // click | triggerClick | hover | manual
  type = 'dropdown', // dropdown | tooltip | popover | modal
  align = 'bottom', // * main align prop * top | left | bottom | right
  position = 'fixed', // absolute | fixed | relative | static
  alignX = 'left', // left | center | right
  alignY = 'bottom', // top | center | bottom
  offsetX = 0,
  offsetY = 0,
  throttleDelay = 500,
}: Props) => {
  const { rootSize } = useContext(config.context)
  const [visible, setVisible] = useState(isOpen)
  const [overlayPosition, setOverlayPosition] = useState<OverlayPosition>({
    position,
  })
  const triggerRef = useRef<HTMLElement>()
  const contentRef = useRef<HTMLElement>()

  useEffect(() => {
    if (visible) calculateContentPosition()
  }, [visible])

  useEffect(() => {
    if (
      openOn === 'click' ||
      closeOn === 'click' ||
      closeOn === 'triggerClick'
    ) {
      window.addEventListener('click', handleDocumentClick, false)
      window.addEventListener('touchend', handleDocumentClick, false)
    }

    if (openOn === 'hover' || closeOn === 'hover') {
      window.addEventListener('mousemove', handleMouseMoveResize, false)
    }

    window.addEventListener('resize', handleWindowResize, false)

    return () => {
      window.removeEventListener('resize', handleWindowResize, false)
      window.removeEventListener('click', handleDocumentClick, false)
      window.removeEventListener('touchend', handleDocumentClick, false)
      window.removeEventListener('mousemove', handleMouseMoveResize, false)
    }
  })

  const observeTrigger = (e) => {
    if (e && e.target && triggerRef.current) {
      return (
        triggerRef.current.contains(e.target) || e.target === triggerRef.current
      )
    }

    return false
  }

  const observeHoverElement = (e) => {
    if (e && e.target && contentRef.current) {
      return (
        contentRef.current.contains(e.target) || e.target === contentRef.current
      )
    }

    return false
  }

  const showContent = () => {
    setVisible(true)

    if (type === 'modal' && document.body) {
      document.body.style.overflow = 'hidden'
    }
  }

  const hideContent = () => {
    setVisible(false)

    if (type === 'modal' && document.body) {
      document.body.style.overflow = 'auto'
    }
  }

  const calculateContentPosition = () => {
    if (!visible) return
    // if (process.env.node_env !== 'production') {

    // }
    if (!triggerRef.current) {
      return
      // console.error(
      //   `
      //   Error in 'vitus-labs/elements/Overlay'.
      //   Trigger is not correctly using ref. Therefore cannot
      //   be calculated position of content
      //   `
      // )
    }

    const triggerDimensions = triggerRef.current.getBoundingClientRect()
    const contentDimensions = contentRef.current.getBoundingClientRect()

    const overlayPosition: OverlayPosition = {
      position,
    }

    if (type === 'dropdown' || type === 'tooltip' || type === 'popover') {
      if (align === 'top' || align === 'bottom') {
        if (align === 'top') {
          overlayPosition.top =
            triggerDimensions.top +
            offsetY +
            window.scrollY -
            contentDimensions.height
        } else {
          overlayPosition.top =
            triggerDimensions.bottom + offsetY + window.scrollY
        }

        switch (alignX) {
          case 'right':
            overlayPosition.left =
              triggerDimensions.right +
              offsetX +
              window.scrollX -
              contentDimensions.width
            break
          case 'center':
            overlayPosition.left =
              triggerDimensions.left +
              (triggerDimensions.right - triggerDimensions.left) / 2 +
              window.scrollX -
              contentDimensions.width / 2

            break
          case 'left':
          default:
            overlayPosition.left =
              triggerDimensions.left - offsetX + window.scrollX
        }
      } else if (align === 'left' || align === 'right') {
        if (align === 'left') {
          overlayPosition.left =
            triggerDimensions.left -
            offsetX +
            window.scrollX -
            contentDimensions.width
        } else {
          overlayPosition.left =
            triggerDimensions.right + offsetX + window.scrollX
        }
        switch (alignY) {
          case 'top':
            overlayPosition.top =
              triggerDimensions.top - offsetY + window.scrollY
            break
          case 'center':
            overlayPosition.top =
              triggerDimensions.top +
              (triggerDimensions.bottom - triggerDimensions.top) / 2 +
              window.scrollY -
              contentDimensions.height / 2
            break
          case 'bottom':
          default:
            overlayPosition.top =
              triggerDimensions.bottom +
              offsetY +
              window.scrollY -
              contentDimensions.height
        }
      }
    } else if (type === 'modal') {
      switch (alignX) {
        case 'right':
          overlayPosition.right = offsetX
          break
        case 'left':
          overlayPosition.left = offsetX
        case 'center':
        default:
          overlayPosition.left = '50%'
          overlayPosition.transformX = 'translateX(-50%)'
          break
      }
      switch (alignY) {
        case 'top':
          overlayPosition.top = offsetY
          break
        case 'center':
          overlayPosition.top = '50%'
          overlayPosition.transformY = 'translateY(-50%)'
          break
        case 'bottom':
        default:
          overlayPosition.bottom = offsetY
          break
      }
    }

    setOverlayPosition(overlayPosition)
  }

  const handleDocumentClick = (e) => {
    if (!visible) {
      if (openOn === 'hover' && e.type === 'mousemove') {
        if (observeTrigger(e)) {
          showContent()
        }
      }

      if (openOn === 'click' && e.type === 'click') {
        if (observeTrigger(e)) {
          showContent()
        }
      }
    }

    if (visible) {
      if (closeOn === 'hover' && e.type === 'mousemove') {
        if (!observeTrigger(e) && !observeHoverElement(e)) {
          hideContent()
        }
      }

      if (closeOn === 'click' && e.type === 'click') {
        hideContent()
      }

      if (closeOn === 'triggerClick' && e.type === 'click') {
        if (observeTrigger(e)) {
          hideContent()
        }
      }
    }
  }

  const handleWindowResize = throttle(calculateContentPosition, throttleDelay)
  const handleMouseMoveResize = throttle(handleDocumentClick, throttleDelay)

  const getTransformValue = () => {
    let result = ``

    if (overlayPosition.transformX) result += overlayPosition.transformX
    if (overlayPosition.transformY) {
      result += ' '
      result += overlayPosition.transformY
    }

    return result
  }

  const POSITION_STYLE = {
    position: overlayPosition.position,
    top: value(rootSize, [overlayPosition.top]),
    bottom: value(rootSize, [overlayPosition.bottom]),
    left: value(rootSize, [overlayPosition.left]),
    right: value(rootSize, [overlayPosition.right]),
    transform: getTransformValue(),
  }

  const passHandlers = openOn === 'manual' || closeOn === 'manual'

  return (
    <>
      {renderContent(trigger, {
        [refName]: triggerRef,
        active: visible,
        ...(passHandlers ? { showContent, hideContent } : {}),
      })}

      {visible && (
        <Portal>
          <Util style={POSITION_STYLE}>
            {renderContent(children, {
              [refName]: contentRef,
              active: visible,
              ...(passHandlers ? { showContent, hideContent } : {}),
            })}
          </Util>
        </Portal>
      )}
    </>
  )
}

component.displayName = 'vitus-labs/elements/Overlay'

export default component
