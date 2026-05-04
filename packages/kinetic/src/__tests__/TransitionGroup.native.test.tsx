/**
 * Native TransitionGroup must keep stable per-key onAfterLeave callbacks
 * across renders. Without that, a fresh inline closure is produced for every
 * sibling on every render, and one child finishing its leave triggers a
 * cascade of unnecessary re-renders.
 *
 * The web version (TransitionGroup.tsx) already does this via callbackCache.
 * This test pins the native version to the same behavior so the two stay
 * in sync.
 */
import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { describe, expect, it, vi } from 'vitest'

// Mock Transition so we don't pull in React Native — capture the props the
// native TransitionGroup passes to each child instead. We read the test key
// off the child element's own props since React doesn't expose `key` to
// component props directly.
const transitionInvocations: Array<{
  key: string | number | null | undefined
  onAfterLeave: unknown
}> = []

vi.mock('../Transition', () => ({
  default: (props: any) => {
    const childKey = props.children?.props?.['data-test-key'] ?? null
    transitionInvocations.push({
      key: childKey,
      onAfterLeave: props.onAfterLeave,
    })
    return null
  },
}))

import TransitionGroup from '../TransitionGroup.native'

describe('TransitionGroup.native — onAfterLeave callback identity stability', () => {
  const child = (k: string): ReactElement<any> => (
    <div key={k} data-test-key={k}>
      {k}
    </div>
  )

  it('produces the SAME onAfterLeave reference for the same key across renders', () => {
    transitionInvocations.length = 0

    const { rerender } = render(
      <TransitionGroup>{[child('a'), child('b')]}</TransitionGroup>,
    )
    rerender(<TransitionGroup>{[child('a'), child('b')]}</TransitionGroup>)
    rerender(<TransitionGroup>{[child('a'), child('b')]}</TransitionGroup>)

    // 3 renders × 2 children = 6 invocations.
    expect(transitionInvocations.length).toBe(6)

    // For each key, every invocation must hand the same callback reference.
    const byKey = new Map<string | number, Set<unknown>>()
    for (const inv of transitionInvocations) {
      if (inv.key == null) continue
      let set = byKey.get(inv.key)
      if (!set) {
        set = new Set()
        byKey.set(inv.key, set)
      }
      set.add(inv.onAfterLeave)
    }

    expect(byKey.size).toBe(2)
    for (const [, set] of byKey) {
      expect(set.size).toBe(1)
    }
  })

  it('keeps a removed child rendered until its onAfterLeave fires', () => {
    transitionInvocations.length = 0
    const onAfterLeave = vi.fn()

    const { rerender } = render(
      <TransitionGroup onAfterLeave={onAfterLeave}>
        {[child('a'), child('b')]}
      </TransitionGroup>,
    )
    expect(transitionInvocations.length).toBe(2)

    // Remove "b" — it should still be rendered (in leavingRef) until its
    // onAfterLeave callback fires.
    rerender(
      <TransitionGroup onAfterLeave={onAfterLeave}>
        {[child('a')]}
      </TransitionGroup>,
    )

    // Find b's onAfterLeave from the most recent batch and invoke it.
    const last = transitionInvocations.slice(-2)
    const bEntry = last.find((i) => i.key === 'b')
    expect(bEntry).toBeDefined()
    expect(typeof bEntry?.onAfterLeave).toBe('function')

    // Invoke it — exercises leavingRef.delete + callbackCache.delete +
    // onAfterLeave forwarding + forceUpdate paths.
    ;(bEntry?.onAfterLeave as () => void)()
    expect(onAfterLeave).toHaveBeenCalledTimes(1)
  })
})
