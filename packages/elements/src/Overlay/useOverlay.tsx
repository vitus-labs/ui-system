/**
 * Core hook powering the Overlay component. Manages open/close state, DOM
 * event listeners (click, hover, scroll, resize, ESC key), and dynamic
 * positioning of overlay content relative to its trigger. Supports dropdown,
 * tooltip, popover, and modal types with automatic edge-of-viewport flipping.
 * Event handlers are throttled for performance, and nested overlay blocking
 * is coordinated through the overlay context.
 */
/* eslint-disable no-console */

import { context, throttle } from '@vitus-labs/core'
import { value } from '@vitus-labs/unistyle'
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { IS_DEVELOPMENT } from '~/utils'
import Provider, { useOverlayContext } from './context'

type OverlayPosition = Partial<{
  top: number | string
  bottom: number | string
  left: number | string
  right: number | string
}>

type Align = 'bottom' | 'top' | 'left' | 'right'
type AlignX = 'left' | 'center' | 'right'
type AlignY = 'bottom' | 'top' | 'center'

export type UseOverlayProps = Partial<{
  /**
   * Defines default state whether **Overlay** component should be active.
   * @defaultValue `false`
   */
  isOpen: boolean
  /**
   * Defines `event` when **Overlay** is supposed to be open.
   *
   * When `manual` is set, callbacks needs to be applied to make it working.
   * @defaultValue `click`
   */
  openOn: 'click' | 'hover' | 'manual'
  /**
   * Defines `event` when **Overlay** is supposed to be closed.
   * @defaultValue `click`
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
   * @defaultValue `dropdown`
   */
  type: 'dropdown' | 'tooltip' | 'popover' | 'modal' | 'custom'
  /**
   * Defines how `content` is treated regarding CSS positioning.
   * @defaultValue `fixed`
   */
  position: 'absolute' | 'fixed' | 'relative' | 'static'
  /**
   * Defines from which side is `content` aligned to `trigger` (top, left, bottom, right).
   * For more specific alignment configuration can be used `alignX` and/or `alignY` prop.
   * @defaultValue `bottom`
   */
  align: Align
  /**
   * Defines how `content` is aligned to `trigger` on axis X
   * @defaultValue `left`
   */
  alignX: AlignX
  /**
   * Defines how `content` is aligned to `trigger` on axis Y
   * @defaultValue `bottom`
   */
  alignY: AlignY
  /**
   * Defines `margin` from trigger on axis X.
   * @defaultValue `0`
   */
  offsetX: number
  /**
   * Defines `margin` from trigger on axis Y.
   * @defaultValue `0`
   */
  offsetY: number
  /**
   * Performance helper. Value defined in milliseconds for `throttling`
   * recalculations
   * @defaultValue `200`
   */
  throttleDelay: number
  /**
   * A valid HTML element. Prop can be used for ability to handle properly
   * scrolling inside custom scrollable HTML element.
   */
  parentContainer: HTMLElement | null
  /**
   * Defines whether active **Overlay** is supposed to be closed on pressing
   * `ESC` key.
   * @defaultValue `true`
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
  align = 'bottom', // main align prop top | left | bottom | right
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

  const triggerRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLElement>(null)

  const setBlocked = useCallback(() => handleBlocked(true), [])
  const setUnblocked = useCallback(() => handleBlocked(false), [])

  const showContent = useCallback(() => {
    handleActive(true)
  }, [])

  const hideContent = useCallback(() => {
    handleActive(false)
  }, [])

  // For position: absolute, getBoundingClientRect() returns viewport-relative
  // values but the element is positioned relative to its offsetParent.
  // We need to subtract the offsetParent's viewport rect to get correct coords.
  const getAncestorOffset = useCallback(() => {
    if (position !== 'absolute' || !contentRef.current) {
      return { top: 0, left: 0 }
    }

    const offsetParent = contentRef.current.offsetParent as HTMLElement | null
    if (!offsetParent || offsetParent === document.body) {
      return { top: 0, left: 0 }
    }

    const rect = offsetParent.getBoundingClientRect()
    return { top: rect.top, left: rect.left }
  }, [position])

  const calculateContentPosition = useCallback(() => {
    const overlayPosition: OverlayPosition = {}

    if (!active || !isContentLoaded) return overlayPosition

    if (type === 'modal' && !contentRef.current) {
      if (IS_DEVELOPMENT) {
        // biome-ignore lint/suspicious/noConsole: dev-mode warning
        console.warn(
          '[@vitus-labs/elements] Overlay: contentRef is not attached. ' +
            'Make sure the overlay content is mounted before opening.',
        )
      }
      return overlayPosition
    }

    if (['dropdown', 'tooltip', 'popover'].includes(type)) {
      // return empty object when refs are not available
      if (!triggerRef.current || !contentRef.current) {
        if (IS_DEVELOPMENT) {
          // biome-ignore lint/suspicious/noConsole: dev-mode warning
          console.warn(
            `[@vitus-labs/elements] Overlay (${type}): ` +
              `${!triggerRef.current ? 'triggerRef' : 'contentRef'} is not attached. ` +
              'Position cannot be calculated without both refs.',
          )
        }
        return overlayPosition
      }

      const c = contentRef.current.getBoundingClientRect()
      const t = triggerRef.current.getBoundingClientRect()
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
      // return empty object when ref is not available
      // triggerRef is not needed in this case
      if (!contentRef.current) {
        if (IS_DEVELOPMENT) {
          // biome-ignore lint/suspicious/noConsole: dev-mode warning
          console.warn(
            '[@vitus-labs/elements] Overlay (modal): contentRef is not attached. ' +
              'Modal position cannot be calculated without a content element.',
          )
        }
        return overlayPosition
      }

      const c = contentRef.current.getBoundingClientRect()

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
        default:
          overlayPosition.right = offsetX
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
        default:
          overlayPosition.top = offsetY
      }
    }

    // For position: absolute, adjust viewport-relative coords to be
    // relative to the offsetParent so the overlay lands correctly.
    const ancestor = getAncestorOffset()
    if (ancestor.top !== 0 || ancestor.left !== 0) {
      if (
        overlayPosition.top != null &&
        typeof overlayPosition.top === 'number'
      ) {
        overlayPosition.top -= ancestor.top
      }
      if (
        overlayPosition.bottom != null &&
        typeof overlayPosition.bottom === 'number'
      ) {
        overlayPosition.bottom += ancestor.top
      }
      if (
        overlayPosition.left != null &&
        typeof overlayPosition.left === 'number'
      ) {
        overlayPosition.left -= ancestor.left
      }
      if (
        overlayPosition.right != null &&
        typeof overlayPosition.right === 'number'
      ) {
        overlayPosition.right += ancestor.left
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
    getAncestorOffset,
  ])

  const assignContentPosition = useCallback(
    (values: OverlayPosition = {}) => {
      if (!contentRef.current) return

      const el = contentRef.current
      const setValue = (param?: string | number) =>
        value(param, rootSize) as string

      el.style.position = position

      // Reset all directional properties first, then apply only the ones
      // present in `values`. This prevents stale values lingering when the
      // overlay flips direction (e.g. top→bottom leaves old `top` behind).
      el.style.top = values.top != null ? setValue(values.top) : ''
      el.style.bottom = values.bottom != null ? setValue(values.bottom) : ''
      el.style.left = values.left != null ? setValue(values.left) : ''
      el.style.right = values.right != null ? setValue(values.right) : ''
    },
    [position, rootSize],
  )

  const setContentPosition = useCallback(() => {
    const currentPosition = calculateContentPosition()
    assignContentPosition(currentPosition)
  }, [assignContentPosition, calculateContentPosition])

  const isNodeOrChild = useCallback(
    (ref: { current: HTMLElement | null }) => (e: Event) => {
      if (e?.target && ref.current) {
        return (
          ref.current.contains(e.target as Element) || e.target === ref.current
        )
      }

      return false
    },
    [],
  )

  const handleVisibilityByEventType = useCallback(
    (e: Event) => {
      if (blocked || disabled) return

      const isTrigger = isNodeOrChild(triggerRef)
      const isContent = isNodeOrChild(contentRef)

      // showing content observing (hover is handled by dedicated mouseenter/mouseleave)
      if (!active) {
        if (openOn === 'click' && e.type === 'click') {
          if (isTrigger(e)) {
            showContent()
          }
        }
      }

      // hiding content observing
      if (active) {
        // hover close on scroll (mouseenter/mouseleave handles mouse movement)
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
      isNodeOrChild,
    ],
  )

  // Use refs to avoid stale closures in throttled callbacks.
  // The throttled wrappers are stable (only recreated if throttleDelay changes),
  // but always call the latest version of the underlying function via the ref.
  const latestSetContentPosition = useRef(setContentPosition)
  latestSetContentPosition.current = setContentPosition

  const latestHandleVisibility = useRef(handleVisibilityByEventType)
  latestHandleVisibility.current = handleVisibilityByEventType

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleContentPosition = useMemo(
    () => throttle(() => latestSetContentPosition.current(), throttleDelay),
    [throttleDelay],
  )

  const handleClick = handleVisibilityByEventType

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleVisibility = useMemo(
    () =>
      throttle((e: Event) => latestHandleVisibility.current(e), throttleDelay),
    [throttleDelay],
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

    // First call positions immediately; the rAF callback re-measures after
    // the browser has had a chance to reflow, catching any geometry changes
    // caused by the initial positioning (e.g. content becoming visible).
    setContentPosition()
    const rafId = requestAnimationFrame(() => setContentPosition())

    return () => cancelAnimationFrame(rafId)
  }, [active, isContentLoaded, setContentPosition])

  // Track previous active state so callbacks only fire on actual transitions,
  // not on every dependency change or unmount-while-closed.
  const prevActiveRef = useRef(false)
  useEffect(() => {
    const wasActive = prevActiveRef.current
    prevActiveRef.current = active

    if (active && !wasActive) {
      if (onOpen) onOpen()
      if (ctx.setBlocked) ctx.setBlocked()
    } else if (!active && wasActive) {
      setContentLoaded(false)
      if (onClose) onClose()
      if (ctx.setUnblocked) ctx.setUnblocked()
    } else if (!active) {
      setContentLoaded(false)
    }

    return () => {
      // On unmount, only clean up if currently active
      if (active) {
        if (onClose) onClose()
        if (ctx.setUnblocked) ctx.setUnblocked()
      }
    }
  }, [active, ctx, onClose, onOpen])

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
    window.addEventListener('scroll', onScroll, { passive: true })

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

    parentContainer.addEventListener('scroll', onScroll, { passive: true })

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

  // Click-based open/close: attach to window
  useEffect(() => {
    if (blocked || disabled) return undefined

    const enabledClick =
      openOn === 'click' ||
      ['click', 'clickOnTrigger', 'clickOutsideContent'].includes(closeOn)

    if (enabledClick) {
      window.addEventListener('click', handleClick)
    }

    return () => {
      window.removeEventListener('click', handleClick)
    }
  }, [openOn, closeOn, blocked, disabled, handleClick])

  // Hover-based open/close: mouseenter/mouseleave on trigger + content
  // instead of window-level mousemove (which fires on every pixel of movement).
  // A short timeout bridges the gap between trigger and content elements.
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // biome-ignore lint/correctness/useExhaustiveDependencies: isContentLoaded signals contentRef.current is available so the effect re-runs to attach listeners
  useEffect(() => {
    const enabledHover = openOn === 'hover' || closeOn === 'hover'
    if (blocked || disabled || !enabledHover) return undefined

    const trigger = triggerRef.current
    const content = contentRef.current

    const clearHoverTimeout = () => {
      if (hoverTimeoutRef.current != null) {
        clearTimeout(hoverTimeoutRef.current)
        hoverTimeoutRef.current = null
      }
    }

    const scheduleHide = () => {
      clearHoverTimeout()
      hoverTimeoutRef.current = setTimeout(hideContent, 100)
    }

    const onTriggerEnter = () => {
      clearHoverTimeout()
      if (openOn === 'hover' && !active) showContent()
    }

    const onTriggerLeave = () => {
      if (closeOn === 'hover' && active) scheduleHide()
    }

    const onContentEnter = () => {
      clearHoverTimeout()
    }

    const onContentLeave = () => {
      if (closeOn === 'hover' && active) scheduleHide()
    }

    if (trigger) {
      trigger.addEventListener('mouseenter', onTriggerEnter)
      trigger.addEventListener('mouseleave', onTriggerLeave)
    }

    if (content) {
      content.addEventListener('mouseenter', onContentEnter)
      content.addEventListener('mouseleave', onContentLeave)
    }

    return () => {
      clearHoverTimeout()
      if (trigger) {
        trigger.removeEventListener('mouseenter', onTriggerEnter)
        trigger.removeEventListener('mouseleave', onTriggerLeave)
      }
      if (content) {
        content.removeEventListener('mouseenter', onContentEnter)
        content.removeEventListener('mouseleave', onContentLeave)
      }
    }
  }, [
    active,
    isContentLoaded,
    blocked,
    disabled,
    openOn,
    closeOn,
    showContent,
    hideContent,
  ])

  // hack-ish way to load content correctly on the first load
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
