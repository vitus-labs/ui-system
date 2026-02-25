import { useEffect, useRef } from 'react'

export type UseKeyboard = (
  key: string,
  handler: (event: KeyboardEvent) => void,
) => void

/**
 * Listens for a specific keyboard key and calls the handler.
 * Matches `event.key` (e.g. `"Escape"`, `"Enter"`, `"a"`).
 * Always calls the latest handler (no stale closures).
 *
 * @example
 * ```ts
 * useKeyboard('Escape', () => setOpen(false))
 * ```
 */
const useKeyboard: UseKeyboard = (key, handler) => {
  const handlerRef = useRef(handler)
  handlerRef.current = handler

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === key) handlerRef.current(e)
    }

    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [key])
}

export default useKeyboard
