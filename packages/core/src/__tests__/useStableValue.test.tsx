import { act, render } from '@testing-library/react'
import { type ReactNode, useState } from 'react'
import useStableValue from '~/useStableValue'

// `useStableValue` runs `isEqual` on whatever the consumer passes. Consumer
// apps in the wild pass props that may contain cycles — React internals
// (fiber `_owner` chains), context-shaped back-references, or mutually-
// referential domain objects. The reported failure mode:
//
//     Uncaught RangeError: Maximum call stack size exceeded
//         at isObjectEqual ...
//         at isEqual ...
//
// These tests pin "doesn't crash on cyclic input" so the regression
// (commit history before fix(core): isEqual cycle detection) cannot
// silently come back.

const Probe = ({
  value,
  onStable,
}: {
  value: unknown
  onStable: (v: unknown) => void
}): ReactNode => {
  const stable = useStableValue(value)
  onStable(stable)
  return null
}

describe('useStableValue — React integration with cyclic data', () => {
  it('does not crash when receiving a self-referential prop', () => {
    const cyclic: Record<string, unknown> = { count: 0 }
    cyclic.self = cyclic

    let captured: unknown
    expect(() =>
      render(
        <Probe
          value={cyclic}
          onStable={(v) => {
            captured = v
          }}
        />,
      ),
    ).not.toThrow()

    expect(captured).toBe(cyclic)
  })

  it('does not crash on mutually-referential prop pairs', () => {
    const a: Record<string, unknown> = { tag: 'a' }
    const b: Record<string, unknown> = { tag: 'b' }
    a.other = b
    b.other = a

    expect(() =>
      render(<Probe value={a} onStable={() => undefined} />),
    ).not.toThrow()
  })

  it('returns the same reference across re-renders when cyclic input is content-equal', () => {
    const make = (): Record<string, unknown> => {
      const o: Record<string, unknown> = { x: 1 }
      o.self = o
      return o
    }

    let stableRef: unknown
    const captures: unknown[] = []

    const Harness = () => {
      const [, setTick] = useState(0)
      // Both first and second render pass a STRUCTURALLY-equal but
      // referentially-fresh cyclic object. The hook should hold the
      // first one and discard the second.
      const value = make()
      const stable = useStableValue(value)
      captures.push(stable)
      // Trigger a re-render synchronously on mount via a state setter.
      if (captures.length === 1) {
        queueMicrotask(() => setTick(1))
      }
      stableRef = stable
      return null
    }

    expect(() => render(<Harness />)).not.toThrow()
    expect(stableRef).toBeDefined()
  })

  it('does not crash on cyclic arrays passed as props', () => {
    const arr: unknown[] = [1, 2, 3]
    arr.push(arr)

    expect(() =>
      render(<Probe value={arr} onStable={() => undefined} />),
    ).not.toThrow()
  })

  it('does not crash when a child prop references the parent', () => {
    const parent: Record<string, unknown> = { name: 'parent' }
    const child: Record<string, unknown> = { name: 'child', parent }
    parent.child = child

    expect(() =>
      render(<Probe value={parent} onStable={() => undefined} />),
    ).not.toThrow()
  })

  // Exact-symptom regression: "page loads fine, crashes on state change".
  // First render: ref.current === value (Object.is short-circuits → no
  // isEqual descent). State change → second render with a referentially-
  // fresh cyclic prop → ref.current !== value → isEqual descends → without
  // cycle detection, infinite recursion → stack overflow.
  // Pre-fix: this test crashed. Post-fix: passes.
  it('survives a state-change re-render with cyclic props (the reported failure)', () => {
    const makeCyclic = (): Record<string, unknown> => {
      // Mimics a real $rocketstyle/$rocketstate-shaped prop: nested
      // object with a back-reference somewhere in the graph.
      const $rocketstate: Record<string, unknown> = { mode: 'default' }
      const props: Record<string, unknown> = {
        title: 'Header',
        $rocketstate,
      }
      // The actual cycle: rocketstyle/attrs sometimes ends up with props
      // that reference back to their own state container.
      $rocketstate.owner = props
      return props
    }

    let trigger: (() => void) | undefined
    let renderCount = 0

    const Header = () => {
      const [showMore, setShowMore] = useState(false)
      renderCount++
      const props = makeCyclic()
      // The actual broken path: hoc wraps props in useStableValue every render.
      useStableValue({ ...props, showMore })
      if (!trigger) trigger = () => setShowMore(true)
      return null
    }

    expect(() => render(<Header />)).not.toThrow()
    expect(renderCount).toBe(1)

    // Trigger the state change that historically crashed. Wrap in act() so
    // React flushes the update synchronously and our renderCount assertion
    // sees the post-update value.
    expect(() => act(() => trigger?.())).not.toThrow()
    expect(renderCount).toBeGreaterThan(1)
  })
})
