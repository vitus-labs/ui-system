import { useRef } from 'react'

export type UseLatest = <T>(value: T) => { readonly current: T }

/**
 * Returns a ref that always holds the latest value.
 * Useful to avoid stale closures in callbacks and effects.
 */
const useLatest: UseLatest = (value) => {
  const ref = useRef(value)
  ref.current = value
  return ref
}

export default useLatest
