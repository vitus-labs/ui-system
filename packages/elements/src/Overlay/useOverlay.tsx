/* eslint-disable no-console */
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
  customScrollListener?: HTMLElement | null
  closeOnEsc?: boolean
  disabled?: boolean
  onOpen?: () => void
  onClose?: () => void
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
  onOpen,
  onClose,
}: UseOverlayProps) => {
  const { rootSize } = useContext(context) as { rootSize: number }
  const ctx = useOverlayContext()

  const [blocked, handleBlocked] = useState(false)
  const [active, handleActive] = useState(isOpen)

  const [innerAlign, setInnerAlign] = useState(align)
  const [innerAlignX, setInnerAlignX] = useState(alignX)
  const [innerAlignY, setInnerAlignY] = useState(alignY)

  const triggerRef = useRef<HTMLElement>()
  const contentRef = useRef<HTMLElement>()

  const setBlocked = useCallback(() => handleBlocked(true), [])
  const setUnblocked = useCallback(() => handleBlocked(false), [])

  const showContent = useCallback(() => {
    handleActive(true)
  }, [])

  const hideContent = useCallback(() => {
    handleActive(false)
  }, [])

  // if an Overlay has an Overlay child, this will prevent closing parent child
  // + calculate correct position when an Overlay is opened
  useEffect(() => {
    if (active) {
      if (ctx?.setBlocked) ctx.setBlocked()
      if (onOpen) onOpen()
    } else {
      if (ctx?.setUnblocked) ctx.setUnblocked()
      if (onClose) onClose()
    }
  }, [active, onOpen, onClose])

  // calculate position on every position change state
  useEffect(() => {
    if (active) {
      calculateContentPosition()
    }
  }, [active, innerAlign, innerAlignX, innerAlignY])

  // handles calculating correct position of content
  // on document events (or custom scroll if set)
  useEffect(() => {
    if (!active) return undefined

    window.addEventListener('resize', handleContentPosition, false)
    window.addEventListener('scroll', handleContentPosition, false)

    if (customScrollListener) {
      customScrollListener.addEventListener(
        'scroll',
        handleContentPosition,
        false
      )
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
  }, [active, customScrollListener])

  // make sure scrolling is blocked in case of modal windows or when
  // customScroll is set
  useEffect(() => {
    const shouldSetOverflow = __BROWSER__ && type === 'modal' && document.body

    if (active) {
      if (customScrollListener && closeOn !== 'hover') {
        // eslint-disable-next-line no-param-reassign
        customScrollListener.style.overflow = 'hidden'
      }

      if (shouldSetOverflow) {
        document.body.style.overflow = 'hidden'
      }
    } else {
      if (customScrollListener) {
        // eslint-disable-next-line no-param-reassign
        customScrollListener.style.overflow = ''
      }

      if (shouldSetOverflow) {
        document.body.style.overflow = ''
      }
    }

    return () => {
      if (customScrollListener) {
        // eslint-disable-next-line no-param-reassign
        customScrollListener.style.overflow = ''
      }

      if (shouldSetOverflow) {
        document.body.style.overflow = ''
      }
    }
  }, [active, type, customScrollListener, closeOn])

  // only when content is active handle closing
  useEffect(() => {
    if (!active) return undefined

    window.addEventListener('scroll', handleVisibility, false)

    if (customScrollListener) {
      customScrollListener.addEventListener('scroll', handleVisibility, false)
    }

    if (closeOnEsc) {
      window.addEventListener('keydown', handleEscKey, false)
    }

    return () => {
      window.removeEventListener('scroll', handleVisibility, false)

      if (customScrollListener) {
        customScrollListener.removeEventListener(
          'scroll',
          handleVisibility,
          false
        )
      }

      if (closeOnEsc) {
        window.removeEventListener('keydown', handleEscKey, false)
      }
    }
  }, [active, customScrollListener, closeOnEsc])

  useEffect(() => {
    // enable overlay manipulation only when the state is NOT blocked=true
    // nor in disabled state
    if (blocked || disabled) return undefined

    if (
      openOn === 'click' ||
      closeOn === 'click' ||
      closeOn === 'clickOnTrigger' ||
      closeOn === 'clickOutsideContent'
    ) {
      window.addEventListener('click', handleClick, false)
    }

    if (openOn === 'hover' || closeOn === 'hover') {
      window.addEventListener('mousemove', handleVisibility, false)
    }

    return () => {
      window.removeEventListener('click', handleClick, false)
      window.removeEventListener('mousemove', handleVisibility, false)
    }
  }, [openOn, closeOn, blocked, disabled, active])

  const isNodeOrChild = (ref) => (e) => {
    if (e && e.target && ref.current) {
      return ref.current.contains(e.target) || e.target === ref.current
    }

    return false
  }

  const isTrigger = isNodeOrChild(triggerRef)
  const isContent = isNodeOrChild(contentRef)

  const calculateContentPosition = () => {
    if (!active) return

    if (!triggerRef.current || !contentRef.current) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Cannot access `ref` of trigger or content component.')
      }

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
    if (!active) {
      if (
        (openOn === 'hover' && e.type === 'mousemove') ||
        (openOn === 'click' && e.type === 'click')
      ) {
        if (isTrigger(e)) {
          showContent()
        }
      }
    }

    if (active) {
      if (closeOn === 'hover' && e.type === 'mousemove') {
        if (!isTrigger(e) && !isContent(e)) {
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
        if (isTrigger(e)) {
          hideContent()
        }
      }

      if (closeOn === 'clickOutsideContent' && e.type === 'click') {
        if (!isContent(e)) {
          hideContent()
        }
      }
    }
  }

  const handleContentPosition = throttle(
    calculateContentPosition,
    throttleDelay
  )

  const handleClick = handleVisibilityByEventType
  const handleVisibility = throttle(handleVisibilityByEventType, throttleDelay)

  const handleEscKey = (e: any) => {
    if (e.key === 'Escape') {
      hideContent()
    }
  }

  return {
    triggerRef,
    contentRef,
    active,
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
