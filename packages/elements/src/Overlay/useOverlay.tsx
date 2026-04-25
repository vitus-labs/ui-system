/**
 * Core hook powering the Overlay component. Manages open/close state, DOM
 * event listeners (click, hover, scroll, resize, ESC key), and dynamic
 * positioning of overlay content relative to its trigger. Supports dropdown,
 * tooltip, popover, and modal types with automatic edge-of-viewport flipping.
 *
 * Pure positioning math lives in `./positionMath`. Event-listener concerns
 * live in dedicated hooks: `./useEscapeKey`, `./useHoverListeners`,
 * `./useScrollReposition`.
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
import Provider, { useOverlayContext } from './context'
import {
  type Align,
  type AlignX,
  type AlignY,
  computePosition,
  type OverlayPosition,
  type OverlayType,
  processVisibilityEvent,
} from './positionMath'
import useEscapeKey from './useEscapeKey'
import useHoverListeners from './useHoverListeners'
import useScrollReposition from './useScrollReposition'

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
  type: OverlayType
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
   * Delay in milliseconds before hiding content on hover leave. Bridges the
   * gap between trigger and content elements to prevent flicker.
   * @defaultValue `100`
   */
  hoverDelay: number
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
  openOn = 'click',
  closeOn = 'click',
  type = 'dropdown',
  position = 'fixed',
  align = 'bottom',
  alignX = 'left',
  alignY = 'bottom',
  offsetX = 0,
  offsetY = 0,
  throttleDelay = 200,
  parentContainer,
  closeOnEsc = true,
  hoverDelay = 100,
  disabled,
  onOpen,
  onClose,
}: Partial<UseOverlayProps> = {}) => {
  const { rootSize } = useContext(context) as { rootSize: number }
  const ctx = useOverlayContext()
  const [isContentLoaded, setContentLoaded] = useState(false)

  const [innerAlignX, setInnerAlignX] = useState(alignX)
  const [innerAlignY, setInnerAlignY] = useState(alignY)

  const [blockedCount, setBlockedCount] = useState(0)
  const blocked = blockedCount > 0
  const [active, setActive] = useState(isOpen)

  const triggerRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLElement>(null)
  const prevFocusRef = useRef<HTMLElement | null>(null)

  const setBlocked = useCallback(() => setBlockedCount((c) => c + 1), [])
  const setUnblocked = useCallback(
    () => setBlockedCount((c) => Math.max(0, c - 1)),
    [],
  )

  const showContent = useCallback(() => setActive(true), [])
  const hideContent = useCallback(() => setActive(false), [])

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
    assignContentPosition(calculateContentPosition())
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

  // Stable click handler — uses ref so the window listener is never re-attached.
  const handleClick = useCallback(
    (e: Event) => latestHandleVisibility.current(e),
    [],
  )

  const handleVisibility = useMemo(
    () =>
      throttle((e: Event) => latestHandleVisibility.current(e), throttleDelay),
    [throttleDelay],
  )

  // ----------------------------------------------------------------------
  // Effects: prop sync, initial positioning, lifecycle, focus management
  // ----------------------------------------------------------------------

  useEffect(() => {
    setInnerAlignX(alignX)
    setInnerAlignY(alignY)
    if (disabled) hideContent()
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

  // Focus management for modals: save active element on open, restore on close.
  useEffect(() => {
    if (type !== 'modal') return

    if (active && isContentLoaded && contentRef.current) {
      prevFocusRef.current = document.activeElement as HTMLElement | null
      // Make content focusable if it isn't already, then focus it.
      if (contentRef.current.tabIndex < 0) {
        contentRef.current.tabIndex = -1
      }
      contentRef.current.focus()
    }

    if (!active && prevFocusRef.current) {
      prevFocusRef.current.focus()
      prevFocusRef.current = null
    }
  }, [active, isContentLoaded, type])

  // ----------------------------------------------------------------------
  // Composed listener hooks
  // ----------------------------------------------------------------------

  useEscapeKey(closeOnEsc, active, blocked, hideContent)

  useScrollReposition({
    active,
    type,
    parentContainer,
    closeOn,
    handleContentPosition,
    handleVisibility,
  })

  // Click-based open/close: attach to window
  useEffect(() => {
    if (blocked || disabled) return undefined

    const enabledClick =
      openOn === 'click' ||
      ['click', 'clickOnTrigger', 'clickOutsideContent'].includes(closeOn)

    if (enabledClick) window.addEventListener('click', handleClick)

    return () => window.removeEventListener('click', handleClick)
  }, [openOn, closeOn, blocked, disabled, handleClick])

  useHoverListeners({
    triggerRef,
    contentRef,
    isContentLoaded,
    active,
    blocked,
    disabled,
    openOn,
    closeOn,
    hoverDelay,
    showContent,
    hideContent,
  })

  // hack-ish way to load content correctly on the first load
  // as `contentRef` is loaded dynamically
  const contentRefCallback = useCallback((node: HTMLElement | null) => {
    contentRef.current = node
    setContentLoaded(!!node)
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
