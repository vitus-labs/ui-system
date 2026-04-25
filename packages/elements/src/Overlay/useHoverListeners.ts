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
      hoverTimeoutRef.current = setTimeout(hideContent, hoverDelay)
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
    hoverDelay,
    showContent,
    hideContent,
  ])
}

export default useHoverListeners
