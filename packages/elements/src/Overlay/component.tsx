import React, { useRef, useState, useEffect } from 'react'
import { renderContent, throttle } from '@vitus-labs/core'
import Portal from '~/Portal'
import Util from './styled'

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

const component = ({
  children,
  trigger,
  refName = 'ref',
  openOn = 'click', // click | hover
  closeOn = 'click', // click | triggerClick | hover | manual
  type = 'dropdown', // dropdown | tooltip | popover | modal
  align = 'bottom', // * main align prop * top | left | bottom | right
  position = 'absolute', // absolute | fixed | relative | static
  alignX = 'left', // left | center | right
  alignY = 'bottom', // top | center | bottom
  offsetX = 20,
  offsetY = 20,
  throttleDelay = 200,
}: Props) => {
  const [visible, setVisible] = useState(false)
  const [theme, setTheme] = useState({})
  const triggerRef = useRef<HTMLElement>()
  const contentRef = useRef<HTMLElement>()

  useEffect(() => {
    calculateContentPosition()
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
      window.addEventListener(
        'mousemove',
        throttle(handleDocumentClick, throttleDelay),
        false
      )
    }

    return () => {
      window.removeEventListener('click', handleDocumentClick, false)
      window.removeEventListener('touchend', handleDocumentClick, false)
      window.removeEventListener(
        'mousemove',
        throttle(handleDocumentClick, throttleDelay),
        false
      )
    }
  }, [visible])

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
    calculateContentPosition()

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

    type Theme = {
      position: 'absolute' | 'fixed' | 'static' | 'relative'
      top?: number | string
      bottom?: number | string
      left?: number | string
      right?: number | string
      transformY?: string
      transformX?: string
    }
    const theme: Theme = { position }

    if (type === 'dropdown' || type === 'tooltip' || type === 'popover') {
      if (align === 'top' || align === 'bottom') {
        if (align === 'top') {
          theme.top = dimensions.top + offsetY + window.scrollY
          theme.transformY = 'translateY(-100%)'
        } else {
          theme.top = dimensions.bottom + offsetY + window.scrollY
        }

        switch (alignX) {
          case 'right':
            theme.left = dimensions.right + offsetX + window.scrollX
            theme.transformX = 'translateX(-100%)'
            break
          case 'center':
            theme.left =
              dimensions.left +
              (dimensions.right - dimensions.left) / 2 +
              window.scrollX
            theme.transformX = 'translateX(-50%)'
            break
          case 'left':
          default:
            theme.left = dimensions.left - offsetX + window.scrollX
        }
      } else if (align === 'left' || align === 'right') {
        if (align === 'left') {
          theme.left = dimensions.left - offsetX + window.scrollX
          theme.transformX = 'translateX(-100%)'
        } else {
          theme.left = dimensions.right + offsetX + window.scrollX
        }
        switch (alignY) {
          case 'top':
            theme.top = dimensions.top - offsetY + window.scrollY
            break
          case 'center':
            theme.top =
              dimensions.top +
              (dimensions.bottom - dimensions.top) / 2 +
              window.scrollY
            theme.transformY = 'translateY(-50%)'
            break
          case 'bottom':
          default:
            theme.top = dimensions.bottom + offsetY + window.scrollY
        }
      }
    } else if (type === 'modal') {
      switch (alignX) {
        case 'right':
          theme.right = offsetX
          // theme.transform = 'translateX(-100%)'
          break
        case 'left':
          theme.left = offsetX
        case 'center':
        default:
          theme.left = '50%'
          theme.transformX = 'translateX(-50%)'
          break
      }
      switch (alignY) {
        case 'top':
          theme.top = offsetY
          break
        case 'center':
          theme.top = '50%'
          theme.transformY = 'translateY(-50%)'
          break
        case 'bottom':
        default:
          theme.bottom = offsetY
          break
      }
    }

    setTheme(theme)
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

  return (
    <>
      {renderContent(trigger, {
        [refName]: triggerRef,
        active: visible,
      })}

      {visible && (
        <Portal>
          <Util $overlay={theme}>
            {renderContent(children, {
              [refName]: contentRef,
              active: visible,
              // alignX,
              // alignY,
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
