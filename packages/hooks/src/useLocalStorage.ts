import { useCallback, useRef, useSyncExternalStore } from 'react'

export type UseLocalStorage = <T>(
  key: string,
  initialValue: T,
) => [T, (value: T | ((prev: T) => T)) => void, () => void]

const isServer = () => typeof window === 'undefined'

// ── Shared store ─────────────────────────────────────────────────────
// Same-tab instances are notified through `listeners` (the native
// `storage` event only fires in OTHER documents). One `storage` listener
// on window covers cross-tab sync for every instance.
const listeners = new Set<() => void>()

// Raw values that could not be written to / removed from localStorage
// (private mode, quota exceeded). They shadow storage so the in-memory
// value still updates and stays shared between same-key instances.
const memory = new Map<string, string | null>()

const notify = () => {
  for (const cb of listeners) cb()
}

const onStorage = (e: StorageEvent) => {
  if (e.storageArea !== window.localStorage) return
  // Another document wrote this key — storage is the source of truth again.
  if (e.key === null) memory.clear()
  else memory.delete(e.key)
  notify()
}

const subscribe = (cb: () => void) => {
  listeners.add(cb)
  if (listeners.size === 1) window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(cb)
    if (listeners.size === 0) window.removeEventListener('storage', onStorage)
  }
}

const readRaw = (key: string): string | null => {
  if (memory.has(key)) return memory.get(key) ?? null
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

const writeRaw = (key: string, raw: string | null) => {
  try {
    if (raw === null) window.localStorage.removeItem(key)
    else window.localStorage.setItem(key, raw)
    memory.delete(key)
  } catch {
    // Private mode / quota — keep the value in memory but skip persist.
    memory.set(key, raw)
  }
  notify()
}

/**
 * State synced with `localStorage`. SSR-safe and tolerant of
 * private-mode / quota-exceeded errors.
 *
 * Built on `useSyncExternalStore`: the server and the hydrating client
 * render `initialValue` (no hydration mismatch), then React re-renders
 * with the stored value. Client-only renders read storage on the first
 * render. All instances using the same key stay in sync — within the tab
 * and across tabs.
 *
 * Returns `[value, setValue, remove]`. `setValue` accepts either a new
 * value or an updater function; `remove` clears the entry and resets the
 * value to `initialValue`.
 *
 * @example
 * ```ts
 * const [theme, setTheme, clear] = useLocalStorage('theme', 'dark')
 * ```
 */
const useLocalStorage: UseLocalStorage = <T>(key: string, initialValue: T) => {
  // Held in a ref so an inline-object initialValue doesn't change callback
  // identities or re-subscribe every render.
  const initialRef = useRef(initialValue)
  initialRef.current = initialValue

  // Parsed-value cache keyed by the raw string, so the snapshot is
  // referentially stable while storage is unchanged (required by
  // useSyncExternalStore — JSON.parse returns a fresh object every call).
  const cacheRef = useRef<{ key: string; raw: string | null; value: T }>(
    undefined,
  )

  const getSnapshot = useCallback((): T => {
    const raw = readRaw(key)
    const cache = cacheRef.current
    if (cache && cache.key === key && cache.raw === raw) return cache.value

    let value: T
    if (raw === null) value = initialRef.current
    else {
      try {
        value = JSON.parse(raw) as T
      } catch {
        // Malformed entry: keep the last good value for this key, else the
        // initial value.
        value = cache && cache.key === key ? cache.value : initialRef.current
      }
    }
    cacheRef.current = { key, raw, value }
    return value
  }, [key])

  const getServerSnapshot = useCallback(() => initialRef.current, [])

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      if (isServer()) return
      const resolved =
        typeof next === 'function' ? (next as (p: T) => T)(getSnapshot()) : next
      writeRaw(key, JSON.stringify(resolved))
    },
    [key, getSnapshot],
  )

  const remove = useCallback(() => {
    if (isServer()) return
    writeRaw(key, null)
  }, [key])

  return [value, update, remove]
}

export default useLocalStorage
