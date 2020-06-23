import React, { useRef, useState, useEffect, useContext } from 'react'
import { config, renderContent, throttle } from '@vitus-labs/core'
import { value } from '@vitus-labs/unistyle'
import Portal from '~/Portal'
import Util from '~/Util'

interface Props {
  children: React.ReactNode
  trigger: React.ReactNode
  refName?: string
  openOn?: 'click' | 'triggerClick' | 'hover'
  closeOn?: 'click' | 'triggerClick' | 'hover'
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
  const [visible, setVisible] = useState(false)
  const [overlayPosition, setOverlayPosition] = useState<OverlayPosition>({
    position,
  })
  const triggerRef = useRef<HTMLElement>()
  const contentRef = useRef<HTMLElement>()

  useEffect(() => {
    calculateContentPosition()
  }, [])

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
      window.addEventListener(
        'mousemove',
        throttle(handleDocumentClick, throttleDelay),
        false
      )
    }

    window.addEventListener(
      'resize',
      throttle(calculateContentPosition, throttleDelay),
      false
    )

    return () => {
      window.removeEventListener(
        'resize',
        throttle(calculateContentPosition, throttleDelay),
        false
      )
      window.removeEventListener('click', handleDocumentClick, false)
      window.removeEventListener('touchend', handleDocumentClick, false)
      window.removeEventListener(
        'mousemove',
        throttle(handleDocumentClick, throttleDelay),
        false
      )
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
    // if (process.env.node_env !== 'production') {

    // }
    if (!triggerRef.current) {
      console.error(
        `
        Error in 'vitus-labs/elements/Overlay'.
        Trigger is not correctly using ref. Therefore cannot
        be calculated position of content
        `
      )

      return
    }
    const dimensions = triggerRef.current.getBoundingClientRect()

    const overlayPosition: OverlayPosition = {
      position,
    }

    if (type === 'dropdown' || type === 'tooltip' || type === 'popover') {
      if (align === 'top' || align === 'bottom') {
        if (align === 'top') {
          overlayPosition.top = dimensions.top + offsetY + window.scrollY
          overlayPosition.transformY = 'translateY(-100%)'
        } else {
          overlayPosition.top = dimensions.bottom + offsetY + window.scrollY
        }

        switch (alignX) {
          case 'right':
            overlayPosition.left = dimensions.right + offsetX + window.scrollX
            overlayPosition.transformX = 'translateX(-100%)'
            break
          case 'center':
            overlayPosition.left =
              dimensions.left +
              (dimensions.right - dimensions.left) / 2 +
              window.scrollX
            overlayPosition.transformX = 'translateX(-50%)'
            break
          case 'left':
          default:
            overlayPosition.left = dimensions.left - offsetX + window.scrollX
        }
      } else if (align === 'left' || align === 'right') {
        if (align === 'left') {
          overlayPosition.left = dimensions.left - offsetX + window.scrollX
          overlayPosition.transformX = 'translateX(-100%)'
        } else {
          overlayPosition.left = dimensions.right + offsetX + window.scrollX
        }
        switch (alignY) {
          case 'top':
            overlayPosition.top = dimensions.top - offsetY + window.scrollY
            break
          case 'center':
            overlayPosition.top =
              dimensions.top +
              (dimensions.bottom - dimensions.top) / 2 +
              window.scrollY
            overlayPosition.transformY = 'translateY(-50%)'
            break
          case 'bottom':
          default:
            overlayPosition.top = dimensions.bottom + offsetY + window.scrollY
        }
      }
    } else if (type === 'modal') {
      switch (alignX) {
        case 'right':
          overlayPosition.right = offsetX
          // overlayPosition.transform = 'translateX(-100%)'
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

  const TRANSFORM = () => {
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
    transform: TRANSFORM(),
  }

  return (
    <>
      {renderContent(trigger, {
        [refName]: triggerRef,
        active: visible,
      })}

      {visible && (
        <Portal>
          <Util style={POSITION_STYLE}>
            {renderContent(children, {
              [refName]: contentRef,
              active: visible,
              showContent,
              hideContent,
            })}
          </Util>
        </Portal>
      )}
    </>
  )
}

component.displayName = 'vitus-labs/elements/Overlay'

export default component
