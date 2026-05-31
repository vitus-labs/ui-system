/**
 * Native Stagger must actually propagate its computed per-child delay
 * down to Transition. The prior implementation computed `_delay` then
 * dropped it, so every child started at t=0 — the documented stagger
 * behavior was silently a no-op on RN. This test pins that the delay
 * reaches the child Transition.
 */
import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { describe, expect, it, vi } from 'vitest'

// Mock Transition so we don't import react-native — capture the delay
// prop each Stagger child received.
const transitionInvocations: Array<{
  key: string | number | null | undefined
  delay: number | undefined
}> = []

vi.mock('../Transition', () => ({
  default: (props: any) => {
    const childKey = props.children?.props?.['data-test-key'] ?? null
    transitionInvocations.push({ key: childKey, delay: props.delay })
    return null
  },
}))

import Stagger from '../Stagger.native'

describe('Stagger.native — interval propagates to per-child delay', () => {
  const child = (k: string): ReactElement<any> => (
    <div key={k} data-test-key={k}>
      {k}
    </div>
  )

  it('computes delay = index × interval for each child on enter', () => {
    transitionInvocations.length = 0
    render(
      <Stagger show interval={75}>
        {[child('a'), child('b'), child('c')]}
      </Stagger>,
    )
    expect(transitionInvocations.length).toBe(3)
    // index 0/1/2 → 0/75/150
    expect(transitionInvocations[0]?.delay).toBe(0)
    expect(transitionInvocations[1]?.delay).toBe(75)
    expect(transitionInvocations[2]?.delay).toBe(150)
  })

  it('reverses stagger on leave when reverseLeave is true', () => {
    transitionInvocations.length = 0
    render(
      <Stagger show={false} reverseLeave interval={50}>
        {[child('a'), child('b'), child('c')]}
      </Stagger>,
    )
    // With reverseLeave + show=false, the LAST child gets delay 0, first gets the largest.
    expect(transitionInvocations[0]?.delay).toBe(100) // (3-1-0) * 50
    expect(transitionInvocations[1]?.delay).toBe(50)
    expect(transitionInvocations[2]?.delay).toBe(0)
  })

  it('uses the default interval (50ms) when not explicitly set', () => {
    transitionInvocations.length = 0
    render(
      <Stagger show>
        {[child('a'), child('b')]}
      </Stagger>,
    )
    expect(transitionInvocations[0]?.delay).toBe(0)
    expect(transitionInvocations[1]?.delay).toBe(50)
  })
})
