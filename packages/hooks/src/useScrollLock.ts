import { useEffect } from 'react'

export type UseScrollLock = (enabled: boolean) => void

// Refcount + original-overflow snapshot live on a `globalThis` symbol so
// this hook and `@vitus-labs/elements`'s internal copy (Overlay/
// useScrollLock.ts) cooperate on ONE shared registry. Without this,
// pairing an Overlay modal with this hook in the same app gives each
// package its own counter and original-overflow snapshot — the release
// order can leave the page silently scroll-locked. The Symbol.for() key
// matches the elements-side key exactly: a consumer using BOTH packages
// gets one canonical state regardless of install topology.

type Registry = { count: number; original: string | undefined }
const REGISTRY_KEY: unique symbol = Symbol.for('@vitus-labs/scroll-lock')
const getRegistry = (): Registry => {
  const g = globalThis as unknown as Record<symbol, Registry>
  if (!g[REGISTRY_KEY]) g[REGISTRY_KEY] = { count: 0, original: undefined }
  return g[REGISTRY_KEY] as Registry
}

/**
 * Locks page scroll by setting `overflow: hidden` on `document.body`.
 * Uses a global-symbol refcount so concurrent locks (including the
 * internal copy used by @vitus-labs/elements' Overlay) don't clobber
 * each other's original-overflow snapshot.
 */
const useScrollLock: UseScrollLock = (enabled) => {
  useEffect(() => {
    if (!enabled) return undefined

    const reg = getRegistry()
    if (reg.count === 0) {
      reg.original = document.body.style.overflow
    }
    reg.count++
    document.body.style.overflow = 'hidden'

    return () => {
      reg.count--
      if (reg.count === 0) {
        document.body.style.overflow = reg.original ?? ''
        reg.original = undefined
      }
    }
  }, [enabled])
}

export default useScrollLock
