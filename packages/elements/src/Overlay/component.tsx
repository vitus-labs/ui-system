import React, { useRef, useState, useEffect, useContext } from 'react'
import { config, renderContent, throttle } from '@vitus-labs/core'
import { value } from '@vitus-labs/unistyle'
import Portal from '~/Portal'

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
  throttleDelay = 200,
}: Props) => {
  const { rootSize } = useContext(config.context)
  const [visible, setVisible] = useState(isOpen)
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
    window.addEventListener('scroll', handleWindowResize, false)

    return () => {
      window.removeEventListener('resize', handleWindowResize, false)
      window.addEventListener('scroll', handleWindowResize, false)
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

    if (!triggerRef.current || !contentRef.current) {
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
        const positionTop =
          triggerDimensions.top - offsetY - contentDimensions.height
        const positionBottom = triggerDimensions.bottom + offsetY

        if (align === 'top') {
          overlayPosition.top = positionTop >= 0 ? positionTop : positionBottom
        } else {
          overlayPosition.top =
            positionBottom + contentDimensions.height <= window.innerHeight
              ? positionBottom
              : positionTop
        }

        switch (alignX) {
          case 'right':
            overlayPosition.left =
              triggerDimensions.right + offsetX - contentDimensions.width
            break
          case 'center':
            overlayPosition.left =
              triggerDimensions.left +
              (triggerDimensions.right - triggerDimensions.left) / 2 -
              contentDimensions.width / 2
            break
          case 'left':
          default:
            overlayPosition.left = triggerDimensions.left - offsetX
        }
      } else if (align === 'left' || align === 'right') {
        const positionLeft =
          triggerDimensions.left - offsetX - contentDimensions.width

        const positionRight = triggerDimensions.right + offsetX

        if (align === 'left') {
          overlayPosition.left =
            positionLeft >= 0 ? positionLeft : positionRight
        } else {
          overlayPosition.left =
            positionRight + contentDimensions.width <= window.innerWidth
              ? positionRight
              : positionLeft
        }

        switch (alignY) {
          case 'top':
            overlayPosition.top = triggerDimensions.top + offsetY
            break
          case 'center':
            overlayPosition.top =
              triggerDimensions.top -
              offsetY +
              (triggerDimensions.bottom - triggerDimensions.top) / 2 -
              contentDimensions.height / 2
            break
          case 'bottom':
          default:
            overlayPosition.top =
              triggerDimensions.bottom - offsetY - contentDimensions.height
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
          overlayPosition.left =
            window.innerWidth / 2 - contentDimensions.width / 2
          break
      }
      switch (alignY) {
        case 'top':
          overlayPosition.top = offsetY
          break
        case 'center':
          overlayPosition.top =
            window.innerHeight / 2 - contentDimensions.height / 2
          break
        case 'bottom':
        default:
          overlayPosition.bottom = offsetY
          break
      }
    }

    // ADD POSITION STYLES TO CONTENT
    contentRef.current.style.position = overlayPosition.position
    contentRef.current.style.top = value(rootSize, [overlayPosition.top])
    contentRef.current.style.bottom = value(rootSize, [overlayPosition.bottom])
    contentRef.current.style.left = value(rootSize, [overlayPosition.left])
    contentRef.current.style.right = value(rootSize, [overlayPosition.right])
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
          {renderContent(children, {
            [refName]: contentRef,
            active: visible,
            ...(passHandlers ? { showContent, hideContent } : {}),
          })}
        </Portal>
      )}
    </>
  )
}

component.displayName = 'vitus-labs/elements/Overlay'

export default component
