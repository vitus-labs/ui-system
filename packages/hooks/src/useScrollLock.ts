import { useEffect } from 'react'

export type UseScrollLock = (enabled: boolean) => void

/**
 * Locks page scroll by setting `overflow: hidden` on `document.body`.
 * Restores the original overflow value on disable or unmount.
 */
const useScrollLock: UseScrollLock = (enabled) => {
  useEffect(() => {
    if (!enabled) return undefined

    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = original
    }
  }, [enabled])
}

export default useScrollLock
