import { useEffect } from 'react'

export type UseFocusTrapOptions = {
  /**
   * If true, on enable: move focus to the first focusable element inside
   * the container (or the container itself when none exist). Restores focus
   * to the previously-active element on disable. Default `true`.
   */
  autoFocus?: boolean
}

export type UseFocusTrap = (
  ref: { current: HTMLElement | null },
  enabled?: boolean,
  options?: UseFocusTrapOptions,
) => void

// Widened from the prior selector to include common interactive elements
// the original missed (contenteditable, native media controls, <summary>).
// `aria-disabled` is filtered at refresh time because CSS attribute
// selectors don't honor falsy values uniformly across browsers.
const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[contenteditable]:not([contenteditable="false"])',
  'video[controls]',
  'audio[controls]',
  'summary',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

// Only filter `aria-disabled="true"` here — a CSS attribute selector
// can't reliably exclude that. Visibility (display:none / hidden parents)
// is left to the consumer because reading `offsetParent` is a layout
// thrash in production and unreliable under jsdom (no layout engine).
const isTabbable = (el: HTMLElement): boolean =>
  el.getAttribute('aria-disabled') !== 'true'

/**
 * Traps keyboard focus within the referenced container.
 * Tab and Shift+Tab cycle through focusable elements inside.
 * Useful for modals, dialogs, and dropdown menus.
 *
 * With `autoFocus` (default `true`), focus moves INTO the container on
 * enable and is restored to the previously-focused element on disable —
 * matching the Dialog WAI-ARIA pattern. Pair with `useScrollLock` for full
 * modal a11y.
 *
 * Focusable elements are cached and only re-queried when DOM mutations
 * inside the container add/remove nodes — not on every Tab keypress.
 */
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
      for (const el of all) if (isTabbable(el)) result.push(el)
      focusable = result
    }
    refresh()

    // Re-query only when the container's DOM tree changes (rare),
    // not on every Tab keypress.
    const observer = new MutationObserver(refresh)
    observer.observe(container, { childList: true, subtree: true })

    // Save current focus and move it into the container.
    const prevFocus = document.activeElement as HTMLElement | null
    if (autoFocus) {
      if (focusable.length > 0) {
        // biome-ignore lint/style/noNonNullAssertion: length > 0 guarantees [0]
        focusable[0]!.focus()
      } else {
        // Make the container focusable if it isn't already, then focus it.
        if (container.tabIndex < 0) container.tabIndex = -1
        container.focus()
      }
    }

    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || focusable.length === 0) return

      // biome-ignore lint/style/noNonNullAssertion: length > 0 guarantees first/last
      const first = focusable[0]!
      // biome-ignore lint/style/noNonNullAssertion: length > 0 guarantees first/last
      const last = focusable[focusable.length - 1]!
      const active = document.activeElement

      // If focus has escaped the container (e.g. user clicked outside),
      // pull it back to the first focusable on Tab.
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
      // Restore previous focus on disable (only when we autoFocused in).
      if (autoFocus && prevFocus && typeof prevFocus.focus === 'function') {
        prevFocus.focus()
      }
    }
  }, [ref, enabled, autoFocus])
}

export default useFocusTrap
