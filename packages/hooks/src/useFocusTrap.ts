import { useEffect } from 'react'

export type UseFocusTrap = (
  ref: { current: HTMLElement | null },
  enabled?: boolean,
) => void

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Traps keyboard focus within the referenced container.
 * Tab and Shift+Tab cycle through focusable elements inside.
 * Useful for modals, dialogs, and dropdown menus.
 */
const useFocusTrap: UseFocusTrap = (ref, enabled = true) => {
  useEffect(() => {
    if (!enabled) return undefined

    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !ref.current) return

      const focusable = ref.current.querySelectorAll<HTMLElement>(FOCUSABLE)
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }

    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [ref, enabled])
}

export default useFocusTrap
