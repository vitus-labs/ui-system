import { useCallback, useEffect, useRef, useState } from 'react'

const IS_SERVER = typeof window === 'undefined'

export type UseLocalStorage = <T>(
  key: string,
  initialValue: T,
) => [T, (value: T | ((prev: T) => T)) => void, () => void]

/**
 * State synced with `localStorage`. SSR-safe (returns `initialValue` on
 * the server) and tolerant of private-mode / quota-exceeded errors.
 *
 * Returns `[value, setValue, remove]`. `setValue` accepts either a new
 * value or an updater function; `remove` clears the entry and resets the
 * in-memory state to `initialValue`.
 *
 * @example
 * ```ts
 * const [theme, setTheme, clear] = useLocalStorage('theme', 'dark')
 * ```
 */
const useLocalStorage: UseLocalStorage = <T>(key: string, initialValue: T) => {
  // Held in a ref so an inline-object initialValue doesn't change callback
  // identities or re-subscribe the storage listener every render.
  const initialRef = useRef(initialValue)
  initialRef.current = initialValue

  const read = (): T => {
    if (IS_SERVER) return initialRef.current
    try {
      const raw = window.localStorage.getItem(key)
      return raw === null ? initialRef.current : (JSON.parse(raw) as T)
    } catch {
      return initialRef.current
    }
  }

  const [value, setValue] = useState<T>(read)

  // Re-read when `key` changes (skip the initial mount, already read above).
  const keyRef = useRef(key)
  // biome-ignore lint/correctness/useExhaustiveDependencies: read is a closure over key and a ref
  useEffect(() => {
    if (keyRef.current === key) return
    keyRef.current = key
    setValue(read())
  }, [key])

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved =
          typeof next === 'function' ? (next as (p: T) => T)(prev) : next
        if (!IS_SERVER) {
          try {
            window.localStorage.setItem(key, JSON.stringify(resolved))
          } catch {
            // Private mode / quota — keep the in-memory value but skip persist.
          }
        }
        return resolved
      })
    },
    [key],
  )

  const remove = useCallback(() => {
    if (!IS_SERVER) {
      try {
        window.localStorage.removeItem(key)
      } catch {
        // ignore
      }
    }
    setValue(initialRef.current)
  }, [key])

  // Cross-tab sync: when another document updates the same key, mirror it.
  useEffect(() => {
    if (IS_SERVER) return undefined
    const onStorage = (e: StorageEvent) => {
      if (e.key !== key || e.storageArea !== window.localStorage) return
      if (e.newValue === null) {
        setValue(initialRef.current)
        return
      }
      try {
        setValue(JSON.parse(e.newValue) as T)
      } catch {
        // malformed remote write — ignore
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [key])

  return [value, update, remove]
}

export default useLocalStorage
