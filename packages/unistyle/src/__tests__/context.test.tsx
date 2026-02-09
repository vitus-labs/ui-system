import { render, screen } from '@testing-library/react'
import { useContext } from 'react'
import Provider, { context } from '../context'

const Consumer = () => {
  const ctx = useContext(context)
  return (
    <div
      data-testid="consumer"
      data-rootsize={ctx?.theme?.rootSize}
      data-has-vl={ctx?.theme?.__VITUS_LABS__ ? 'true' : 'false'}
    />
  )
}

describe('unistyle Provider', () => {
  it('renders children', () => {
    render(
      <Provider theme={{ rootSize: 16 }}>
        <div data-testid="child">Hello</div>
      </Provider>,
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('enriches theme with __VITUS_LABS__', () => {
    render(
      <Provider theme={{ rootSize: 16, breakpoints: { xs: 0, md: 768 } }}>
        <Consumer />
      </Provider>,
    )
    expect(screen.getByTestId('consumer')).toHaveAttribute(
      'data-has-vl',
      'true',
    )
  })

  it('provides rootSize through context', () => {
    render(
      <Provider theme={{ rootSize: 16, breakpoints: { xs: 0 } }}>
        <Consumer />
      </Provider>,
    )
    expect(screen.getByTestId('consumer')).toHaveAttribute(
      'data-rootsize',
      '16',
    )
  })

  it('handles theme without breakpoints', () => {
    render(
      <Provider theme={{ rootSize: 16 }}>
        <Consumer />
      </Provider>,
    )
    expect(screen.getByTestId('consumer')).toHaveAttribute(
      'data-has-vl',
      'true',
    )
  })

  it('handles empty breakpoints', () => {
    render(
      <Provider theme={{ rootSize: 16, breakpoints: {} }}>
        <Consumer />
      </Provider>,
    )
    // Empty breakpoints treated same as no breakpoints
    expect(screen.getByTestId('consumer')).toHaveAttribute(
      'data-has-vl',
      'true',
    )
  })

  it('passes extra props', () => {
    const ExtraConsumer = () => {
      const ctx = useContext(context)
      return <div data-testid="extra" data-custom={ctx.custom} />
    }

    render(
      <Provider theme={{ rootSize: 16 }} custom="test">
        <ExtraConsumer />
      </Provider>,
    )
    expect(screen.getByTestId('extra')).toHaveAttribute('data-custom', 'test')
  })
})

describe('context export', () => {
  it('exports context object', () => {
    expect(context).toBeDefined()
    expect(context.Provider).toBeDefined()
  })
})
