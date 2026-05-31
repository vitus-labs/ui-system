import { useEffect } from 'react'

export type UseScrollLock = (enabled: boolean) => void

type Registry = { count: number; original: string | undefined }
const REGISTRY_KEY: unique symbol = Symbol.for('@vitus-labs/scroll-lock')
const getRegistry = (): Registry => {
  const g = globalThis as unknown as Record<symbol, Registry>
  if (!g[REGISTRY_KEY]) g[REGISTRY_KEY] = { count: 0, original: undefined }
  return g[REGISTRY_KEY] as Registry
}

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
