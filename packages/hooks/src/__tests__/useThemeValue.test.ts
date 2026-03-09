import { renderHook } from '@testing-library/react'
import { Provider } from '@vitus-labs/core'
import type { ReactNode } from 'react'
import { createElement } from 'react'
import useThemeValue from '../useThemeValue'

const createWrapper =
  (theme: Record<string, unknown>) =>
  ({ children }: { children: ReactNode }) =>
    createElement(Provider, { theme }, children)

describe('useThemeValue', () => {
  it('returns undefined when no provider is mounted', () => {
    const { result } = renderHook(() => useThemeValue('colors.primary'))
    expect(result.current).toBeUndefined()
  })

  it('returns a value when theme provides the path', () => {
    const wrapper = createWrapper({ colors: { primary: '#ff0000' } })
    const { result } = renderHook(() => useThemeValue('colors.primary'), {
      wrapper,
    })
    expect(result.current).toBe('#ff0000')
  })

  it('returns undefined for non-existent path in theme', () => {
    const wrapper = createWrapper({ colors: { primary: '#ff0000' } })
    const { result } = renderHook(() => useThemeValue('colors.nonExistent'), {
      wrapper,
    })
    expect(result.current).toBeUndefined()
  })

  it('returns nested values', () => {
    const wrapper = createWrapper({
      grid: { columns: 12, gutter: { default: 16 } },
    })
    const { result } = renderHook(() => useThemeValue<number>('grid.columns'), {
      wrapper,
    })
    expect(result.current).toBe(12)
  })
})
