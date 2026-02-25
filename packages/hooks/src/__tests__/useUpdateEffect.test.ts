import { renderHook } from '@testing-library/react'
import useUpdateEffect from '../useUpdateEffect'

describe('useUpdateEffect', () => {
  it('does not fire on initial mount', () => {
    const effect = vi.fn()
    renderHook(() => useUpdateEffect(effect))
    expect(effect).not.toHaveBeenCalled()
  })

  it('fires on subsequent renders', () => {
    const effect = vi.fn()
    const { rerender } = renderHook(
      ({ val }) => useUpdateEffect(effect, [val]),
      {
        initialProps: { val: 1 },
      },
    )
    expect(effect).not.toHaveBeenCalled()

    rerender({ val: 2 })
    expect(effect).toHaveBeenCalledTimes(1)

    rerender({ val: 3 })
    expect(effect).toHaveBeenCalledTimes(2)
  })

  it('calls cleanup on subsequent changes', () => {
    const cleanup = vi.fn()
    const effect = vi.fn(() => cleanup)
    const { rerender } = renderHook(
      ({ val }) => useUpdateEffect(effect, [val]),
      {
        initialProps: { val: 1 },
      },
    )

    rerender({ val: 2 })
    expect(cleanup).not.toHaveBeenCalled()

    rerender({ val: 3 })
    expect(cleanup).toHaveBeenCalledTimes(1)
  })
})
