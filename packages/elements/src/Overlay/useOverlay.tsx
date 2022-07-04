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
  position = 'fixed', // absolute | fixed | relative | static
  align = 'bottom', // * main align prop * top | left | bottom | right
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

  const [innerAlignX, setInnerAlignX] = useState(alignX)
  const [innerAlignY, setInnerAlignY] = useState(alignY)

  const [blocked, handleBlocked] = useState(false)
  const [active, handleActive] = useState(isOpen)

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

  const isNodeOrChild =
    (ref: typeof triggerRef | typeof contentRef) => (e: Event) => {
      if (e && e.target && ref.current) {
        return (
          ref.current.contains(e.target as Element) || e.target === ref.current
        )
      }

      return false
    }

  const isTrigger = isNodeOrChild(triggerRef)
  const isContent = isNodeOrChild(contentRef)

  const calculateContentPosition = useCallback(() => {
    if (!active) return
    if (!triggerRef.current || !contentRef.current) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Cannot access `ref` of trigger or content component.')
      }

      return
    }

    const overlayPosition: OverlayPosition = {
      position,
    }

    const t = triggerRef.current.getBoundingClientRect()
    const c = contentRef.current.getBoundingClientRect()

    if (['dropdown', 'tooltip', 'popover'].includes(type)) {
      // align is top or bottom
      if (['top', 'bottom'].includes(align)) {
        // axe Y position
        // (assigned as top position)
        const top = t.top - offsetY - c.height
        const bottom = t.bottom + offsetY

        // axe X position
        // content position to trigger position
        // (assigned as left position)
        const left = t.left + offsetX
        const right = t.right - offsetX - c.width

        // calculate possible position
        const isTop = top >= 0 // represents window.height = 0
        const isBottom = bottom + c.height <= window.innerHeight
        const isLeft = left + c.width <= window.innerWidth
        const isRight = right >= 0 // represents window.width = 0

        if (align === 'top') {
          setInnerAlignY(isTop ? 'top' : 'bottom')
          overlayPosition.top = isTop ? top : bottom
        } else if (align === 'bottom') {
          setInnerAlignY(isBottom ? 'bottom' : 'top')
          overlayPosition.top = isBottom ? bottom : top
        }

        // left
        if (alignX === 'left') {
          setInnerAlignX(isLeft ? 'left' : 'right')
          overlayPosition.left = isLeft ? left : right
        }
        // center
        else if (alignX === 'center') {
          const center = t.left + (t.right - t.left) / 2 - c.width / 2
          const isCenteredLeft = center >= 0
          const isCenteredRight = center + c.width <= window.innerWidth

          if (isCenteredLeft && isCenteredRight) {
            setInnerAlignX('center')
            overlayPosition.left = center
          } else if (isCenteredLeft) {
            setInnerAlignX('left')
            overlayPosition.left = left
          } else if (isCenteredRight) {
            setInnerAlignX('right')
            overlayPosition.left = right
          }
        }
        // right
        else if (alignX === 'right') {
          setInnerAlignX(isRight ? 'right' : 'left')
          overlayPosition.left = isRight ? right : left
        }
      }

      // align is left or right
      else if (['left', 'right'].includes(align)) {
        // axe X position
        // (assigned as left position)
        const left = t.left - offsetX - c.width
        const right = t.right + offsetX

        // axe Y position
        // content position to trigger position
        // (assigned as top position)
        const top = t.top + offsetY
        const bottom = t.bottom - offsetY - c.height

        const isLeft = left >= 0
        const isRight = right + c.width <= window.innerWidth
        const isTop = top + c.height <= window.innerHeight
        const isBottom = bottom >= 0

        if (align === 'left') {
          setInnerAlignX(isLeft ? 'left' : 'right')
          overlayPosition.left = isLeft ? left : right
        } else if (align === 'right') {
          setInnerAlignX(isRight ? 'right' : 'left')
          overlayPosition.left = isRight ? right : left
        }

        // top
        if (alignY === 'top') {
          setInnerAlignY(isTop ? 'top' : 'bottom')
          overlayPosition.top = isTop ? top : bottom
        }
        // center
        else if (alignY === 'center') {
          const center = t.top + (t.bottom - t.top) / 2 - c.height / 2
          const isCenteredTop = center >= 0
          const isCenteredBottom = center + c.height <= window.innerHeight

          if (isCenteredTop && isCenteredBottom) {
            setInnerAlignY('center')
            overlayPosition.top = center
          } else if (isCenteredTop) {
            setInnerAlignY('top')
            overlayPosition.top = top
          } else if (isCenteredBottom) {
            setInnerAlignY('bottom')
            overlayPosition.top = bottom
          }
        }
        // bottom
        else if (alignY === 'bottom') {
          setInnerAlignY(isBottom ? 'bottom' : 'top')
          overlayPosition.top = isBottom ? bottom : top
        }
      }
    }

    // modal type
    else if (type === 'modal') {
      switch (alignX) {
        case 'right':
          overlayPosition.right = offsetX
          break
        case 'left':
          overlayPosition.left = offsetX
          break
        case 'center':
        default:
          overlayPosition.left = window.innerWidth / 2 - c.width / 2
          break
      }

      switch (alignY) {
        case 'top':
          overlayPosition.top = offsetY
          break
        case 'center':
          overlayPosition.top = window.innerHeight / 2 - c.height / 2
          break
        case 'bottom':
        default:
          overlayPosition.bottom = offsetY
          break
      }
    }

    const setValue = (param?: string | number) =>
      value(param, rootSize) as string

    // ADD POSITION STYLES TO CONTENT
    contentRef.current.style.position = position
    contentRef.current.style.top = setValue(overlayPosition.top)
    contentRef.current.style.bottom = setValue(overlayPosition.bottom)
    contentRef.current.style.left = setValue(overlayPosition.left)
    contentRef.current.style.right = setValue(overlayPosition.right)
  }, [
    active,
    type,
    align,
    alignX,
    alignY,
    offsetX,
    offsetY,
    position,
    rootSize,
  ])

  const handleVisibilityByEventType = (e: Event) => {
    if (disabled) {
      hideContent()
    }

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

  const handleEscKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        hideContent()
      }
    },
    [hideContent]
  )

  useEffect(() => {
    handleActive(isOpen)
  }, [isOpen])

  useEffect(() => {
    setInnerAlignX(alignX)
  }, [alignX])

  useEffect(() => {
    setInnerAlignY(alignY)
  }, [alignY])

  useEffect(() => {
    if (disabled) {
      hideContent()
    }
  }, [disabled, hideContent])

  // calculate position on every position change state
  useEffect(() => {
    if (active) {
      calculateContentPosition()
    }
  }, [active, calculateContentPosition])

  // if an Overlay has an Overlay child, this will prevent closing parent child
  // + calculate correct position when an Overlay is opened
  useEffect(() => {
    if (active) {
      if (onOpen) onOpen()
      if (ctx && ctx.setBlocked) ctx.setBlocked()
    } else {
      if (onClose) onClose()
      if (ctx && ctx.setUnblocked) ctx.setUnblocked()
    }
  }, [active, onOpen, onClose, ctx])

  // handles calculating correct position of content
  // on document events (or custom scroll if set)
  useEffect(() => {
    if (!active) return undefined

    document.addEventListener('resize', handleContentPosition, false)
    document.addEventListener('scroll', handleContentPosition, false)

    if (customScrollListener) {
      customScrollListener.addEventListener(
        'scroll',
        handleContentPosition,
        false
      )
    }

    return () => {
      document.removeEventListener('resize', handleContentPosition, false)
      document.removeEventListener('scroll', handleContentPosition, false)

      if (customScrollListener) {
        customScrollListener.removeEventListener(
          'scroll',
          handleContentPosition,
          false
        )
      }
    }
  }, [active, customScrollListener, handleContentPosition])

  // make sure scrolling is blocked in case of modal windows or when
  // customScroll is set
  useEffect(() => {
    const shouldSetDocumentOverflow =
      __BROWSER__ && type === 'modal' && !!document.body
    const shouldSetCustomScrollOverflow = __BROWSER__ && !!customScrollListener

    if (active) {
      if (shouldSetCustomScrollOverflow && closeOn !== 'hover') {
        // eslint-disable-next-line no-param-reassign
        customScrollListener.style.overflow = 'hidden'
      }

      if (shouldSetDocumentOverflow) {
        document.body.style.overflow = 'hidden'
      }
    } else {
      if (shouldSetCustomScrollOverflow) {
        // eslint-disable-next-line no-param-reassign
        customScrollListener.style.overflow = ''
      }

      if (shouldSetDocumentOverflow) {
        document.body.style.overflow = ''
      }
    }

    return () => {
      if (customScrollListener) {
        // eslint-disable-next-line no-param-reassign
        customScrollListener.style.overflow = ''
      }

      if (shouldSetDocumentOverflow) {
        document.body.style.overflow = ''
      }
    }
  }, [active, type, customScrollListener, closeOn])

  // only when content is active handle closing
  useEffect(() => {
    if (!active && blocked) return undefined

    document.addEventListener('scroll', handleVisibility, false)

    if (customScrollListener) {
      customScrollListener.addEventListener('scroll', handleVisibility, false)
    }

    if (closeOnEsc) {
      document.addEventListener('keydown', handleEscKey, false)
    }

    return () => {
      document.removeEventListener('scroll', handleVisibility, false)

      if (customScrollListener) {
        customScrollListener.removeEventListener(
          'scroll',
          handleVisibility,
          false
        )
      }

      if (closeOnEsc) {
        document.removeEventListener('keydown', handleEscKey, false)
      }
    }
  }, [
    active,
    blocked,
    customScrollListener,
    closeOnEsc,
    handleVisibility,
    handleEscKey,
  ])

  useEffect(() => {
    // enable overlay manipulation only when the state is NOT blocked=true
    // nor in disabled=true state
    if (blocked || disabled) return undefined

    if (
      openOn === 'click' ||
      closeOn === 'click' ||
      closeOn === 'clickOnTrigger' ||
      closeOn === 'clickOutsideContent'
    ) {
      document.addEventListener('click', handleClick, false)
    }

    if (openOn === 'hover' || closeOn === 'hover') {
      document.addEventListener('mousemove', handleVisibility, false)
    }

    return () => {
      document.removeEventListener('click', handleClick, false)
      document.removeEventListener('mousemove', handleVisibility, false)
    }
  }, [
    openOn,
    closeOn,
    blocked,
    disabled,
    active,
    handleClick,
    handleVisibility,
  ])

  return {
    triggerRef,
    contentRef,
    active,
    align,
    alignX: innerAlignX,
    alignY: innerAlignY,
    showContent,
    hideContent,
    blocked,
    setBlocked,
    setUnblocked,
  }
}
