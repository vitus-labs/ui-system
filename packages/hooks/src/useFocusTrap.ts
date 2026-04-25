import { useEffect } from 'react'

export type UseFocusTrap = (
  ref: { current: HTMLElement | null },
  enabled?: boolean,
) => void

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

const wrapFocus = (e: KeyboardEvent, target: HTMLElement | undefined) => {
  if (!target) return
  e.preventDefault()
  target.focus()
}

/**
 * Traps keyboard focus within the referenced container.
 * Tab and Shift+Tab cycle through focusable elements inside.
 * Useful for modals, dialogs, and dropdown menus.
 *
 * Focusable elements are cached and only re-queried when DOM mutations
 * inside the container add/remove nodes — not on every Tab keypress.
 */
const useFocusTrap: UseFocusTrap = (ref, enabled = true) => {
  useEffect(() => {
    if (!enabled) return undefined
    const container = ref.current
    if (!container) return undefined

    let focusable: NodeListOf<HTMLElement> | null = null
    const refresh = () => {
      focusable = container.querySelectorAll<HTMLElement>(FOCUSABLE)
    }
    refresh()

    // Re-query only when the container's DOM tree changes (rare),
    // not on every Tab keypress.
    const observer = new MutationObserver(refresh)
    observer.observe(container, { childList: true, subtree: true })

    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !focusable || focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement

      if (e.shiftKey && active === first) {
        wrapFocus(e, last)
      } else if (!e.shiftKey && active === last) {
        wrapFocus(e, first)
      }
    }

    document.addEventListener('keydown', handler)
    return () => {
      observer.disconnect()
      document.removeEventListener('keydown', handler)
    }
  }, [ref, enabled])
}

export default useFocusTrap
