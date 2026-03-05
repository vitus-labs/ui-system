import { useEffect, useRef } from 'react'

export type UseClickOutside = (
  ref: { current: Element | null },
  handler: (event: Event) => void,
) => void

/**
 * Calls `handler` when a click (mousedown or touchstart) occurs
 * outside the element referenced by `ref`.
 */
const useClickOutside: UseClickOutside = (ref, handler) => {
  const handlerRef = useRef(handler)
  handlerRef.current = handler

  useEffect(() => {
    const listener = (event: Event) => {
      const el = ref.current
      const target = event.target as Node | null
      if (!el || !target || el.contains(target)) return
      handlerRef.current(event)
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref])
}

export default useClickOutside
