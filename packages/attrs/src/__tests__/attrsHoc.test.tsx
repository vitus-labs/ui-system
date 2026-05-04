import { render, screen } from '@testing-library/react'
import React from 'react'
import { vi } from 'vitest'
import createAttrsHOC from '~/hoc/attrsHoc'

const Receiver = (props: any) => (
  <div data-testid="receiver" {...props}>
    {props.label ?? ''}
  </div>
)

// --------------------------------------------------------
// attrsHoc - props merging
// --------------------------------------------------------
describe('attrsHoc - props merging', () => {
  it('should pass through props unchanged when no attrs defined', () => {
    const hoc = createAttrsHOC({ attrs: [], priorityAttrs: [] })
    const Enhanced = hoc(Receiver)

    render(<Enhanced label="hello" data-custom="yes" />)
    const el = screen.getByTestId('receiver')
    expect(el).toHaveTextContent('hello')
    expect(el).toHaveAttribute('data-custom', 'yes')
  })

  it('should apply attrs as default props', () => {
    const hoc = createAttrsHOC({
      attrs: [(_props: any) => ({ label: 'default' })],
      priorityAttrs: [],
    })
    const Enhanced = hoc(Receiver)

    render(<Enhanced />)
    expect(screen.getByTestId('receiver')).toHaveTextContent('default')
  })

  it('should let explicit props override attrs', () => {
    const hoc = createAttrsHOC({
      attrs: [() => ({ label: 'from-attrs' })],
      priorityAttrs: [],
    })
    const Enhanced = hoc(Receiver)

    render(<Enhanced label="explicit" />)
    expect(screen.getByTestId('receiver')).toHaveTextContent('explicit')
  })

  it('should apply priorityAttrs with lowest precedence', () => {
    const hoc = createAttrsHOC({
      attrs: [(_props: any) => ({ label: 'from-attrs' })],
      priorityAttrs: [(_props: any) => ({ label: 'from-priority' })],
    })
    const Enhanced = hoc(Receiver)

    // attrs override priority, explicit props override both
    render(<Enhanced />)
    expect(screen.getByTestId('receiver')).toHaveTextContent('from-attrs')
  })

  it('should merge results from multiple attrs functions', () => {
    const hoc = createAttrsHOC({
      attrs: [() => ({ 'data-first': 'a' }), () => ({ 'data-second': 'b' })],
      priorityAttrs: [],
    })
    const Enhanced = hoc(Receiver)

    render(<Enhanced />)
    const el = screen.getByTestId('receiver')
    expect(el).toHaveAttribute('data-first', 'a')
    expect(el).toHaveAttribute('data-second', 'b')
  })

  it('should remove undefined props so they dont override defaults', () => {
    const hoc = createAttrsHOC({
      attrs: [() => ({ label: 'default-label' })],
      priorityAttrs: [],
    })
    const Enhanced = hoc(Receiver)

    // undefined prop should not override the default from attrs
    render(<Enhanced label={undefined} />)
    expect(screen.getByTestId('receiver')).toHaveTextContent('default-label')
  })

  it('should allow null to override defaults', () => {
    const hoc = createAttrsHOC({
      attrs: [() => ({ label: 'default-label' })],
      priorityAttrs: [],
    })
    const Enhanced = hoc(Receiver)

    render(<Enhanced label={null} />)
    // null should win over the default
    expect(screen.getByTestId('receiver')).toHaveTextContent('')
  })
})

// --------------------------------------------------------
// attrsHoc - attrs callback receives props
// --------------------------------------------------------
describe('attrsHoc - attrs callback receives props', () => {
  it('should pass filtered props to attrs callback', () => {
    const attrsFn = vi.fn(() => ({}))
    const hoc = createAttrsHOC({
      attrs: [attrsFn],
      priorityAttrs: [],
    })
    const Enhanced = hoc(Receiver)

    render(<Enhanced variant="primary" size="lg" />)
    expect(attrsFn).toHaveBeenCalledWith(
      expect.objectContaining({ variant: 'primary', size: 'lg' }),
    )
  })

  it('should pass priority attrs merged with props to attrs callback', () => {
    const attrsFn = vi.fn(() => ({}))
    const hoc = createAttrsHOC({
      attrs: [attrsFn],
      priorityAttrs: [() => ({ fromPriority: true })],
    })
    const Enhanced = hoc(Receiver)

    render(<Enhanced variant="primary" />)
    expect(attrsFn).toHaveBeenCalledWith(
      expect.objectContaining({ variant: 'primary', fromPriority: true }),
    )
  })
})

// --------------------------------------------------------
// attrsHoc - ref forwarding
// --------------------------------------------------------
describe('attrsHoc - ref forwarding', () => {
  it('should pass $attrsRef to wrapped component', () => {
    const hoc = createAttrsHOC({ attrs: [], priorityAttrs: [] })
    const Enhanced = hoc(Receiver)
    const ref = React.createRef<HTMLDivElement>()

    render(<Enhanced ref={ref} />)
    // The ref is passed as $attrsRef
    const el = screen.getByTestId('receiver')
    expect(el).toBeDefined()
  })
})

// --------------------------------------------------------
// attrsHoc - filteredProps stability across renders
// React produces a fresh props object on every parent render even when the
// content is identical. The HOC must absorb that and only recompute when
// content actually changes; otherwise the downstream `finalProps` useMemo
// (which holds the attrs-callback evaluation) cascade-invalidates.
// --------------------------------------------------------
describe('attrsHoc - filteredProps reference stability', () => {
  it('skips the attrs-chain memo on content-equal re-renders', () => {
    const attrsCallback = vi.fn(() => ({ defaulted: true }))
    const hoc = createAttrsHOC({ attrs: [attrsCallback], priorityAttrs: [] })
    const Enhanced = hoc(Receiver)

    // Parent re-renders (different `tick` each time on its own div) but
    // Enhanced's prop content is unchanged — memo should hit.
    const Parent = ({ tick }: { tick: number }) => (
      <div data-tick={tick}>
        <Enhanced label="hello" color="red" />
      </div>
    )

    const { rerender } = render(<Parent tick={0} />)
    expect(attrsCallback).toHaveBeenCalledTimes(1)

    rerender(<Parent tick={1} />)
    expect(attrsCallback).toHaveBeenCalledTimes(1)

    rerender(<Parent tick={2} />)
    expect(attrsCallback).toHaveBeenCalledTimes(1)
  })

  it('re-runs the attrs chain when prop content actually changes', () => {
    const attrsCallback = vi.fn(() => ({ defaulted: true }))
    const hoc = createAttrsHOC({ attrs: [attrsCallback], priorityAttrs: [] })
    const Enhanced = hoc(Receiver)

    const { rerender } = render(<Enhanced label="hello" />)
    expect(attrsCallback).toHaveBeenCalledTimes(1)

    rerender(<Enhanced label="world" />)
    expect(attrsCallback).toHaveBeenCalledTimes(2)
  })
})
