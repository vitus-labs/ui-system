import { renderHook } from '@testing-library/react'
import useScrollLock from '../useScrollLock'

describe('useScrollLock', () => {
  afterEach(() => {
    document.body.style.overflow = ''
  })

  it('sets overflow hidden when enabled', () => {
    renderHook(() => useScrollLock(true))
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('does not set overflow when disabled', () => {
    renderHook(() => useScrollLock(false))
    expect(document.body.style.overflow).toBe('')
  })

  it('restores original overflow on unmount', () => {
    document.body.style.overflow = 'auto'
    const { unmount } = renderHook(() => useScrollLock(true))
    expect(document.body.style.overflow).toBe('hidden')

    unmount()
    expect(document.body.style.overflow).toBe('auto')
  })

  it('restores overflow when toggled off', () => {
    const { rerender } = renderHook(({ on }) => useScrollLock(on), {
      initialProps: { on: true },
    })
    expect(document.body.style.overflow).toBe('hidden')

    rerender({ on: false })
    expect(document.body.style.overflow).toBe('')
  })
})
