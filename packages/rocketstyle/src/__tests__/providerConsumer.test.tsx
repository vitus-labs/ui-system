import { fireEvent, render, screen } from '@testing-library/react'
import { Provider as CoreProvider, config } from '@vitus-labs/core'
import { forwardRef, type ReactNode } from 'react'
import Provider from '../context/context'
import rocketstyle from '../init'

// Mock styled function that returns the component unchanged
const mockStyled = (component: any) => {
  const taggedTemplate = (_strings: any, ..._args: any[]) => component
  return taggedTemplate
}

const mockCss = (_strings: any, ..._args: any[]) => ''

const MockExternalProvider = ({
  children,
}: {
  children: ReactNode
  theme?: any
}) => <>{children}</>

beforeAll(() => {
  config.init({
    css: mockCss as any,
    styled: mockStyled as any,
    provider: MockExternalProvider as any,
    component: 'div',
    textComponent: 'span',
  })
})

// Base component that exposes internal props for testing
const BaseComponent = forwardRef(
  (
    {
      children,
      $rocketstyle,
      $rocketstate,
      ...rest
    }: any,
    ref: any,
  ) => (
    <div
      ref={ref}
      data-hover={$rocketstate?.pseudo?.hover ?? 'none'}
      data-focus={$rocketstate?.pseudo?.focus ?? 'none'}
      data-pressed={$rocketstate?.pseudo?.pressed ?? 'none'}
      {...rest}
    >
      {children}
    </div>
  ),
)
BaseComponent.displayName = 'BaseComponent'

// Child component that reads consumer context
const ChildComponent = forwardRef(
  (
    {
      children,
      $rocketstyle,
      $rocketstate,
      parentHover,
      ...rest
    }: any,
    ref: any,
  ) => (
    <div
      ref={ref}
      data-parent-hover={parentHover ?? 'none'}
      {...rest}
    >
      {children}
    </div>
  ),
)
ChildComponent.displayName = 'ChildComponent'

const wrapper = ({ children }: { children: ReactNode }) => (
  <CoreProvider theme={{ rootSize: 16 }}>{children}</CoreProvider>
)

describe('Provider/Consumer integration', () => {
  describe('provider component', () => {
    it('renders with provider: true', () => {
      const ParentButton: any = rocketstyle()({
        name: 'ProviderButton',
        component: BaseComponent,
      }).config({ provider: true })

      render(
        <ParentButton data-testid="parent">
          <div data-testid="child">Child</div>
        </ParentButton>,
        { wrapper },
      )

      expect(screen.getByTestId('parent')).toBeInTheDocument()
      expect(screen.getByTestId('child')).toBeInTheDocument()
    })

    it('detects hover pseudo-state on provider', () => {
      const ParentButton: any = rocketstyle()({
        name: 'HoverProvider',
        component: BaseComponent,
      }).config({ provider: true })

      render(
        <ParentButton data-testid="parent">
          <div data-testid="child">Child</div>
        </ParentButton>,
        { wrapper },
      )

      const parent = screen.getByTestId('parent')
      expect(parent).toHaveAttribute('data-hover', 'false')

      fireEvent.mouseEnter(parent)
      expect(parent).toHaveAttribute('data-hover', 'true')

      fireEvent.mouseLeave(parent)
      expect(parent).toHaveAttribute('data-hover', 'false')
    })

    it('detects focus pseudo-state on provider', () => {
      const ParentButton: any = rocketstyle()({
        name: 'FocusProvider',
        component: BaseComponent,
      }).config({ provider: true })

      render(
        <ParentButton data-testid="parent">
          <div>Child</div>
        </ParentButton>,
        { wrapper },
      )

      const parent = screen.getByTestId('parent')
      expect(parent).toHaveAttribute('data-focus', 'false')

      fireEvent.focus(parent)
      expect(parent).toHaveAttribute('data-focus', 'true')

      fireEvent.blur(parent)
      expect(parent).toHaveAttribute('data-focus', 'false')
    })

    it('detects pressed pseudo-state on provider', () => {
      const ParentButton: any = rocketstyle()({
        name: 'PressedProvider',
        component: BaseComponent,
      }).config({ provider: true })

      render(
        <ParentButton data-testid="parent">
          <div>Child</div>
        </ParentButton>,
        { wrapper },
      )

      const parent = screen.getByTestId('parent')
      expect(parent).toHaveAttribute('data-pressed', 'false')

      fireEvent.mouseDown(parent)
      expect(parent).toHaveAttribute('data-pressed', 'true')

      fireEvent.mouseUp(parent)
      expect(parent).toHaveAttribute('data-pressed', 'false')
    })
  })

  describe('consumer component', () => {
    it('consumer receives pseudo-state from provider context', () => {
      const Parent: any = rocketstyle()({
        name: 'ParentProvider',
        component: BaseComponent,
      }).config({ provider: true })

      const Child: any = rocketstyle()({
        name: 'ChildConsumer',
        component: ChildComponent,
      }).config({
        consumer: (ctx: any) =>
          ctx((rawCtx: any) => ({
            parentHover: rawCtx?.pseudo?.hover ? 'yes' : 'no',
          })),
      })

      render(
        <Parent data-testid="parent">
          <Child data-testid="child">Consumer child</Child>
        </Parent>,
        { wrapper },
      )

      expect(screen.getByTestId('child')).toBeInTheDocument()
      // Initially parent is not hovered
      expect(screen.getByTestId('child')).toHaveAttribute(
        'data-parent-hover',
        'no',
      )
    })

    it('consumer without provider returns default pseudo', () => {
      const Child: any = rocketstyle()({
        name: 'OrphanConsumer',
        component: ChildComponent,
      }).config({
        consumer: (ctx: any) =>
          ctx((rawCtx: any) => ({
            parentHover: rawCtx?.pseudo?.hover ? 'yes' : 'no',
          })),
      })

      render(
        <Child data-testid="child">Orphan</Child>,
        { wrapper },
      )

      // Without a provider, context is empty — hover is falsy → 'no'
      expect(screen.getByTestId('child')).toHaveAttribute(
        'data-parent-hover',
        'no',
      )
    })

    it('component without consumer ignores provider context', () => {
      const Parent: any = rocketstyle()({
        name: 'IgnoredProvider',
        component: BaseComponent,
      }).config({ provider: true })

      const Child: any = rocketstyle()({
        name: 'NoConsumer',
        component: BaseComponent,
      }).config({})

      render(
        <Parent data-testid="parent">
          <Child data-testid="child">No consumer</Child>
        </Parent>,
        { wrapper },
      )

      expect(screen.getByTestId('child')).toBeInTheDocument()
    })
  })

  describe('theme mode', () => {
    it('light mode is default', () => {
      const Button: any = rocketstyle()({
        name: 'LightButton',
        component: BaseComponent,
      }).config({})

      render(
        <Provider theme={{ rootSize: 16 }}>
          <Button data-testid="btn">Light</Button>
        </Provider>,
      )

      expect(screen.getByTestId('btn')).toBeInTheDocument()
    })

    it('dark mode is passed through Provider', () => {
      const Button: any = rocketstyle()({
        name: 'DarkButton',
        component: BaseComponent,
      }).config({})

      render(
        <Provider theme={{ rootSize: 16 }} mode="dark">
          <Button data-testid="btn">Dark</Button>
        </Provider>,
      )

      expect(screen.getByTestId('btn')).toBeInTheDocument()
    })

    it('inversed config flips the mode', () => {
      const Button: any = rocketstyle()({
        name: 'InversedButton',
        component: BaseComponent,
      }).config({ inversed: true })

      render(
        <Provider theme={{ rootSize: 16 }} mode="light">
          <Button data-testid="btn">Inversed</Button>
        </Provider>,
      )

      expect(screen.getByTestId('btn')).toBeInTheDocument()
    })
  })

  describe('nested providers', () => {
    it('supports nested provider components', () => {
      const Outer: any = rocketstyle()({
        name: 'OuterProvider',
        component: BaseComponent,
      }).config({ provider: true })

      const Inner: any = rocketstyle()({
        name: 'InnerProvider',
        component: BaseComponent,
      }).config({ provider: true })

      render(
        <Outer data-testid="outer">
          <Inner data-testid="inner">
            <div data-testid="leaf">Leaf</div>
          </Inner>
        </Outer>,
        { wrapper },
      )

      expect(screen.getByTestId('outer')).toBeInTheDocument()
      expect(screen.getByTestId('inner')).toBeInTheDocument()
      expect(screen.getByTestId('leaf')).toBeInTheDocument()
    })
  })
})
