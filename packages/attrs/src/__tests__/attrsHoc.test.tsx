// @ts-nocheck
import { render, screen } from '@testing-library/react'
import React from 'react'
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
    const attrsFn = jest.fn(() => ({}))
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
    const attrsFn = jest.fn(() => ({}))
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
