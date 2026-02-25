import { act, renderHook } from '@testing-library/react'
import useControllableState from '../useControllableState'

describe('useControllableState', () => {
  it('uses defaultValue when uncontrolled', () => {
    const { result } = renderHook(() =>
      useControllableState({ defaultValue: 'hello' }),
    )
    expect(result.current[0]).toBe('hello')
  })

  it('updates internal state when uncontrolled', () => {
    const { result } = renderHook(() =>
      useControllableState({ defaultValue: 0 }),
    )
    act(() => result.current[1](5))
    expect(result.current[0]).toBe(5)
  })

  it('uses value when controlled', () => {
    const { result } = renderHook(() =>
      useControllableState({ value: 'controlled', defaultValue: 'default' }),
    )
    expect(result.current[0]).toBe('controlled')
  })

  it('does not update internal state when controlled', () => {
    const onChange = vi.fn()
    const { result } = renderHook(() =>
      useControllableState({
        value: 'controlled',
        defaultValue: 'default',
        onChange,
      }),
    )
    act(() => result.current[1]('new'))
    expect(result.current[0]).toBe('controlled')
    expect(onChange).toHaveBeenCalledWith('new')
  })

  it('calls onChange in uncontrolled mode', () => {
    const onChange = vi.fn()
    const { result } = renderHook(() =>
      useControllableState({ defaultValue: 0, onChange }),
    )
    act(() => result.current[1](10))
    expect(onChange).toHaveBeenCalledWith(10)
  })

  it('supports updater function', () => {
    const { result } = renderHook(() =>
      useControllableState({ defaultValue: 1 }),
    )
    act(() => result.current[1]((prev: number) => prev + 1))
    expect(result.current[0]).toBe(2)
  })
})
