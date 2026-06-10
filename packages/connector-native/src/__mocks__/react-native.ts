import { useEffect, useState } from 'react'
import { vi } from 'vitest'

type WindowDimensions = {
  width: number
  height: number
  scale: number
  fontScale: number
}

let windowDimensions: WindowDimensions = {
  width: 375,
  height: 812,
  scale: 1,
  fontScale: 1,
}

const listeners = new Set<(dims: WindowDimensions) => void>()

export const Dimensions = {
  get: vi.fn((_dim?: 'window' | 'screen') => windowDimensions),
}

/**
 * Test-only helper — simulates a rotation/resize: updates the current window
 * dimensions and notifies `useWindowDimensions` subscribers, mirroring real
 * React Native's `change` event. Wrap calls in `act()`.
 */
export const __setWindowDimensions = (next: WindowDimensions): void => {
  windowDimensions = next
  for (const listener of listeners) listener(next)
}

/**
 * `useWindowDimensions` mock — returns the current window dimensions and
 * re-renders the caller when `__setWindowDimensions` fires a change
 * (mirrors real React Native's subscription). Wrapped in `vi.fn` so tests
 * can assert whether a component subscribes at all.
 */
export const useWindowDimensions = vi.fn((): WindowDimensions => {
  const [dims, setDims] = useState(windowDimensions)
  useEffect(() => {
    listeners.add(setDims)
    return () => {
      listeners.delete(setDims)
    }
  }, [])
  return dims
})
