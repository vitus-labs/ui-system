import { useEffect, useState } from 'react'

export type UseDebouncedValue = <T>(value: T, delay: number) => T

/**
 * Returns a debounced version of the value that only updates
 * after `delay` ms of inactivity.
 *
 * @example
 * ```ts
 * const [search, setSearch] = useState('')
 * const debouncedSearch = useDebouncedValue(search, 300)
 * ```
 */
const useDebouncedValue: UseDebouncedValue = (value, delay) => {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])

  return debounced
}

export default useDebouncedValue
