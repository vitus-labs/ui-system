import { render, screen } from '@testing-library/react'
import { type FC, forwardRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
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
})
