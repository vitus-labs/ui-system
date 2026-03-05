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
      const active = document.activeElement

      if (e.shiftKey && active === first) {
        wrapFocus(e, last)
      } else if (!e.shiftKey && active === last) {
        wrapFocus(e, first)
      }
    }

    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [ref, enabled])
}

export default useFocusTrap
