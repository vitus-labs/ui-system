import { useState, useEffect, useLayoutEffect, useCallback } from 'react'
import { throttle } from '@vitus-labs/core'

export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

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

  const updateSizes = useCallback(() => {
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    }

    setWindowSize(sizes)
    if (onChange) onChange(sizes)
  }, [onChange])

  const handleResize = useCallback(throttle(updateSizes, throttleDelay), [
    onChange,
  ])

  useEffect(() => {
    updateSizes()
  }, [])

  useIsomorphicLayoutEffect(() => {
    window.addEventListener('resize', handleResize, false)

    return () => window.removeEventListener('resize', handleResize, false)
  }, [updateSizes])

  return windowSize
}

export default useWindowResize
