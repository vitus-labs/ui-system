import { throttle } from '@vitus-labs/core'
import { useCallback, useEffect, useRef, useState } from 'react'

type Sizes = {
  width: number
  height: number
}

export type UseWindowResize = (
  params?: Partial<{
    throttleDelay: number
    onChange: (params: Sizes) => void
  }>,
  initialValues?: Partial<Sizes>,
) => Sizes

/**
 * Tracks the browser viewport size, throttled to avoid excessive re-renders.
 * Reads `window.innerWidth`/`innerHeight` on mount and on every resize event.
 * An optional `onChange` callback fires alongside state updates.
 * Cleans up both the event listener and any pending throttled call on unmount.
 */
const useWindowResize: UseWindowResize = (
  { throttleDelay = 200, onChange } = {},
  { width = 0, height = 0 } = {},
) => {
  const [windowSize, setWindowSize] = useState({ width, height })
  const lastSizesRef = useRef({ width, height })
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  const updateSizes = useCallback(() => {
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    }

    // Bail out of re-rendering when dimensions are unchanged
    // (e.g. a throttle trailing call after the size settled)
    setWindowSize((prev) =>
      prev.width === sizes.width && prev.height === sizes.height ? prev : sizes,
    )

    const last = lastSizesRef.current
    if (last.width !== sizes.width || last.height !== sizes.height) {
      lastSizesRef.current = sizes
      if (onChangeRef.current) onChangeRef.current(sizes)
    }
  }, [])

  useEffect(() => {
    updateSizes()
  }, [updateSizes])

  useEffect(() => {
    const throttled = throttle(updateSizes, throttleDelay)
    window.addEventListener('resize', throttled, false)

    return () => {
      window.removeEventListener('resize', throttled, false)
      throttled.cancel()
    }
  }, [updateSizes, throttleDelay])

  return windowSize
}

export default useWindowResize
