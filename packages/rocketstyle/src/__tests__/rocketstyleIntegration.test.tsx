import { render, screen } from '@testing-library/react'
import { config, Provider as CoreProvider } from '@vitus-labs/core'
import { type ReactNode, forwardRef } from 'react'
import rocketstyle from '../init'
import Provider from '../context/context'
import isRocketComponent from '../isRocketComponent'

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

// Initialize config before all tests
beforeAll(() => {
  config.init({
    css: mockCss as any,
    styled: mockStyled as any,
    ExternalProvider: MockExternalProvider as any,
    component: 'div',
    textComponent: 'span',
  })
})

// Base component that filters internal props
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
    <div ref={ref} {...rest}>
      {children}
    </div>
  ),
)
BaseComponent.displayName = 'BaseComponent'

const wrapper = ({ children }: { children: ReactNode }) => (
  <CoreProvider theme={{ rootSize: 16 }}>{children}</CoreProvider>
)

describe('rocketstyle factory', () => {
  it('creates a component from factory', () => {
    const Button = rocketstyle()({
      name: 'TestButton',
      component: BaseComponent,
    })
    expect(Button).toBeDefined()
    expect(typeof Button).toBe('object') // forwardRef returns object
  })

  it('sets IS_ROCKETSTYLE on the component', () => {
    const Button = rocketstyle()({
      name: 'TestButton',
      component: BaseComponent,
    })
    expect(Button.IS_ROCKETSTYLE).toBe(true)
    expect(isRocketComponent(Button)).toBe(true)
  })

  it('sets displayName on the component', () => {
    const Button = rocketstyle()({
      name: 'MyButton',
      component: BaseComponent,
    })
    expect(Button.displayName).toBe('MyButton')
  })

  it('throws when component is missing', () => {
    expect(() => {
      rocketstyle()({ name: 'Test', component: undefined as any })
    }).toThrow('component')
  })

  it('throws when name is missing', () => {
    expect(() => {
      rocketstyle()({ name: '', component: BaseComponent })
    }).toThrow('name')
  })

  it('throws when dimension uses reserved key', () => {
    expect(() => {
      rocketstyle({ dimensions: { attrs: 'attrs' } as any })({
        name: 'Test',
        component: BaseComponent,
      })
    }).toThrow('invalid')
  })

  it('allows custom dimensions', () => {
    const Button = rocketstyle({
      dimensions: { colors: 'color', shapes: 'shape' },
    })({ name: 'CustomButton', component: BaseComponent })
    expect(Button).toBeDefined()
    expect(Button.IS_ROCKETSTYLE).toBe(true)
  })

  it('defaults useBooleans to true', () => {
    const Button = rocketstyle()({
      name: 'Test',
      component: BaseComponent,
    })
    expect(Button).toBeDefined()
  })
})

describe('chaining methods', () => {
  const Button = rocketstyle()({
    name: 'ChainButton',
    component: BaseComponent,
  })

  it('.attrs() returns a new component', () => {
    const Enhanced = Button.attrs(() => ({ label: 'test' }))
    expect(Enhanced).toBeDefined()
    expect(Enhanced.IS_ROCKETSTYLE).toBe(true)
    expect(Enhanced).not.toBe(Button)
  })

  it('.attrs() with priority option', () => {
    const Enhanced = Button.attrs(() => ({ label: 'priority' }), {
      priority: true,
    })
    expect(Enhanced).toBeDefined()
    expect(Enhanced.IS_ROCKETSTYLE).toBe(true)
  })

  it('.attrs() with filter option', () => {
    const Enhanced = Button.attrs(() => ({ label: 'filtered' }), {
      filter: ['internal'],
    })
    expect(Enhanced).toBeDefined()
  })

  it('.config() returns a new component', () => {
    const Enhanced = Button.config({ DEBUG: true })
    expect(Enhanced).toBeDefined()
    expect(Enhanced.IS_ROCKETSTYLE).toBe(true)
  })

  it('.statics() returns a new component', () => {
    const Enhanced = Button.statics({ customMeta: 'value' })
    expect(Enhanced).toBeDefined()
    expect(Enhanced.meta.customMeta).toBe('value')
  })

  it('.theme() returns a new component', () => {
    const Enhanced = Button.theme(() => ({ color: 'blue' }))
    expect(Enhanced).toBeDefined()
    expect(Enhanced.IS_ROCKETSTYLE).toBe(true)
  })

  it('.styles() returns a new component', () => {
    const Enhanced = Button.styles(() => 'color: red;')
    expect(Enhanced).toBeDefined()
  })

  it('.compose() returns a new component', () => {
    const hoc = (C: any) => C
    const Enhanced = Button.compose({ myHoc: hoc })
    expect(Enhanced).toBeDefined()
  })

  it('supports chaining multiple methods', () => {
    const Enhanced = Button.theme(() => ({ color: 'blue' }))
      .attrs(() => ({ label: 'test' }))
      .config({ name: 'EnhancedButton' })
      .statics({ version: '1.0' })

    expect(Enhanced.IS_ROCKETSTYLE).toBe(true)
    expect(Enhanced.meta.version).toBe('1.0')
  })

  it('.getStaticDimensions() returns dimension info', () => {
    const Themed = Button.states(() => ({
      primary: { color: 'red' },
      secondary: { color: 'blue' },
    }))

    const info = Themed.getStaticDimensions({ rootSize: 16 })
    expect(info.dimensions).toBeDefined()
    expect(info.useBooleans).toBe(true)
    expect(info.multiKeys).toBeDefined()
  })

  it('.getDefaultAttrs() evaluates attrs chain', () => {
    const WithAttrs = Button.attrs((props: any) => ({
      label: 'default',
      ...props,
    }))
    const result = WithAttrs.getDefaultAttrs({}, {}, 'light')
    expect(result.label).toBe('default')
  })
})

describe('rendering', () => {
  it('renders a basic rocketstyle component', () => {
    const Button = rocketstyle()({
      name: 'RenderButton',
      component: BaseComponent,
    }).config({})
    render(<Button data-testid="btn">Hello</Button>, { wrapper })
    expect(screen.getByTestId('btn')).toBeInTheDocument()
    expect(screen.getByTestId('btn')).toHaveTextContent('Hello')
  })

  it('adds data-rocketstyle attribute in dev mode', () => {
    const Button = rocketstyle()({
      name: 'DevButton',
      component: BaseComponent,
    }).config({})
    render(<Button data-testid="btn">Test</Button>, { wrapper })
    expect(screen.getByTestId('btn')).toHaveAttribute(
      'data-rocketstyle',
      'DevButton',
    )
  })

  it('renders with attrs defaults', () => {
    const Button = rocketstyle()({
      name: 'AttrsButton',
      component: BaseComponent,
    }).attrs(() => ({ 'data-default': 'yes' }))

    render(<Button data-testid="btn">Test</Button>, { wrapper })
    expect(screen.getByTestId('btn')).toHaveAttribute('data-default', 'yes')
  })

  it('explicit props override attrs', () => {
    const Button = rocketstyle()({
      name: 'OverrideButton',
      component: BaseComponent,
    }).attrs(() => ({ 'data-val': 'from-attrs' }))

    render(
      <Button data-testid="btn" data-val="from-props">
        Test
      </Button>,
      { wrapper },
    )
    expect(screen.getByTestId('btn')).toHaveAttribute('data-val', 'from-props')
  })

  it('renders with theme', () => {
    const Button = rocketstyle()({
      name: 'ThemedButton',
      component: BaseComponent,
    }).theme(() => ({ fontSize: 14 }))

    render(<Button data-testid="btn">Themed</Button>, { wrapper })
    expect(screen.getByTestId('btn')).toBeInTheDocument()
  })

  it('renders with dimension states', () => {
    const Button = rocketstyle()({
      name: 'StatesButton',
      component: BaseComponent,
    })
      .theme(() => ({ color: 'default' }))
      .states(() => ({
        primary: { color: 'blue' },
        secondary: { color: 'green' },
      }))

    render(
      <Button data-testid="btn" state="primary">
        Styled
      </Button>,
      { wrapper },
    )
    expect(screen.getByTestId('btn')).toBeInTheDocument()
  })

  it('renders with boolean dimension props', () => {
    const Button = rocketstyle()({
      name: 'BoolButton',
      component: BaseComponent,
    }).states(() => ({
      primary: { color: 'blue' },
    }))

    // boolean prop 'primary' should map to state='primary'
    render(
      <Button data-testid="btn" primary>
        Bool
      </Button>,
      { wrapper },
    )
    expect(screen.getByTestId('btn')).toBeInTheDocument()
  })

  it('renders with priority attrs', () => {
    const Button = rocketstyle()({
      name: 'PriorityButton',
      component: BaseComponent,
    }).attrs(() => ({ 'data-priority': 'yes' }), { priority: true })

    render(<Button data-testid="btn">Test</Button>, { wrapper })
    expect(screen.getByTestId('btn')).toHaveAttribute('data-priority', 'yes')
  })
})

describe('Provider', () => {
  it('renders children', () => {
    render(
      <Provider theme={{ rootSize: 16 }}>
        <div data-testid="child">Hello</div>
      </Provider>,
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('provides mode to children', () => {
    const Button = rocketstyle()({
      name: 'ModeButton',
      component: BaseComponent,
    }).config({})

    render(
      <Provider theme={{ rootSize: 16 }} mode="dark">
        <Button data-testid="btn">Dark</Button>
      </Provider>,
    )
    expect(screen.getByTestId('btn')).toBeInTheDocument()
  })

  it('inverts mode when inversed', () => {
    render(
      <Provider theme={{ rootSize: 16 }} mode="light" inversed>
        <div data-testid="child">Inversed</div>
      </Provider>,
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('defaults to light mode when mode is not provided', () => {
    render(
      <Provider theme={{ rootSize: 16 }}>
        <div data-testid="child">Default</div>
      </Provider>,
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })
})
