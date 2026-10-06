import { useEffect, useRef } from 'react'

type HoverConfig = {
  triggerRef: { current: HTMLElement | null }
  contentRef: { current: HTMLElement | null }
  /** Re-runs the effect when content mounts/unmounts so listeners attach to the live element. */
  isContentLoaded: boolean
  active: boolean
  blocked: boolean
  disabled: boolean | undefined
  openOn: string
  closeOn: string
  hoverDelay: number
  showContent: () => void
  hideContent: () => void
}

/**
 * Hover-based open/close. Uses mouseenter/mouseleave on trigger + content
 * (instead of window-level mousemove) and a configurable delay to bridge
 * the gap between trigger and content elements without flicker.
 */
const useHoverListeners = ({
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
}: HoverConfig) => {
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Pointer / focus presence over trigger and content. A ref, not effect
  // locals: the effect re-runs when `active` flips while the pointer is still
  // there. Content flags reset when content unmounts (no mouseleave fires).
  const presenceRef = useRef({ trigger: 0, content: 0 })

  // biome-ignore lint/correctness/useExhaustiveDependencies: isContentLoaded signals contentRef.current is available so the effect re-runs to attach listeners
  useEffect(() => {
    const enabledHover = openOn === 'hover' || closeOn === 'hover'
    if (blocked || disabled || !enabledHover) return undefined

    const trigger = triggerRef.current
    const content = contentRef.current
    const presence = presenceRef.current
    if (!content) presence.content = 0

    const clearHoverTimeout = () => {
      if (hoverTimeoutRef.current != null) {
        clearTimeout(hoverTimeoutRef.current)
        hoverTimeoutRef.current = null
      }
    }

    const scheduleHide = () => {
      clearHoverTimeout()
      hoverTimeoutRef.current = setTimeout(hideContent, hoverDelay)
    }

    // Bit flags per element: 1 = pointer over it, 2 = focus inside it.
    // Pointer-leave hides once no pointer is over trigger/content (unchanged
    // mouse behaviour); focus-out hides only when nothing is hovered or
    // focused, so blurring the trigger while still hovering it keeps it open.
    const set = (el: 'trigger' | 'content', bit: number, on: boolean) => {
      presence[el] = on ? presence[el] | bit : presence[el] & ~bit
      if (on) {
        clearHoverTimeout()
        return
      }
      const mask = bit === 1 ? 1 : 3
      if (
        closeOn === 'hover' &&
        active &&
        (presence.trigger & mask) === 0 &&
        (presence.content & mask) === 0
      )
        scheduleHide()
    }

    const onMouseEnterTrigger = () => {
      set('trigger', 1, true)
      if (openOn === 'hover' && !active) showContent()
    }
    const onFocusInTrigger = () => {
      set('trigger', 2, true)
      if (openOn === 'hover' && !active) showContent()
    }
    const onMouseLeaveTrigger = () => set('trigger', 1, false)
    const onFocusOutTrigger = () => set('trigger', 2, false)
    const onMouseEnterContent = () => set('content', 1, true)
    const onFocusInContent = () => set('content', 2, true)
    const onMouseLeaveContent = () => set('content', 1, false)
    const onFocusOutContent = () => set('content', 2, false)

    if (trigger) {
      trigger.addEventListener('mouseenter', onMouseEnterTrigger)
      trigger.addEventListener('mouseleave', onMouseLeaveTrigger)
      // Keyboard parity: focus mirrors hover open/close.
      trigger.addEventListener('focusin', onFocusInTrigger)
      trigger.addEventListener('focusout', onFocusOutTrigger)
    }

    if (content) {
      content.addEventListener('mouseenter', onMouseEnterContent)
      content.addEventListener('mouseleave', onMouseLeaveContent)
      content.addEventListener('focusin', onFocusInContent)
      content.addEventListener('focusout', onFocusOutContent)
    }

    return () => {
      clearHoverTimeout()
      if (trigger) {
        trigger.removeEventListener('mouseenter', onMouseEnterTrigger)
        trigger.removeEventListener('mouseleave', onMouseLeaveTrigger)
        trigger.removeEventListener('focusin', onFocusInTrigger)
        trigger.removeEventListener('focusout', onFocusOutTrigger)
      }
      if (content) {
        content.removeEventListener('mouseenter', onMouseEnterContent)
        content.removeEventListener('mouseleave', onMouseLeaveContent)
        content.removeEventListener('focusin', onFocusInContent)
        content.removeEventListener('focusout', onFocusOutContent)
      }
    }
  }, [
    active,
    isContentLoaded,
    blocked,
    disabled,
    openOn,
    closeOn,
    hoverDelay,
    showContent,
    hideContent,
  ])
}

export default useHoverListeners
