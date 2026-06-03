import { useEffect } from 'react'

export type UseScrollLock = (enabled: boolean) => void

// Reference counter to handle concurrent scroll locks safely.
// When multiple overlays/modals lock scroll simultaneously,
// the original overflow is only restored when the last one unlocks.
let lockCount = 0
let originalOverflow: string | undefined

/**
 * Locks page scroll by setting `overflow: hidden` on `document.body`.
 * Uses a reference counter so concurrent locks don't clobber each other.
 */
const useScrollLock: UseScrollLock = (enabled) => {
  useEffect(() => {
    if (!enabled) return undefined

    if (lockCount === 0) {
      originalOverflow = document.body.style.overflow
    }
    lockCount++
    document.body.style.overflow = 'hidden'

    return () => {
      lockCount--
      if (lockCount === 0) {
        document.body.style.overflow = originalOverflow ?? ''
        originalOverflow = undefined
      }
    }
  }, [enabled])
}

export default useScrollLock
