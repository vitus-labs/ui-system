import { useEffect } from 'react'

// Local copy: kept inside elements so the package stays independent of
// @vitus-labs/hooks. The reference counter is module-global on PURPOSE —
// multiple concurrent overlays must agree on a single "restore" point for
// the body's original overflow. Don't lift this state into React.

export type UseScrollLock = (enabled: boolean) => void

let lockCount = 0
let originalOverflow: string | undefined

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
