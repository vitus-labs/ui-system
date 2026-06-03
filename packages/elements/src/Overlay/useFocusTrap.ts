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
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[contenteditable]:not([contenteditable="false"])',
  'video[controls]',
  'audio[controls]',
  'summary',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

const isTabbable = (el: HTMLElement): boolean =>
  el.getAttribute('aria-disabled') !== 'true'

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

    const observer = new MutationObserver(refresh)
    observer.observe(container, { childList: true, subtree: true })

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
      if (e.key !== 'Tab' || focusable.length === 0) return

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
      if (autoFocus && prevFocus && typeof prevFocus.focus === 'function') {
        prevFocus.focus()
      }
    }
  }, [ref, enabled, autoFocus])
}

export default useFocusTrap
