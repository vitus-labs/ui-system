import { useEffect } from 'react'
import useRefElement from './useRefElement'

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

const FOCUSABLE_ATTRS = [
  'disabled',
  'tabindex',
  'aria-disabled',
  'contenteditable',
  'href',
  'hidden',
]

// Only filter `aria-disabled="true"` here — a CSS attribute selector
// can't reliably exclude that. Visibility (display:none / hidden parents)
// is left to the consumer because reading `offsetParent` is a layout
// thrash in production and unreliable under jsdom (no layout engine).
const isTabbable = (el: HTMLElement): boolean =>
  el.getAttribute('aria-disabled') !== 'true'

// Where a Tab keypress must move focus to, or `undefined` to let the
// browser move it natively (between two trapped elements). `focusable`
// must be non-empty.
const getWrapTarget = (
  focusable: HTMLElement[],
  active: Element | null,
  backward: boolean,
): HTMLElement | undefined => {
  const lastIndex = focusable.length - 1
  const index = focusable.indexOf(active as HTMLElement)
  // Focus is not on a trapped element: it escaped the container (e.g. user
  // clicked outside), or sits on the container itself / a non-tabbable
  // descendant. Native Tab order from there can leave the container, so
  // route it explicitly: Tab -> first, Shift+Tab -> last.
  if (index === -1) return focusable[backward ? lastIndex : 0]
  if (backward && index === 0) return focusable[lastIndex]
  if (!backward && index === lastIndex) return focusable[0]
  return undefined
}

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
  // Tracked as state so a container that mounts after the hook is trapped.
  const container = useRefElement(ref)

  useEffect(() => {
    if (!enabled) return undefined
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
    observer.observe(container, {
      childList: true,
      subtree: true,
      // Elements toggling disabled/hidden/etc. change focusability without
      // any child being added or removed.
      attributes: true,
      attributeFilter: FOCUSABLE_ATTRS,
    })

    // Make the container focusable if it isn't already, then focus it.
    const focusContainer = () => {
      if (container.tabIndex < 0) container.tabIndex = -1
      container.focus()
    }

    // Save current focus and move it into the container.
    const prevFocus = document.activeElement as HTMLElement | null
    if (autoFocus) {
      if (focusable.length > 0) {
        // biome-ignore lint/style/noNonNullAssertion: length > 0 guarantees [0]
        focusable[0]!.focus()
      } else {
        focusContainer()
      }
    }

    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      // Nothing tabbable inside: swallow Tab entirely so focus can't leave,
      // and pull it back onto the container if it already escaped.
      if (focusable.length === 0) {
        e.preventDefault()
        if (!container.contains(document.activeElement)) focusContainer()
        return
      }

      const target = getWrapTarget(
        focusable,
        document.activeElement,
        e.shiftKey,
      )
      if (target) {
        e.preventDefault()
        target.focus()
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
  }, [container, enabled, autoFocus])
}

export default useFocusTrap
