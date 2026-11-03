/**
 * Native useBreakpoint: the useState initializer only ran on mount, so a
 * theme swapping in new breakpoints never re-computed the active one.
 */
import { act, renderHook } from '@testing-library/react'
import { context } from '@vitus-labs/core'
import type { ReactNode } from 'react'
import { createElement } from 'react'
import { describe, expect, it, vi } from 'vitest'

type Payload = { window?: { width: number } }

const dims = vi.hoisted(() => ({
  width: 800,
  listeners: new Set<(p: Payload) => void>(),
}))

vi.mock('react-native', () => ({
  Dimensions: {
    get: () => ({ width: dims.width, height: 600 }),
    addEventListener: (_: string, cb: (p: Payload) => void) => {
      dims.listeners.add(cb)
      return { remove: () => dims.listeners.delete(cb) }
    },
  },
}))

import useBreakpoint from '../useBreakpoint.native'

const makeWrapper =
  (get: () => Record<string, number> | undefined) =>
  ({ children }: { children: ReactNode }) =>
    createElement(
      context.Provider as any,
      { value: { theme: { breakpoints: get() } } },
      children,
    )

describe('useBreakpoint (native)', () => {
  it('re-syncs when breakpoints change', () => {
    dims.width = 800
    let bps: Record<string, number> | undefined = { xs: 0, md: 768 }
    const { result, rerender } = renderHook(() => useBreakpoint(), {
      wrapper: makeWrapper(() => bps),
    })
    expect(result.current).toBe('md')

    bps = { xs: 0, md: 900 } // 800 < 900
    rerender()
    expect(result.current).toBe('xs')

    bps = undefined
    rerender()
    expect(result.current).toBeUndefined()
  })

  it('updates on Dimensions change and unsubscribes on unmount', () => {
    dims.width = 800
    const bps = { xs: 0, md: 768, lg: 992 }
    const { result, unmount } = renderHook(() => useBreakpoint(), {
      wrapper: makeWrapper(() => bps),
    })
    expect(result.current).toBe('md')
    expect(dims.listeners.size).toBe(1)

    act(() => {
      for (const cb of dims.listeners) cb({ window: { width: 1000 } })
    })
    expect(result.current).toBe('lg')

    unmount()
    expect(dims.listeners.size).toBe(0)
  })
})
