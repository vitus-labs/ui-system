import { useEffect } from 'react'

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
