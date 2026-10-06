import { useEffect, useRef } from 'react'

// Stack of currently open escape-enabled overlays (most recent last). Only the
// topmost one reacts to Escape so a single keypress closes one layer at a time.
const stack: symbol[] = []

/** Closes the overlay on Escape keypress when `enabled` and `active`. */
const useEscapeKey = (
  enabled: boolean,
  active: boolean,
  blocked: boolean,
  hide: () => void,
) => {
  const hideRef = useRef(hide)
  hideRef.current = hide
  const blockedRef = useRef(blocked)
  blockedRef.current = blocked

  useEffect(() => {
    if (!enabled || !active) return undefined

    const token = Symbol('overlay')
    stack.push(token)

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || blockedRef.current) return
      if (stack[stack.length - 1] !== token) return
      hideRef.current()
    }

    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      const i = stack.indexOf(token)
      if (i !== -1) stack.splice(i, 1)
    }
  }, [enabled, active])
}

export default useEscapeKey
