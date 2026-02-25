import { useLayoutEffect } from 'react'
import useIsomorphicLayoutEffect from '../useIsomorphicLayoutEffect'

describe('useIsomorphicLayoutEffect', () => {
  it('is useLayoutEffect in a browser environment', () => {
    expect(useIsomorphicLayoutEffect).toBe(useLayoutEffect)
  })
})
