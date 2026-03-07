import { vi } from 'vitest'

export const Dimensions = {
  get: vi.fn(() => ({ width: 375, height: 812, scale: 1, fontScale: 1 })),
}
