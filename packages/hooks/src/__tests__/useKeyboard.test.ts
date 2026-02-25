import { renderHook } from '@testing-library/react'
import useKeyboard from '../useKeyboard'

describe('useKeyboard', () => {
  it('calls handler when the matching key is pressed', () => {
    const handler = vi.fn()
    renderHook(() => useKeyboard('Escape', handler))

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('does not call handler for non-matching keys', () => {
    const handler = vi.fn()
    renderHook(() => useKeyboard('Escape', handler))

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
    expect(handler).not.toHaveBeenCalled()
  })

  it('cleans up on unmount', () => {
    const handler = vi.fn()
    const { unmount } = renderHook(() => useKeyboard('Escape', handler))

    unmount()
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(handler).not.toHaveBeenCalled()
  })

  it('always calls the latest handler', () => {
    let value = 0
    const { rerender } = renderHook(({ cb }) => useKeyboard('Enter', cb), {
      initialProps: { cb: () => (value = 1) as any },
    })

    rerender({ cb: () => (value = 2) as any })
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
    expect(value).toBe(2)
  })
})
