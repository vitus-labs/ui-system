import { renderHook } from '@testing-library/react'
import useThemeValue from '../useThemeValue'

describe('useThemeValue', () => {
  it('returns undefined when no provider is mounted', () => {
    const { result } = renderHook(() => useThemeValue('colors.primary'))
    expect(result.current).toBeUndefined()
  })
})
