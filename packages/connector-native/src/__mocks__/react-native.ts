import { vi } from 'vitest'

export const Dimensions = {
  get: vi.fn((_dim?: 'window' | 'screen') => ({
    width: 375,
    height: 812,
    scale: 1,
    fontScale: 1,
  })),
}

/**
 * Minimal `useWindowDimensions` mock — returns the current `Dimensions.get`
 * value. Real React Native subscribes and re-renders on change; the unit
 * tests drive re-renders explicitly, so a plain read is sufficient here.
 */
export const useWindowDimensions = () => Dimensions.get('window')
