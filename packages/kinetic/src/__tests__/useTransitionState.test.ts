import { act, renderHook } from '@testing-library/react'
import useTransitionState from '../useTransitionState'

describe('useTransitionState', () => {
  it('initial state is hidden when show=false', () => {
    const { result } = renderHook(() => useTransitionState({ show: false }))
    expect(result.current.stage).toBe('hidden')
    expect(result.current.shouldMount).toBe(false)
  })

  it('initial state is entered when show=true and appear=false', () => {
    const { result } = renderHook(() => useTransitionState({ show: true }))
    expect(result.current.stage).toBe('entered')
    expect(result.current.shouldMount).toBe(true)
  })

  it('transitions to entering when show changes false->true', () => {
    const { result, rerender } = renderHook(
      ({ show }) => useTransitionState({ show }),
      { initialProps: { show: false } },
    )

    expect(result.current.stage).toBe('hidden')

    rerender({ show: true })
    expect(result.current.stage).toBe('entering')
    expect(result.current.shouldMount).toBe(true)
  })

  it('complete() transitions entering->entered', () => {
    const { result, rerender } = renderHook(
      ({ show }) => useTransitionState({ show }),
      { initialProps: { show: false } },
    )

    rerender({ show: true })
    expect(result.current.stage).toBe('entering')

    act(() => {
      result.current.complete()
    })
    expect(result.current.stage).toBe('entered')
  })

  it('transitions to leaving when show changes true->false', () => {
    const { result, rerender } = renderHook(
      ({ show }) => useTransitionState({ show }),
      { initialProps: { show: true } },
    )

    expect(result.current.stage).toBe('entered')

    rerender({ show: false })
    expect(result.current.stage).toBe('leaving')
    expect(result.current.shouldMount).toBe(true)
  })

  it('complete() transitions leaving->hidden', () => {
    const { result, rerender } = renderHook(
      ({ show }) => useTransitionState({ show }),
      { initialProps: { show: true } },
    )

    rerender({ show: false })
    expect(result.current.stage).toBe('leaving')

    act(() => {
      result.current.complete()
    })
    expect(result.current.stage).toBe('hidden')
    expect(result.current.shouldMount).toBe(false)
  })

  it('appear=true starts hidden then enters', () => {
    const { result } = renderHook(() =>
      useTransitionState({ show: true, appear: true }),
    )
    // After layout effect runs, stage should be entering
    expect(result.current.stage).toBe('entering')
    expect(result.current.shouldMount).toBe(true)
  })

  it('complete() is a no-op in entered state', () => {
    const { result } = renderHook(() => useTransitionState({ show: true }))

    expect(result.current.stage).toBe('entered')

    act(() => {
      result.current.complete()
    })
    expect(result.current.stage).toBe('entered')
  })

  it('complete() is a no-op in hidden state', () => {
    const { result } = renderHook(() => useTransitionState({ show: false }))

    expect(result.current.stage).toBe('hidden')

    act(() => {
      result.current.complete()
    })
    expect(result.current.stage).toBe('hidden')
  })

  it('handles rapid toggling true->false->true', () => {
    const { result, rerender } = renderHook(
      ({ show }) => useTransitionState({ show }),
      { initialProps: { show: true } },
    )

    // Start leave
    rerender({ show: false })
    expect(result.current.stage).toBe('leaving')

    // Interrupt with enter before leave completes
    rerender({ show: true })
    expect(result.current.stage).toBe('entering')
  })

  it('handles rapid toggling false->true->false (entering to leaving)', () => {
    const { result, rerender } = renderHook(
      ({ show }) => useTransitionState({ show }),
      { initialProps: { show: false } },
    )

    // Start enter
    rerender({ show: true })
    expect(result.current.stage).toBe('entering')

    // Interrupt with leave before enter completes
    rerender({ show: false })
    expect(result.current.stage).toBe('leaving')
  })

  it('provides a ref object', () => {
    const { result } = renderHook(() => useTransitionState({ show: false }))
    expect(result.current.ref).toBeDefined()
    expect(result.current.ref.current).toBeNull()
  })
})
