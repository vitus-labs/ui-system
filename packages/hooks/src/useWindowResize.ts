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

const useWindowResize: UseWindowResize = (
  { throttleDelay = 200, onChange } = {},
  { width = 0, height = 0 } = {},
) => {
  const [windowSize, setWindowSize] = useState({ width, height })
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  const updateSizes = useCallback(() => {
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    }

    setWindowSize(sizes)
    if (onChangeRef.current) onChangeRef.current(sizes)
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
