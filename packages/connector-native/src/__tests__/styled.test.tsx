import { act, render, screen } from '@testing-library/react'
import { type FC, forwardRef } from 'react'
import { Dimensions } from 'react-native'
import { describe, expect, it, vi } from 'vitest'
// Test-only mock internals ('react-native' is aliased to this module in
// vitest.config, so these are the same instances styled.ts sees).
import {
  __setWindowDimensions,
  useWindowDimensions,
} from '~/__mocks__/react-native'
import createMediaQueries from '~/createMediaQueries'
import { css } from '~/css'
import { ThemeProvider } from '~/provider'
import { styled } from '~/styled'

// Mock base component that captures style prop
const MockView: FC<any> = forwardRef<any, any>(
  ({ style, children, ...rest }, ref) => (
    <div
      ref={ref}
      data-testid="view"
      data-style={JSON.stringify(style)}
      {...rest}
    >
      {children}
    </div>
  ),
)

describe('styled', () => {
  it('creates a styled component', () => {
    const StyledView = styled(MockView)`
      width: 100px;
      height: 50px;
    `

    render(<StyledView />)
    const el = screen.getByTestId('view')
    const style = JSON.parse(el.getAttribute('data-style')!)

    expect(style).toEqual({ width: 100, height: 50 })
  })

  it('merges with inline style prop', () => {
    const StyledView = styled(MockView)`
      width: 100px;
    `

    render(<StyledView style={{ height: 50 }} />)
    const el = screen.getByTestId('view')
    const style = JSON.parse(el.getAttribute('data-style')!)

    expect(style).toEqual({ width: 100, height: 50 })
  })

  it('inline style overrides template style', () => {
    const StyledView = styled(MockView)`
      width: 100px;
    `

    render(<StyledView style={{ width: 200 }} />)
    const el = screen.getByTestId('view')
    const style = JSON.parse(el.getAttribute('data-style')!)

    expect(style).toEqual({ width: 200 })
  })

  it('resolves dynamic interpolations with props', () => {
    const StyledView = styled(MockView)`
      width: ${(props: any) => props.$size}px;
    `

    render(<StyledView $size={150} />)
    const el = screen.getByTestId('view')
    const style = JSON.parse(el.getAttribute('data-style')!)

    expect(style).toEqual({ width: 150 })
  })

  // Regression: the context theme was not injected into resolve props, so
  // `p.theme.*` interpolations (and unistyle's makeItResponsive, which reads
  // `props.theme`) resolved to undefined on native.
  it('injects the context theme into dynamic interpolations', () => {
    const StyledView = styled(MockView)`
      color: ${(p: any) => p.theme?.brand ?? 'NONE'};
    `
    render(
      <ThemeProvider theme={{ brand: 'tomato' }}>
        <StyledView />
      </ThemeProvider>,
    )
    const el = screen.getByTestId('view')
    expect(JSON.parse(el.getAttribute('data-style')!)).toEqual({
      color: 'tomato',
    })
  })

  it('does not forward the injected theme to the underlying component', () => {
    const spy = vi.fn()
    const Spy: FC<any> = forwardRef<any, any>((props, ref) => {
      spy(props)
      return <div ref={ref} data-testid="spy" />
    })
    const StyledSpy = styled(Spy)`
      width: 100px;
    `
    render(
      <ThemeProvider theme={{ brand: 'x' }}>
        <StyledSpy />
      </ThemeProvider>,
    )
    expect(spy.mock.calls[0]?.[0]).not.toHaveProperty('theme')
  })

  it('a consumer-passed theme prop takes precedence over context', () => {
    const StyledView = styled(MockView)`
      color: ${(p: any) => p.theme?.brand};
    `
    render(
      <ThemeProvider theme={{ brand: 'fromContext' }}>
        <StyledView theme={{ brand: 'fromProp' }} />
      </ThemeProvider>,
    )
    const el = screen.getByTestId('view')
    expect(JSON.parse(el.getAttribute('data-style')!)).toEqual({
      color: 'fromProp',
    })
  })

  it('filters out $ prefixed props', () => {
    const StyledView = styled(MockView)`
      width: 100px;
    `

    render(<StyledView $custom="value" />)
    const el = screen.getByTestId('view')

    expect(el.getAttribute('$custom')).toBeNull()
  })

  it('filters out data- prefixed props', () => {
    const spy = vi.fn()
    const Spy: FC<any> = forwardRef<any, any>((props, ref) => {
      spy(props)
      return <div ref={ref} data-testid="spy" />
    })

    const StyledSpy = styled(Spy)`
      width: 100px;
    `

    render(<StyledSpy data-info="test" />)
    // The styled wrapper should NOT forward data-info to the inner component
    expect(spy.mock.calls[0]?.[0]).not.toHaveProperty('data-info')
  })

  it('filters out as prop', () => {
    const StyledView = styled(MockView)`
      width: 100px;
    `

    render(<StyledView as="span" />)
    const el = screen.getByTestId('view')
    expect(el.getAttribute('as')).toBeNull()
  })

  it('forwards children', () => {
    const StyledView = styled(MockView)`
      width: 100px;
    `

    render(<StyledView>Hello</StyledView>)
    expect(screen.getByText('Hello')).toBeTruthy()
  })

  it('supports custom shouldForwardProp', () => {
    const StyledView = styled(MockView, {
      shouldForwardProp: (prop) => prop !== 'role',
    })`
      width: 100px;
    `

    render(<StyledView role="button" />)
    const el = screen.getByTestId('view')
    expect(el.getAttribute('role')).toBeNull()
  })

  it('sets displayName', () => {
    const MyComponent: FC<any> = (props) => <div {...props} />
    MyComponent.displayName = 'MyComponent'

    const StyledComponent = styled(MyComponent)`
      width: 100px;
    `

    expect(StyledComponent.displayName).toBe('styled(MyComponent)')
  })

  it('forwards ref to the underlying component', () => {
    const StyledView = styled(MockView)`
      width: 100px;
    `
    let node: unknown = null
    render(
      <StyledView
        ref={(n: unknown) => {
          node = n
        }}
      />,
    )
    expect(node).toBe(screen.getByTestId('view'))
  })

  it('forwards ref on dynamic templates too', () => {
    const StyledView = styled(MockView)`
      width: ${(p: any) => p.w || '50px'};
    `
    let node: unknown = null
    render(
      <StyledView
        w="80px"
        ref={(n: unknown) => {
          node = n
        }}
      />,
    )
    expect(node).toBe(screen.getByTestId('view'))
  })

  it('uses function name when displayName is missing', () => {
    function NamedComponent(props: any) {
      return <div {...props} />
    }

    const StyledComponent = styled(NamedComponent as any)`
      width: 100px;
    `

    expect(StyledComponent.displayName).toBe('styled(NamedComponent)')
  })

  it('falls back to Component when no name is available', () => {
    const Anon = forwardRef<any, any>((props, ref) => (
      <div ref={ref} {...props} />
    ))
    // Remove displayName and name
    Object.defineProperty(Anon, 'displayName', { value: undefined })
    Object.defineProperty(Anon, 'name', { value: '' })

    const StyledComponent = styled(Anon as any)`
      width: 100px;
    `

    expect(StyledComponent.displayName).toBe('styled(Component)')
  })

  // Rotation reactivity: a component whose styles depend on a media query
  // re-resolves with the new width when the window dimensions change. In
  // production `useWindowDimensions()` (called inside styled) triggers the
  // re-render; here we simulate that re-render and assert the resolved style
  // tracks the width.
  it('re-resolves responsive media styles when window width changes', () => {
    const media = createMediaQueries({
      breakpoints: { xs: 0, md: 768 },
      rootSize: 16,
      css,
    })
    // mimic makeItResponsive's output: a prop carrying the per-breakpoint array
    const Box = styled(MockView)`
      ${(p: any) => p.$responsive}
    `
    const responsive = [media.xs`color: red;`, media.md`color: blue;`]

    // start narrow → only base (xs) applies
    vi.mocked(Dimensions.get).mockReturnValue({
      width: 375,
      height: 812,
      scale: 1,
      fontScale: 1,
    })
    const { rerender } = render(<Box $responsive={responsive} />)
    expect(
      JSON.parse(screen.getByTestId('view').getAttribute('data-style')!),
    ).toEqual({ color: 'red' })

    // rotate wider → md now applies and overrides
    vi.mocked(Dimensions.get).mockReturnValue({
      width: 1024,
      height: 768,
      scale: 1,
      fontScale: 1,
    })
    rerender(<Box $responsive={responsive} />)
    expect(
      JSON.parse(screen.getByTestId('view').getAttribute('data-style')!),
    ).toEqual({ color: 'blue' })
  })

  // Static templates (no function interpolations) must not subscribe to
  // window dimensions — their styles can't depend on the width by
  // construction, so re-rendering them on every rotation/resize only
  // produced identical output. The static/dynamic branch happens at
  // component-creation time.
  describe('window dimensions subscription', () => {
    it('static templates do not call useWindowDimensions', () => {
      useWindowDimensions.mockClear()
      const Static = styled(MockView)`
        width: 100px;
      `

      render(<Static />)

      expect(
        JSON.parse(screen.getByTestId('view').getAttribute('data-style')!),
      ).toEqual({ width: 100 })
      expect(useWindowDimensions).not.toHaveBeenCalled()
    })

    it('static templates do not re-render on a dimensions change', () => {
      const renderSpy = vi.fn()
      const Probe: FC<any> = forwardRef<any, any>(({ style }, ref) => {
        renderSpy()
        return (
          <div
            ref={ref}
            data-testid="probe"
            data-style={JSON.stringify(style)}
          />
        )
      })
      const Static = styled(Probe)`
        width: 100px;
      `

      render(<Static />)
      const rendersBefore = renderSpy.mock.calls.length

      act(() => {
        __setWindowDimensions({
          width: 1024,
          height: 768,
          scale: 1,
          fontScale: 1,
        })
      })

      // No re-render — and the output is still correct
      expect(renderSpy.mock.calls.length).toBe(rendersBefore)
      expect(
        JSON.parse(screen.getByTestId('probe').getAttribute('data-style')!),
      ).toEqual({ width: 100 })
    })

    it('dynamic templates re-render on a dimensions change', () => {
      const renderSpy = vi.fn()
      const Probe: FC<any> = forwardRef<any, any>((_props, ref) => {
        renderSpy()
        return <div ref={ref} data-testid="probe" />
      })
      const Dynamic = styled(Probe)`
        width: ${(p: any) => p.$w}px;
      `

      render(<Dynamic $w={10} />)
      const rendersBefore = renderSpy.mock.calls.length

      act(() => {
        __setWindowDimensions({
          width: 800,
          height: 600,
          scale: 1,
          fontScale: 1,
        })
      })

      expect(renderSpy.mock.calls.length).toBeGreaterThan(rendersBefore)
    })
  })
})
