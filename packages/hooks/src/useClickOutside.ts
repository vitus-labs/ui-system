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
      if (!el || el.contains(event.target as Node)) return
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
