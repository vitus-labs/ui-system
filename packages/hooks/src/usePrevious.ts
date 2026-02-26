import { useEffect, useRef } from 'react'

export type UsePrevious = <T>(value: T) => T | undefined

/**
 * Returns the value from the previous render.
 * Returns `undefined` on the first render.
 */
const usePrevious: UsePrevious = (value) => {
  const ref = useRef<typeof value | undefined>(undefined)

  useEffect(() => {
    ref.current = value
  })

  return ref.current
}

export default usePrevious
