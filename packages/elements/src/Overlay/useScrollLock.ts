import { useEffect } from 'react'

export type UseScrollLock = (enabled: boolean) => void

const COUNT_KEY = 'vlScrollLockCount'
const ORIGINAL_KEY = 'vlScrollLockOriginal'

const useScrollLock: UseScrollLock = (enabled) => {
  useEffect(() => {
    if (!enabled) return undefined

    const { body } = document
    const count = Number(body.dataset[COUNT_KEY] ?? '0')
    if (count === 0) body.dataset[ORIGINAL_KEY] = body.style.overflow
    body.dataset[COUNT_KEY] = String(count + 1)
    body.style.overflow = 'hidden'

    return () => {
      const next = Number(body.dataset[COUNT_KEY] ?? '0') - 1
      if (next <= 0) {
        body.style.overflow = body.dataset[ORIGINAL_KEY] ?? ''
        delete body.dataset[COUNT_KEY]
        delete body.dataset[ORIGINAL_KEY]
      } else {
        body.dataset[COUNT_KEY] = String(next)
      }
    }
  }, [enabled])
}

export default useScrollLock
