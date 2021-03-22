import React, { FC, useRef, useState, useEffect, useContext } from 'react'
import { config, renderContent, throttle } from '@vitus-labs/core'
import { value } from '@vitus-labs/unistyle'
import Portal from '~/Portal'

export type Props = {
  children: React.ReactNode
  trigger: React.ReactNode
  DOMLocation?: HTMLElement
  refName?: string
  triggerRefName?: string
  contentRefName?: string
  isOpen?: boolean
  openOn?: 'click' | 'hover' | 'manual'
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

const component: FC<Props> = ({
  children,
  trigger,
  DOMLocation,
  refName = 'ref',
  triggerRefName,
  contentRefName,
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
}) => {
  const { rootSize } = useContext(config.context) as { rootSize: number }
  const [visible, setVisible] = useState(isOpen)
  const [innerAlign, setInnerAlign] = useState(align)
  const [innerAlignX, setInnerAlignX] = useState(alignX)
  const [innerAlignY, setInnerAlignY] = useState(alignY)
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
    }

    if (openOn === 'hover' || closeOn === 'hover') {
      window.addEventListener('mousemove', handleMouseMove, false)
    }

    window.addEventListener('resize', handleWindow, false)
    window.addEventListener('scroll', handleWindow, false)
    window.addEventListener('scroll', handleMouseMove, false)

    return () => {
      window.removeEventListener('resize', handleWindow, false)
      window.removeEventListener('scroll', handleWindow, false)
      window.removeEventListener('scroll', handleMouseMove, false)
      window.removeEventListener('click', handleDocumentClick, false)
      window.removeEventListener('mousemove', handleMouseMove, false)
    }
  }, [openOn, closeOn, visible])

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
    }

    const triggerDimensions = triggerRef.current.getBoundingClientRect()
    const contentDimensions = contentRef.current.getBoundingClientRect()

    const overlayPosition: OverlayPosition = {
      position,
    }

    if (['dropdown', 'tooltip', 'popover'].includes(type)) {
      if (['top', 'bottom'].includes(align)) {
        const positionTop =
          triggerDimensions.top - offsetY - contentDimensions.height
        const positionBottom = triggerDimensions.bottom + offsetY

        const positionLeft = triggerDimensions.left - offsetX
        const positionRight =
          triggerDimensions.right + offsetX - contentDimensions.width

        if (align === 'top') {
          const isTop = positionTop >= 0

          setInnerAlign(isTop ? 'top' : 'bottom')
          overlayPosition.top = isTop ? positionTop : positionBottom
        } else {
          const isBottom =
            positionBottom + contentDimensions.height <= window.innerHeight

          setInnerAlign(isBottom ? 'bottom' : 'top')
          overlayPosition.top = isBottom ? positionBottom : positionTop
        }

        switch (alignX) {
          case 'right': {
            const isRight = positionRight >= 0

            setInnerAlignX(isRight ? 'right' : 'left')
            overlayPosition.left = isRight ? positionRight : positionLeft

            break
          }
          case 'center': {
            overlayPosition.left =
              triggerDimensions.left +
              (triggerDimensions.right - triggerDimensions.left) / 2 -
              contentDimensions.width / 2
            break
          }
          case 'left':
          default: {
            const isLeft =
              positionLeft + contentDimensions.width <= window.innerWidth

            setInnerAlignX(isLeft ? 'left' : 'right')
            overlayPosition.left = isLeft ? positionLeft : positionRight
            break
          }
        }
      } else if (['left', 'right'].includes(align)) {
        const positionLeft =
          triggerDimensions.left - offsetX - contentDimensions.width
        const positionRight = triggerDimensions.right + offsetX

        const positionTop = triggerDimensions.top + offsetY
        const positionBottom =
          triggerDimensions.bottom - offsetY - contentDimensions.height

        if (align === 'left') {
          const isLeft = positionLeft >= 0

          setInnerAlign(isLeft ? 'left' : 'right')
          overlayPosition.left = isLeft ? positionLeft : positionRight
        } else {
          const isRight =
            positionRight + contentDimensions.width <= window.innerWidth

          setInnerAlign(isRight ? 'right' : 'left')
          overlayPosition.left = isRight ? positionRight : positionLeft
        }

        switch (alignY) {
          case 'top': {
            const isTop =
              positionTop + contentDimensions.height <= window.innerHeight

            setInnerAlignY(isTop ? 'top' : 'bottom')
            overlayPosition.top = isTop ? positionTop : positionBottom
            break
          }
          case 'center':
            overlayPosition.top =
              triggerDimensions.top -
              offsetY +
              (triggerDimensions.bottom - triggerDimensions.top) / 2 -
              contentDimensions.height / 2
            break
          case 'bottom':
          default: {
            const isBottom = positionBottom >= 0

            setInnerAlignY(isBottom ? 'bottom' : 'top')
            overlayPosition.top = isBottom ? positionBottom : positionTop
          }
        }
      }
    } else if (type === 'modal') {
      switch (alignX) {
        case 'right':
          overlayPosition.right = offsetX
          break
        case 'left':
          overlayPosition.left = offsetX
          break
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
    contentRef.current.style.top = value(rootSize, [
      overlayPosition.top,
    ]) as string
    contentRef.current.style.bottom = value(rootSize, [
      overlayPosition.bottom,
    ]) as string
    contentRef.current.style.left = value(rootSize, [
      overlayPosition.left,
    ]) as string
    contentRef.current.style.right = value(rootSize, [
      overlayPosition.right,
    ]) as string
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

      if (closeOn === 'hover' && e.type === 'scroll') {
        hideContent()
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

  const handleWindow = throttle(calculateContentPosition, throttleDelay)
  const handleMouseMove = throttle(handleDocumentClick, throttleDelay)

  const passHandlers = openOn === 'manual' || closeOn === 'manual'

  return (
    <>
      {renderContent(trigger, {
        [triggerRefName || refName]: triggerRef,
        active: visible,
        ...(passHandlers ? { showContent, hideContent } : {}),
      })}

      {__BROWSER__ && visible && (
        <Portal position={DOMLocation}>
          {renderContent(children, {
            [contentRefName || refName]: contentRef,
            active: visible,
            align: innerAlign,
            alignX: innerAlignX,
            alignY: innerAlignY,
            ...(passHandlers ? { showContent, hideContent } : {}),
          })}
        </Portal>
      )}
    </>
  )
}

component.displayName = 'vitus-labs/elements/Overlay'

export default component
