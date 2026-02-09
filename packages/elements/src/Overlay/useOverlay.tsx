/**
 * Core hook powering the Overlay component. Manages open/close state, DOM
 * event listeners (click, hover, scroll, resize, ESC key), and dynamic
 * positioning of overlay content relative to its trigger. Supports dropdown,
 * tooltip, popover, and modal types with automatic edge-of-viewport flipping.
 * Event handlers are throttled for performance, and nested overlay blocking
 * is coordinated through the overlay context.
 */
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

type PositionResult = {
  pos: OverlayPosition
  resolvedAlignX: AlignX
  resolvedAlignY: AlignY
}

const sel = <T,>(cond: boolean, a: T, b: T): T => (cond ? a : b)

const devWarn = (msg: string) => {
  if (!IS_DEVELOPMENT) return
  // biome-ignore lint/suspicious/noConsole: dev-mode warning
  console.warn(msg)
}

const calcDropdownVertical = (
  c: DOMRect,
  t: DOMRect,
  align: 'top' | 'bottom',
  alignX: AlignX,
  offsetX: number,
  offsetY: number,
): PositionResult => {
  const pos: OverlayPosition = {}

  const topPos = t.top - offsetY - c.height
  const bottomPos = t.bottom + offsetY
  const leftPos = t.left + offsetX
  const rightPos = t.right - offsetX - c.width

  const fitsTop = topPos >= 0
  const fitsBottom = bottomPos + c.height <= window.innerHeight
  const fitsLeft = leftPos + c.width <= window.innerWidth
  const fitsRight = rightPos >= 0

  const useTop = sel(align === 'top', fitsTop, !fitsBottom)
  pos.top = sel(useTop, topPos, bottomPos)
  const resolvedAlignY: AlignY = sel(useTop, 'top', 'bottom')

  let resolvedAlignX: AlignX = alignX
  if (alignX === 'left') {
    pos.left = sel(fitsLeft, leftPos, rightPos)
    resolvedAlignX = sel(fitsLeft, 'left', 'right')
  } else if (alignX === 'right') {
    pos.left = sel(fitsRight, rightPos, leftPos)
    resolvedAlignX = sel(fitsRight, 'right', 'left')
  } else {
    const center = t.left + (t.right - t.left) / 2 - c.width / 2
    const fitsCL = center >= 0
    const fitsCR = center + c.width <= window.innerWidth

    if (fitsCL && fitsCR) {
      resolvedAlignX = 'center'
      pos.left = center
    } else if (fitsCL) {
      resolvedAlignX = 'left'
      pos.left = leftPos
    } else if (fitsCR) {
      resolvedAlignX = 'right'
      pos.left = rightPos
    }
  }

  return { pos, resolvedAlignX, resolvedAlignY }
}

const calcDropdownHorizontal = (
  c: DOMRect,
  t: DOMRect,
  align: 'left' | 'right',
  alignY: AlignY,
  offsetX: number,
  offsetY: number,
): PositionResult => {
  const pos: OverlayPosition = {}

  const leftPos = t.left - offsetX - c.width
  const rightPos = t.right + offsetX
  const topPos = t.top + offsetY
  const bottomPos = t.bottom - offsetY - c.height

  const fitsLeft = leftPos >= 0
  const fitsRight = rightPos + c.width <= window.innerWidth
  const fitsTop = topPos + c.height <= window.innerHeight
  const fitsBottom = bottomPos >= 0

  const useLeft = sel(align === 'left', fitsLeft, !fitsRight)
  pos.left = sel(useLeft, leftPos, rightPos)
  const resolvedAlignX: AlignX = sel(useLeft, 'left', 'right')

  let resolvedAlignY: AlignY = alignY
  if (alignY === 'top') {
    pos.top = sel(fitsTop, topPos, bottomPos)
    resolvedAlignY = sel(fitsTop, 'top', 'bottom')
  } else if (alignY === 'bottom') {
    pos.top = sel(fitsBottom, bottomPos, topPos)
    resolvedAlignY = sel(fitsBottom, 'bottom', 'top')
  } else {
    const center = t.top + (t.bottom - t.top) / 2 - c.height / 2
    const fitsCT = center >= 0
    const fitsCB = center + c.height <= window.innerHeight

    if (fitsCT && fitsCB) {
      resolvedAlignY = 'center'
      pos.top = center
    } else if (fitsCT) {
      resolvedAlignY = 'top'
      pos.top = topPos
    } else if (fitsCB) {
      resolvedAlignY = 'bottom'
      pos.top = bottomPos
    }
  }

  return { pos, resolvedAlignX, resolvedAlignY }
}

const calcModalPos = (
  c: DOMRect,
  alignX: AlignX,
  alignY: AlignY,
  offsetX: number,
  offsetY: number,
): OverlayPosition => {
  const pos: OverlayPosition = {}

  switch (alignX) {
    case 'right':
      pos.right = offsetX
      break
    case 'left':
      pos.left = offsetX
      break
    case 'center':
      pos.left = window.innerWidth / 2 - c.width / 2
      break
    default:
      pos.right = offsetX
  }

  switch (alignY) {
    case 'top':
      pos.top = offsetY
      break
    case 'center':
      pos.top = window.innerHeight / 2 - c.height / 2
      break
    case 'bottom':
      pos.bottom = offsetY
      break
    default:
      pos.top = offsetY
  }

  return pos
}

const adjustForAncestor = (
  pos: OverlayPosition,
  ancestor: { top: number; left: number },
): OverlayPosition => {
  if (ancestor.top === 0 && ancestor.left === 0) return pos

  const result = { ...pos }
  if (typeof result.top === 'number') result.top -= ancestor.top
  if (typeof result.bottom === 'number') result.bottom += ancestor.top
  if (typeof result.left === 'number') result.left -= ancestor.left
  if (typeof result.right === 'number') result.right += ancestor.left

  return result
}

type ComputeResult = {
  pos: OverlayPosition
  resolvedAlignX?: AlignX
  resolvedAlignY?: AlignY
}

const computePosition = (
  type: string,
  align: Align,
  alignX: AlignX,
  alignY: AlignY,
  offsetX: number,
  offsetY: number,
  triggerEl: HTMLElement | null,
  contentEl: HTMLElement | null,
  ancestorOffset: { top: number; left: number },
): ComputeResult => {
  const isDropdown = ['dropdown', 'tooltip', 'popover'].includes(type)

  if (isDropdown && (!triggerEl || !contentEl)) {
    devWarn(
      `[@vitus-labs/elements] Overlay (${type}): ` +
        `${triggerEl ? 'contentRef' : 'triggerRef'} is not attached. ` +
        'Position cannot be calculated without both refs.',
    )
    return { pos: {} }
  }

  if (isDropdown && triggerEl && contentEl) {
    const c = contentEl.getBoundingClientRect()
    const t = triggerEl.getBoundingClientRect()
    const result =
      align === 'top' || align === 'bottom'
        ? calcDropdownVertical(c, t, align, alignX, offsetX, offsetY)
        : calcDropdownHorizontal(
            c,
            t,
            align as 'left' | 'right',
            alignY,
            offsetX,
            offsetY,
          )

    return {
      pos: adjustForAncestor(result.pos, ancestorOffset),
      resolvedAlignX: result.resolvedAlignX,
      resolvedAlignY: result.resolvedAlignY,
    }
  }

  if (type === 'modal') {
    if (!contentEl) {
      devWarn(
        '[@vitus-labs/elements] Overlay (modal): contentRef is not attached. ' +
          'Modal position cannot be calculated without a content element.',
      )
      return { pos: {} }
    }
    const c = contentEl.getBoundingClientRect()
    return {
      pos: adjustForAncestor(
        calcModalPos(c, alignX, alignY, offsetX, offsetY),
        ancestorOffset,
      ),
    }
  }

  return { pos: {} }
}

const processVisibilityEvent = (
  e: Event,
  active: boolean,
  openOn: string,
  closeOn: string,
  isTrigger: (e: Event) => boolean,
  isContent: (e: Event) => boolean,
  showContent: () => void,
  hideContent: () => void,
) => {
  // Open on click (hover is handled by dedicated mouseenter/mouseleave)
  if (!active && openOn === 'click' && e.type === 'click' && isTrigger(e)) {
    showContent()
    return
  }

  if (!active) return

  // Close handlers
  if (closeOn === 'hover' && e.type === 'scroll') {
    hideContent()
    return
  }

  if (e.type !== 'click') return

  if (closeOn === 'click') {
    hideContent()
  } else if (closeOn === 'clickOnTrigger' && isTrigger(e)) {
    hideContent()
  } else if (closeOn === 'clickOutsideContent' && !isContent(e)) {
    hideContent()
  }
}

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
    if (!active || !isContentLoaded) return {}

    const result = computePosition(
      type,
      align,
      alignX,
      alignY,
      offsetX,
      offsetY,
      triggerRef.current,
      contentRef.current,
      getAncestorOffset(),
    )

    if (result.resolvedAlignX) setInnerAlignX(result.resolvedAlignX)
    if (result.resolvedAlignY) setInnerAlignY(result.resolvedAlignY)

    return result.pos
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

      processVisibilityEvent(
        e,
        active,
        openOn,
        closeOn,
        isNodeOrChild(triggerRef),
        isNodeOrChild(contentRef),
        showContent,
        hideContent,
      )
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

  const handleContentPosition = useMemo(
    () => throttle(() => latestSetContentPosition.current(), throttleDelay),
    [throttleDelay],
  )

  const handleClick = handleVisibilityByEventType

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
      onOpen?.()
      ctx.setBlocked?.()
    } else if (!active && wasActive) {
      setContentLoaded(false)
      onClose?.()
      ctx.setUnblocked?.()
    } else if (!active) {
      setContentLoaded(false)
    }

    return () => {
      // On unmount, only clean up if currently active
      if (active) {
        onClose?.()
        ctx.setUnblocked?.()
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

    if (closeOn !== 'hover') parentContainer.style.overflow = 'hidden'

    const onScroll = (e: Event) => {
      handleContentPosition()
      handleVisibility(e)
    }

    parentContainer.addEventListener('scroll', onScroll, { passive: true })

    return () => {
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
