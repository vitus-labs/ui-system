import { useEffect } from 'react'

/** Closes the overlay on Escape keypress when `enabled` and `active`. */
const useEscapeKey = (
  enabled: boolean,
  active: boolean,
  blocked: boolean,
  hide: () => void,
) => {
  useEffect(() => {
    if (!enabled || !active || blocked) return undefined

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') hide()
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [enabled, active, blocked, hide])
}

export default useEscapeKey
