import { useEffect } from 'react'

export type UseFocusTrapOptions = {
  autoFocus?: boolean
}

export type UseFocusTrap = (
  ref: { current: HTMLElement | null },
  enabled?: boolean,
  options?: UseFocusTrapOptions,
) => void

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[contenteditable]:not([contenteditable="false"])',
  'video[controls]',
  'audio[controls]',
  'summary',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

// Stack of currently active traps (most recent last). Only the topmost trap
// handles Tab, so a nested modal's trap isn't hijacked by its parent's trap
// pulling focus back to the parent's first control.
const stack: symbol[] = []

const isTabbable = (el: HTMLElement, container: HTMLElement): boolean => {
  if (el.getAttribute('aria-disabled') === 'true') return false
  // Skip descendants of `hidden` / `inert` subtrees (attribute checks only —
  // no layout reads; this runs in the MutationObserver refresh, not on Tab).
  const excluded = el.closest('[hidden],[inert]')
  return !excluded || !container.contains(excluded)
}

const useFocusTrap: UseFocusTrap = (ref, enabled = true, options) => {
  const autoFocus = options?.autoFocus !== false

  useEffect(() => {
    if (!enabled) return undefined
    const container = ref.current
    if (!container) return undefined

    let focusable: HTMLElement[] = []
    const refresh = () => {
      const all = container.querySelectorAll<HTMLElement>(FOCUSABLE)
      const result: HTMLElement[] = []
      // Index loop — `NodeList` iterator allocates; index access doesn't.
      for (let i = 0; i < all.length; i++) {
        const el = all[i]
        if (el && isTabbable(el, container)) result.push(el)
      }
      focusable = result
    }
    refresh()

    const observer = new MutationObserver(refresh)
    observer.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['hidden', 'inert', 'disabled', 'tabindex', 'type'],
    })

    const token = Symbol('focusTrap')
    stack.push(token)

    const prevFocus = document.activeElement as HTMLElement | null
    if (autoFocus) {
      if (focusable.length > 0) {
        // biome-ignore lint/style/noNonNullAssertion: length > 0 guarantees [0]
        focusable[0]!.focus()
      } else {
        if (container.tabIndex < 0) container.tabIndex = -1
        container.focus()
      }
    }

    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      if (stack[stack.length - 1] !== token) return

      // Nothing tabbable inside — keep focus on the container instead of
      // letting Tab escape the modal.
      if (focusable.length === 0) {
        e.preventDefault()
        return
      }

      // biome-ignore lint/style/noNonNullAssertion: length > 0 guarantees first/last
      const first = focusable[0]!
      // biome-ignore lint/style/noNonNullAssertion: length > 0 guarantees first/last
      const last = focusable[focusable.length - 1]!
      const active = document.activeElement

      if (active && !container.contains(active)) {
        e.preventDefault()
        first.focus()
        return
      }

      if (e.shiftKey && active === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handler)
    return () => {
      observer.disconnect()
      document.removeEventListener('keydown', handler)
      const i = stack.indexOf(token)
      if (i !== -1) stack.splice(i, 1)
      if (autoFocus && prevFocus && typeof prevFocus.focus === 'function') {
        prevFocus.focus()
      }
    }
  }, [ref, enabled, autoFocus])
}

export default useFocusTrap
