import { useEffect } from 'react'

export type UseScrollLock = (enabled: boolean) => void

// Refcount + original-overflow snapshot live on `document.body.dataset`
// (the same keys used by `@vitus-labs/elements`'s internal copy at
// Overlay/useScrollLock.ts). The body is the actual element being
// locked, so keeping the bookkeeping there means a consumer pairing this
// hook with an Overlay modal cooperates on ONE shared counter — no
// cross-package import, no globalThis, no shared module. Each
// implementation can stay package-local; the convention is the dataset
// key names.

const COUNT_KEY = 'vlScrollLockCount'
const ORIGINAL_KEY = 'vlScrollLockOriginal'

/**
 * Locks page scroll by setting `overflow: hidden` on `document.body`.
 * Uses a body-dataset refcount so concurrent locks (including the
 * internal copy used by @vitus-labs/elements' Overlay) don't clobber
 * each other's original-overflow snapshot.
 */
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
