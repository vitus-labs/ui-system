import { useEffect, useRef } from 'react'

export type UseClickOutside = (
  ref: { current: Element | null },
  handler: (event: Event) => void,
) => void

/**
 * Calls `handler` when a click (pointerdown, falling back to mousedown/touchstart) occurs
 * outside the element referenced by `ref`.
 */
const useClickOutside: UseClickOutside = (ref, handler) => {
  const handlerRef = useRef(handler)
  handlerRef.current = handler

  useEffect(() => {
    const listener = (event: Event) => {
      const el = ref.current
      const target = event.target as Node | null
      if (!el || !target) return
      // composedPath also handles targets removed from the DOM during the
      // event and shadow-DOM retargeting.
      const path =
        typeof event.composedPath === 'function' ? event.composedPath() : []
      if (path.length > 0 ? path.includes(el) : el.contains(target)) return
      handlerRef.current(event)
    }

    // pointerdown covers mouse, touch and pen with a single event, so the
    // handler fires once per tap (mousedown + touchstart fired twice).
    const events =
      typeof window !== 'undefined' && 'onpointerdown' in window
        ? ['pointerdown']
        : ['mousedown', 'touchstart']
    for (const name of events) document.addEventListener(name, listener)

    return () => {
      for (const name of events) document.removeEventListener(name, listener)
    }
  }, [ref])
}

export default useClickOutside
