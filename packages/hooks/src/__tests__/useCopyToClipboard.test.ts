import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import useCopyToClipboard from '../useCopyToClipboard'

describe('useCopyToClipboard', () => {
  const realClipboard = (navigator as any).clipboard
  afterEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      writable: true,
      value: realClipboard,
    })
  })

  const stubClipboard = (impl: { writeText: (t: string) => Promise<void> }) => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      writable: true,
      value: impl,
    })
  }

  it('copies via navigator.clipboard and flips `copied` until resetMs elapses', async () => {
    stubClipboard({ writeText: vi.fn().mockResolvedValue(undefined) })

    const { result } = renderHook(() => useCopyToClipboard(50))
    expect(result.current[0]).toBe(false)

    await act(async () => {
      const ok = await result.current[1]('hello')
      expect(ok).toBe(true)
    })
    expect(result.current[0]).toBe(true)
    await waitFor(() => expect(result.current[0]).toBe(false), {
      timeout: 500,
    })
  })

  it('returns false and keeps copied=false when navigator.clipboard rejects', async () => {
    stubClipboard({ writeText: vi.fn().mockRejectedValue(new Error('denied')) })
    const { result } = renderHook(() => useCopyToClipboard())
    await act(async () => {
      const ok = await result.current[1]('x')
      expect(ok).toBe(false)
    })
    expect(result.current[0]).toBe(false)
  })

  it('reset() forces copied back to false immediately and cancels the pending timer', async () => {
    stubClipboard({ writeText: vi.fn().mockResolvedValue(undefined) })
    const { result } = renderHook(() => useCopyToClipboard(5000))
    await act(async () => {
      await result.current[1]('hi')
    })
    expect(result.current[0]).toBe(true)
    act(() => {
      result.current[2]()
    })
    expect(result.current[0]).toBe(false)
  })
})
