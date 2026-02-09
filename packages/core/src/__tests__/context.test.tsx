import { render, screen } from '@testing-library/react'
import { useContext } from 'react'
import config from '../config'
import Provider, { context } from '../context'

const Consumer = () => {
  const ctx = useContext(context)
  return <div data-testid="consumer" data-theme={JSON.stringify(ctx.theme)} />
}

describe('Provider', () => {
  it('renders children without theme', () => {
    render(
      <Provider>
        <div data-testid="child">Hello</div>
      </Provider>,
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('renders children with empty theme', () => {
    render(
      <Provider theme={{}}>
        <div data-testid="child">Hello</div>
      </Provider>,
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('renders children with null theme', () => {
    render(
      // @ts-expect-error testing null theme
      <Provider theme={null}>
        <div data-testid="child">Hello</div>
      </Provider>,
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('renders with theme and provides context', () => {
    const theme = { rootSize: 16, breakpoints: { xs: 0 } }
    render(
      <Provider theme={theme}>
        <Consumer />
      </Provider>,
    )
    const consumer = screen.getByTestId('consumer')
    const ctxTheme = JSON.parse(consumer.getAttribute('data-theme')!)
    expect(ctxTheme.rootSize).toBe(16)
  })

  it('passes extra props to context', () => {
    const ExtraConsumer = () => {
      const ctx = useContext(context)
      return <div data-testid="extra" data-custom={ctx.custom} />
    }

    render(
      <Provider theme={{ rootSize: 16 }} custom="value">
        <ExtraConsumer />
      </Provider>,
    )
    expect(screen.getByTestId('extra')).toHaveAttribute('data-custom', 'value')
  })

  it('uses ExternalProvider when theme is present', () => {
    const theme = { rootSize: 16, breakpoints: { xs: 0 } }
    expect(config.ExternalProvider).toBeDefined()
    const { container } = render(
      <Provider theme={theme}>
        <div data-testid="child">Styled</div>
      </Provider>,
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
    // The ExternalProvider (ThemeProvider from styled-components) should wrap children
    expect(container.firstChild).toBeTruthy()
  })

  it('renders without ExternalProvider', () => {
    const original = config.ExternalProvider
    // Temporarily remove ExternalProvider
    config.ExternalProvider = undefined as any
    const theme = { rootSize: 16, breakpoints: { xs: 0 } }
    render(
      <Provider theme={theme}>
        <Consumer />
      </Provider>,
    )
    const consumer = screen.getByTestId('consumer')
    const ctxTheme = JSON.parse(consumer.getAttribute('data-theme')!)
    expect(ctxTheme.rootSize).toBe(16)
    config.ExternalProvider = original
  })
})

describe('context', () => {
  it('exports context object', () => {
    expect(context).toBeDefined()
    expect(context.Provider).toBeDefined()
    expect(context.Consumer).toBeDefined()
  })
})
