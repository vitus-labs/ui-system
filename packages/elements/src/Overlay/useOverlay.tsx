import { useRef, useState, useEffect, useContext, useCallback } from 'react'
import { throttle, context } from '@vitus-labs/core'
import { value } from '@vitus-labs/unistyle'
import { useOverlayContext } from './context'

type OverlayPosition = {
  position: 'absolute' | 'fixed' | 'static' | 'relative'
  top?: number | string
  bottom?: number | string
  left?: number | string
  right?: number | string
}

type Align = 'bottom' | 'top' | 'left' | 'bottom' | 'right'
type AlignX = 'left' | 'center' | 'right'
type AlignY = 'bottom' | 'top' | 'center'

export type UseOverlayProps = {
  isOpen?: boolean
  openOn?: 'click' | 'hover' | 'manual'
  closeOn?:
    | 'click'
    | 'clickOnTrigger'
    | 'clickOutsideContent'
    | 'hover'
    | 'manual'
  type?: 'dropdown' | 'tooltip' | 'popover' | 'modal'
  position?: 'absolute' | 'fixed' | 'relative' | 'static'
  align?: Align
  alignX?: AlignX
  alignY?: AlignY
  offsetX?: number
  offsetY?: number
  throttleDelay?: number
  customScrollListener?: HTMLElement
  closeOnEsc?: boolean
  disabled?: boolean
}

export default ({
  isOpen = false,
  openOn = 'click', // click | hover
  closeOn = 'click', // click | 'clickOnTrigger' | 'clickOutsideContent' | hover | manual
  type = 'dropdown', // dropdown | tooltip | popover | modal
  align = 'bottom', // * main align prop * top | left | bottom | right
  position = 'fixed', // absolute | fixed | relative | static
  alignX = 'left', // left | center | right
  alignY = 'bottom', // top | center | bottom
  offsetX = 0,
  offsetY = 0,
  throttleDelay = 200,
  customScrollListener,
  closeOnEsc = true,
  disabled,
}: UseOverlayProps) => {
  const { rootSize } = useContext(context) as { rootSize: number }
  const ctx = useOverlayContext()
  const [blocked, handleBlocked] = useState(false)
  const [visible, setVisible] = useState(isOpen)
  const [innerAlign, setInnerAlign] = useState(align)
  const [innerAlignX, setInnerAlignX] = useState(alignX)
  const [innerAlignY, setInnerAlignY] = useState(alignY)
  const triggerRef = useRef<HTMLElement>()
  const contentRef = useRef<HTMLElement>()

  const setBlocked = useCallback(() => handleBlocked(true), [])
  const setUnblocked = useCallback(() => handleBlocked(false), [])

  // if an Overlay has an Overlay child, this will prevent closing parent child
  useEffect(() => {
    if (visible && ctx?.setBlocked) ctx.setBlocked()
    else if (!visible && ctx?.setUnblocked) ctx.setUnblocked()
  }, [visible])

  // calculate correct position when an Overlay is opened
  useEffect(() => {
    if (visible) calculateContentPosition()
  }, [visible])

  // handles calculationg correct position of content
  // on document events (or custom scroll if set)
  useEffect(() => {
    if (visible) {
      window.addEventListener('resize', handleContentPosition, false)
      window.addEventListener('scroll', handleContentPosition, false)

      if (customScrollListener) {
        customScrollListener.addEventListener(
          'scroll',
          handleContentPosition,
          false
        )
      }
    }

    return () => {
      window.removeEventListener('resize', handleContentPosition, false)
      window.removeEventListener('scroll', handleContentPosition, false)

      if (customScrollListener) {
        customScrollListener.removeEventListener(
          'scroll',
          handleContentPosition,
          false
        )
      }
    }
  }, [visible, customScrollListener])

  // make sure scrolling is blocked in case of modal windows or when
  // customScroll is set
  useEffect(() => {
    if (visible) {
      if (__BROWSER__ && customScrollListener) {
        // eslint-disable-next-line no-param-reassign
        customScrollListener.style.overflow = 'hidden'
      } else if (__BROWSER__ && type === 'modal' && document.body) {
        document.body.style.overflow = 'hidden'
      }
    }

    return () => {
      if (__BROWSER__ && customScrollListener) {
        // eslint-disable-next-line no-param-reassign
        customScrollListener.style.overflow = ''
      } else if (__BROWSER__ && type === 'modal' && document.body) {
        document.body.style.overflow = ''
      }
    }
  }, [visible, type, customScrollListener])

  useEffect(() => {
    // enable overlay manipulation only when the state is NOT blocked=true
    // nor in disabled state
    if (!blocked || !disabled) {
      if (
        openOn === 'click' ||
        closeOn === 'click' ||
        closeOn === 'clickOnTrigger' ||
        closeOn === 'clickOutsideContent'
      ) {
        window.addEventListener('click', handleVisibilityByEventType, false)
      }

      if (openOn === 'hover' || closeOn === 'hover') {
        window.addEventListener('mousemove', handleMouseMove, false)
      }

      // only when content is visible
      if (visible) {
        if (customScrollListener) {
          customScrollListener.addEventListener(
            'scroll',
            handleMouseMove,
            false
          )
        }

        window.addEventListener('scroll', handleMouseMove, false)

        if (closeOnEsc) {
          window.addEventListener('keydown', handleEscKey)
        }
      }
    }

    return () => {
      window.removeEventListener('scroll', handleMouseMove, false)
      window.removeEventListener('click', handleVisibilityByEventType, false)
      window.removeEventListener('mousemove', handleMouseMove, false)

      if (closeOnEsc) {
        window.removeEventListener('keydown', handleEscKey)
      }

      if (customScrollListener) {
        customScrollListener.removeEventListener(
          'scroll',
          handleMouseMove,
          false
        )
      }
    }
  }, [openOn, closeOn, visible, blocked, disabled])

  const observeTrigger = (e) => {
    if (e && e.target && triggerRef.current) {
      return (
        triggerRef.current.contains(e.target) || e.target === triggerRef.current
      )
    }

    return false
  }

  const observeContent = (e) => {
    if (e && e.target && contentRef.current) {
      return (
        contentRef.current.contains(e.target) || e.target === contentRef.current
      )
    }

    return false
  }

  const showContent = useCallback(() => {
    setVisible(true)
  }, [])

  const hideContent = useCallback(() => {
    setVisible(false)
  }, [])

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
    contentRef.current.style.top = value(
      [overlayPosition.top],
      rootSize
    ) as string
    contentRef.current.style.bottom = value(
      [overlayPosition.bottom],
      rootSize
    ) as string
    contentRef.current.style.left = value(
      [overlayPosition.left],
      rootSize
    ) as string
    contentRef.current.style.right = value(
      [overlayPosition.right],
      rootSize
    ) as string
  }

  const handleVisibilityByEventType = (e) => {
    if (!visible && !disabled) {
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
        if (!observeTrigger(e) && !observeContent(e)) {
          hideContent()
        }
      }

      if (closeOn === 'hover' && e.type === 'scroll') {
        hideContent()
      }

      if (closeOn === 'click' && e.type === 'click') {
        hideContent()
      }

      if (closeOn === 'clickOnTrigger' && e.type === 'click') {
        if (observeTrigger(e)) {
          hideContent()
        }
      }

      if (closeOn === 'clickOutsideContent' && e.type === 'click') {
        if (!observeContent(e)) {
          hideContent()
        }
      }
    }
  }

  const handleContentPosition = throttle(
    calculateContentPosition,
    throttleDelay
  )
  const handleMouseMove = throttle(handleVisibilityByEventType, throttleDelay)
  const handleEscKey = (e: any) => {
    if (e.key === 'Escape') {
      hideContent()
    }
  }

  return {
    triggerRef,
    contentRef,
    active: visible,
    align: innerAlign,
    alignX: innerAlignX,
    alignY: innerAlignY,
    showContent,
    hideContent,
    blocked,
    setBlocked,
    setUnblocked,
  }
}
