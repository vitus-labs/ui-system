/* eslint-disable no-console */
import { useRef, useState, useEffect, useContext, useCallback } from 'react'
import { throttle, context } from '@vitus-labs/core'
import { value } from '@vitus-labs/unistyle'
import Provider, { useOverlayContext } from './context'

type OverlayPosition = Partial<{
  top: number | string
  bottom: number | string
  left: number | string
  right: number | string
}>

type Align = 'bottom' | 'top' | 'left' | 'bottom' | 'right'
type AlignX = 'left' | 'center' | 'right'
type AlignY = 'bottom' | 'top' | 'center'

export type UseOverlayProps = Partial<{
  /**
   * Defines default state whather **Overlay** component should be active.
   * Default value is `false`.
   */
  isOpen: boolean
  /**
   * Defines `event` when **Overlay** is supposed to be open.
   * 
   * When `manual` is set, callbacks needs to be applied to make it working.
   */
  openOn: 'click' | 'hover' | 'manual'
  /**
   * Defines `event` when **Overlay** is supposed to be closed.
   */
  closeOn:
    | 'click'
    | 'clickOnTrigger'
    | 'clickOutsideContent'
    | 'hover'
    | 'manual'

  /**
   * Defines what type of **Overlay** will be created. Type `modal` 
   * has different positioning calculations than others.
   */
  type: 'dropdown' | 'tooltip' | 'popover' | 'modal'
  /**
   * Defines how `content` is treated regarding CSS positioning.
   */
  position: 'absolute' | 'fixed' | 'relative' | 'static'
  /**
   * Defines from which side is `content` aligned to `trigger` (top, left, bottom, right).
   * For more specific alignment configuration can be used `alignX` and/or `alignY` prop.
   */
  align: Align
  /**
   * Defines how `content` is aligned to `trigger` on axis X
   */
  alignX: AlignX
  /**
   * Defines how `content` is aligned to `trigger` on axis Y
   */
  alignY: AlignY
  /**
   * Defines `margin` from trigger on axis X.
   */
  offsetX: number
  /**
   * Defines `margin` from trigger on axis Y.
   */
  offsetY: number
  /**
   * Performance helper. Value defined in miliseconds for `throttling` 
   * recalculations
   */
  throttleDelay: number
  /**
   * A valid HTML element. Prop can be used for ability to handle properly 
   * scrolling inside custom scrollable HTML element.
   */
  parentContainer: HTMLElement | null
  /**
   * Defines wheather active **Overlay** is supposed to be closed on pressing 
   * `ESC` key.
   */
  closeOnEsc: boolean
  /**
   * When set to `true`, **Overlay** is automatically closed and is blocked for 
   * being opened.
   */
  disabled: boolean
  /**
   * A callback hook to be called when **Overlay** is being opened. Does not 
   * accept any arguments.
   */
  onOpen: () => void
  /**
   * A callback hook to be called when **Overlay** is being closed. Does not 
   * accept any arguments.
   */
  onClose: () => void
}>

const useOverlay = ({
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
  parentContainer,
  closeOnEsc = true,
  disabled,
  onOpen,
  onClose,
}: Partial<UseOverlayProps> = {}) => {
  const { rootSize } = useContext(context) as { rootSize: number }
  const ctx = useOverlayContext()
  const [isContentLoaded, setContentLoaded] = useState(false)

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

  const calculateContentPosition = useCallback(() => {
    const overlayPosition: OverlayPosition = {}

    if (!active || !isContentLoaded) return overlayPosition
    if (!triggerRef.current || !contentRef.current) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Cannot access `ref` of trigger or content component.')
      }

      return overlayPosition
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
          overlayPosition.bottom = offsetY
          break
      }
    }

    return overlayPosition
  }, [
    isContentLoaded,
    active,
    align,
    alignX,
    alignY,
    offsetX,
    offsetY,
    type,
    triggerRef,
    contentRef,
  ])

  const assignContentPosition = useCallback(
    (values: OverlayPosition = {}) => {
      if (!contentRef.current) return

      const isValue = (value?: string | number) => {
        if (typeof value === 'number') return true
        if (Number.isFinite(value)) return true
        return !!value
      }

      const setValue = (param?: string | number) =>
        value(param, rootSize) as string

      // ADD POSITION STYLES TO CONTENT
      // eslint-disable-next-line no-param-reassign
      if (isValue(position)) contentRef.current.style.position = position
      // eslint-disable-next-line no-param-reassign
      if (isValue(values.top))
        contentRef.current.style.top = setValue(values.top)
      // eslint-disable-next-line no-param-reassign
      if (isValue(values.bottom))
        contentRef.current.style.bottom = setValue(values.bottom)
      // eslint-disable-next-line no-param-reassign
      if (isValue(values.left))
        contentRef.current.style.left = setValue(values.left)
      // eslint-disable-next-line no-param-reassign
      if (isValue(values.right))
        contentRef.current.style.right = setValue(values.right)
    },
    [position, rootSize, contentRef]
  )

  const setContentPosition = useCallback(() => {
    const currentPosition = calculateContentPosition()
    assignContentPosition(currentPosition)
  }, [assignContentPosition, calculateContentPosition])

  const isNodeOrChild =
    (ref: typeof triggerRef | typeof contentRef) => (e: Event) => {
      if (e && e.target && ref.current) {
        return (
          ref.current.contains(e.target as Element) || e.target === ref.current
        )
      }

      return false
    }

  const handleVisibilityByEventType = useCallback(
    (e: Event) => {
      if (blocked || disabled) return

      const isTrigger = isNodeOrChild(triggerRef)
      const isContent = isNodeOrChild(contentRef)

      // showing content observing
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

      // hiding content observing
      if (active) {
        if (
          closeOn === 'hover' &&
          e.type === 'mousemove' &&
          !isTrigger(e) &&
          !isContent(e)
        ) {
          hideContent()
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
    },
    [
      active,
      blocked,
      disabled,
      openOn,
      closeOn,
      hideContent,
      showContent,
      triggerRef,
      contentRef,
    ]
  )

  const handleContentPosition = useCallback(
    throttle(setContentPosition, throttleDelay),
    // same deps as `setContentPosition`
    [assignContentPosition, calculateContentPosition]
  )
  const handleClick = handleVisibilityByEventType

  const handleVisibility = useCallback(
    throttle(handleVisibilityByEventType, throttleDelay),
    // same deps as `handleVisibilityByEventType`
    [
      active,
      blocked,
      disabled,
      openOn,
      closeOn,
      hideContent,
      showContent,
      triggerRef,
      contentRef,
    ]
  )

  // --------------------------------------------------------------------------
  // useEffects
  // --------------------------------------------------------------------------
  useEffect(() => {
    setInnerAlignX(alignX)
    setInnerAlignY(alignY)

    if (disabled) {
      hideContent()
    }
  }, [disabled, alignX, alignY, hideContent])

  useEffect(() => {
    if (!active || !isContentLoaded) return undefined

    setContentPosition()
    setContentPosition()
  }, [active, isContentLoaded, setContentPosition])

  // if an Overlay has an Overlay child, this will prevent closing parent child
  // and calculates correct position when an Overlay is opened
  useEffect(() => {
    if (active) {
      if (onOpen) onOpen()
      if (ctx.setBlocked) ctx.setBlocked()
    } else {
      setContentLoaded(false)
    }

    return () => {
      if (onClose) onClose()
      if (ctx.setUnblocked) ctx.setUnblocked()
    }
  }, [active, onOpen, onClose, showContent, ctx])

  // handle closing only when content is active
  useEffect(() => {
    if (!closeOnEsc || !active || blocked) return undefined

    const handleEscKey = (e: any) => {
      if (e.key === 'Escape') {
        hideContent()
      }
    }

    window.addEventListener('keydown', handleEscKey)

    return () => {
      window.removeEventListener('keydown', handleEscKey)
    }
  }, [active, blocked, closeOnEsc, hideContent])

  // handles repositioning of content on document events
  useEffect(() => {
    if (!active) return undefined

    const shouldSetOverflow = type === 'modal'

    const onScroll = (e: Event) => {
      handleContentPosition()
      handleVisibility(e)
    }

    if (shouldSetOverflow) document.body.style.overflow = 'hidden'
    window.addEventListener('resize', handleContentPosition)
    window.addEventListener('scroll', onScroll)

    return () => {
      if (shouldSetOverflow) document.body.style.overflow = ''
      window.removeEventListener('resize', handleContentPosition)
      window.removeEventListener('scroll', onScroll)
    }
  }, [active, type, handleVisibility, handleContentPosition])

  // handles repositioning of content on a custom element if defined
  useEffect(() => {
    if (!active || !parentContainer) return undefined

    // eslint-disable-next-line no-param-reassign
    if (closeOn !== 'hover') parentContainer.style.overflow = 'hidden'

    const onScroll = (e: Event) => {
      handleContentPosition()
      handleVisibility(e)
    }

    parentContainer.addEventListener('scroll', onScroll)

    return () => {
      // eslint-disable-next-line no-param-reassign
      parentContainer.style.overflow = ''
      parentContainer.removeEventListener('scroll', onScroll)
    }
  }, [
    active,
    parentContainer,
    closeOn,
    handleContentPosition,
    handleVisibility,
  ])

  // enable overlay manipulation only when the state is NOT blocked
  // nor in disabled state
  useEffect(() => {
    if (blocked || disabled) return undefined

    const enabledMouseMove = openOn === 'hover' || closeOn === 'hover'
    const enabledClick =
      openOn === 'click' ||
      ['click', 'clickOnTrigger', 'clickOutsideContent'].includes(closeOn)

    if (enabledClick) {
      window.addEventListener('click', handleClick)
    }

    if (enabledMouseMove) {
      window.addEventListener('mousemove', handleVisibility)
    }

    return () => {
      window.removeEventListener('click', handleClick)
      window.removeEventListener('mousemove', handleVisibility)
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

  // hack-ish way to load contet correctly on the first load
  // as `contentRef` is loaded dynamically
  const contentRefCallback = useCallback((node: HTMLElement) => {
    if (node) {
      contentRef.current = node
      setContentLoaded(true)
    }
  }, [])

  return {
    triggerRef,
    contentRef: contentRefCallback,
    active,
    align,
    alignX: innerAlignX,
    alignY: innerAlignY,
    showContent,
    hideContent,
    blocked,
    setBlocked,
    setUnblocked,
    Provider,
  }
}

export default useOverlay
