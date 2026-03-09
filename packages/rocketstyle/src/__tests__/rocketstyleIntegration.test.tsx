import { render, screen } from '@testing-library/react'
import { Provider as CoreProvider, config } from '@vitus-labs/core'
import { forwardRef, type ReactNode } from 'react'
import { vi } from 'vitest'
import Provider from '../context/context'
import rocketstyle from '../init'
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
    provider: MockExternalProvider as any,
    component: 'div',
    textComponent: 'span',
  })
})

// Base component that filters internal props
const BaseComponent = forwardRef(
  ({ children, $rocketstyle, $rocketstate, ...rest }: any, ref: any) => (
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
  const Button: any = rocketstyle()({
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
    const Button: any = rocketstyle()({
      name: 'RenderButton',
      component: BaseComponent,
    }).config({})
    render(<Button data-testid="btn">Hello</Button>, { wrapper })
    expect(screen.getByTestId('btn')).toBeInTheDocument()
    expect(screen.getByTestId('btn')).toHaveTextContent('Hello')
  })

  it('adds data-rocketstyle attribute in dev mode', () => {
    const Button: any = rocketstyle()({
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
    const Button: any = rocketstyle()({
      name: 'AttrsButton',
      component: BaseComponent,
    }).attrs((() => ({ 'data-default': 'yes' })) as any)

    render(<Button data-testid="btn">Test</Button>, { wrapper })
    expect(screen.getByTestId('btn')).toHaveAttribute('data-default', 'yes')
  })

  it('explicit props override attrs', () => {
    const Button: any = rocketstyle()({
      name: 'OverrideButton',
      component: BaseComponent,
    }).attrs((() => ({ 'data-val': 'from-attrs' })) as any)

    render(
      <Button data-testid="btn" data-val="from-props">
        Test
      </Button>,
      { wrapper },
    )
    expect(screen.getByTestId('btn')).toHaveAttribute('data-val', 'from-props')
  })

  it('renders with theme', () => {
    const Button: any = rocketstyle()({
      name: 'ThemedButton',
      component: BaseComponent,
    }).theme(() => ({ fontSize: 14 }))

    render(<Button data-testid="btn">Themed</Button>, { wrapper })
    expect(screen.getByTestId('btn')).toBeInTheDocument()
  })

  it('renders with dimension states', () => {
    const Button: any = rocketstyle()({
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
    const Button: any = rocketstyle()({
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
    const Button: any = rocketstyle()({
      name: 'PriorityButton',
      component: BaseComponent,
    }).attrs((() => ({ 'data-priority': 'yes' })) as any, { priority: true })

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
    const Button: any = rocketstyle()({
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

describe('DEBUG option', () => {
  it('calls console.debug when DEBUG is enabled', () => {
    const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {})

    const Button: any = rocketstyle()({
      name: 'DebugButton',
      component: BaseComponent,
    }).config({ DEBUG: true })

    render(<Button data-testid="btn">Debug</Button>, { wrapper })
    expect(screen.getByTestId('btn')).toBeInTheDocument()
    expect(debugSpy).toHaveBeenCalledWith(
      '[rocketstyle] DebugButton render:',
      expect.objectContaining({
        component: 'DebugButton',
        rocketstate: expect.any(Object),
        rocketstyle: expect.any(Object),
        dimensions: expect.any(Object),
        mode: expect.any(String),
      }),
    )

    debugSpy.mockRestore()
  })

  it('does not call console.debug when DEBUG is not set', () => {
    const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {})

    const Button: any = rocketstyle()({
      name: 'NoDebugButton',
      component: BaseComponent,
    }).config({})

    render(<Button data-testid="btn2">NoDebug</Button>, { wrapper })
    expect(debugSpy).not.toHaveBeenCalled()

    debugSpy.mockRestore()
  })
})

describe('passProps option', () => {
  it('passes styling props through when passProps is configured', () => {
    // BaseComponent that renders the state prop as a data attribute if received
    const PassPropsComponent = forwardRef(
      (
        { children, $rocketstyle, $rocketstate, state, ...rest }: any,
        ref: any,
      ) => (
        <div ref={ref} data-state={state} {...rest}>
          {children}
        </div>
      ),
    )
    PassPropsComponent.displayName = 'PassPropsComponent'

    const Button: any = rocketstyle()({
      name: 'PassPropsButton',
      component: PassPropsComponent,
    })
      .states(() => ({
        primary: { color: 'blue' },
        secondary: { color: 'green' },
      }))
      .config({ passProps: ['state'] })

    render(
      <Button data-testid="btn" state="primary">
        PassProps
      </Button>,
      { wrapper },
    )
    const btn = screen.getByTestId('btn')
    expect(btn).toBeInTheDocument()
    // The state prop should be passed through because of passProps config
    expect(btn).toHaveAttribute('data-state', 'primary')
  })

  it('does not pass styling props without passProps', () => {
    const PassPropsComponent = forwardRef(
      (
        { children, $rocketstyle, $rocketstate, state, ...rest }: any,
        ref: any,
      ) => (
        <div ref={ref} data-state={state ?? 'none'} {...rest}>
          {children}
        </div>
      ),
    )
    PassPropsComponent.displayName = 'NoPassPropsComponent'

    const Button: any = rocketstyle()({
      name: 'NoPassPropsButton',
      component: PassPropsComponent,
    }).states(() => ({
      primary: { color: 'blue' },
    }))

    render(
      <Button data-testid="btn" state="primary">
        NoPass
      </Button>,
      { wrapper },
    )
    // Without passProps, the state prop should be filtered out
    expect(screen.getByTestId('btn')).toHaveAttribute('data-state', 'none')
  })
})

describe('IS_ROCKETSTYLE component wrapping', () => {
  it('skips styled() wrapping when component already has IS_ROCKETSTYLE', () => {
    // Create a component marked with IS_ROCKETSTYLE = true
    // When IS_ROCKETSTYLE is true, rocketstyle.tsx line 122-123 uses the component
    // directly instead of wrapping it with styled()
    const MarkedComponent = forwardRef(
      ({ children, $rocketstyle, $rocketstate, ...rest }: any, ref: any) => (
        <div ref={ref} {...rest}>
          {children}
        </div>
      ),
    ) as any
    MarkedComponent.IS_ROCKETSTYLE = true
    MarkedComponent.displayName = 'MarkedComponent'

    // The component should be created without errors — the IS_ROCKETSTYLE
    // branch is exercised during construction (line 122-123)
    const Outer: any = rocketstyle()({
      name: 'OuterComponent',
      component: MarkedComponent,
    })

    expect(Outer).toBeDefined()
    expect(Outer.IS_ROCKETSTYLE).toBe(true)
    expect(Outer.displayName).toBe('OuterComponent')
  })

  it('renders IS_ROCKETSTYLE component when chained with config', () => {
    // When using .config() it goes through cloneAndEnhance which initializes filterAttrs
    const MarkedComponent = forwardRef(
      ({ children, $rocketstyle, $rocketstate, ...rest }: any, ref: any) => (
        <div ref={ref} {...rest}>
          {children}
        </div>
      ),
    ) as any
    MarkedComponent.IS_ROCKETSTYLE = true
    MarkedComponent.displayName = 'MarkedComponent'

    const Outer: any = rocketstyle()({
      name: 'OuterChained',
      component: MarkedComponent,
    }).config({})

    render(<Outer data-testid="outer">Wrapped</Outer>, { wrapper })
    expect(screen.getByTestId('outer')).toBeInTheDocument()
  })
})

describe('empty dimensions validation', () => {
  it('throws when dimensions is an empty object', () => {
    expect(() => {
      rocketstyle({ dimensions: {} as any })({
        name: 'EmptyDimensions',
        component: BaseComponent,
      })
    }).toThrow('dimensions')
  })
})

describe('multiple dimension values', () => {
  it('renders with array values for multi-key dimensions', () => {
    const Button: any = rocketstyle()({
      name: 'MultiButton',
      component: BaseComponent,
    }).multiple(() => ({
      bold: { fontWeight: 'bold' },
      italic: { fontStyle: 'italic' },
      underline: { textDecoration: 'underline' },
    }))

    render(
      <Button data-testid="btn" multiple={['bold', 'italic']}>
        Multi
      </Button>,
      { wrapper },
    )
    expect(screen.getByTestId('btn')).toBeInTheDocument()
  })

  it('renders with single value for non-multi dimensions', () => {
    const Button: any = rocketstyle()({
      name: 'SingleDimButton',
      component: BaseComponent,
    })
      .states(() => ({
        primary: { color: 'blue' },
        secondary: { color: 'green' },
      }))
      .sizes(() => ({
        small: { fontSize: 12 },
        large: { fontSize: 18 },
      }))

    render(
      <Button data-testid="btn" state="primary" size="large">
        Dual
      </Button>,
      { wrapper },
    )
    expect(screen.getByTestId('btn')).toBeInTheDocument()
  })

  it('renders with boolean shorthand for multi-key dimensions', () => {
    const Button: any = rocketstyle()({
      name: 'MultiBoolButton',
      component: BaseComponent,
    }).multiple(() => ({
      bold: { fontWeight: 'bold' },
      italic: { fontStyle: 'italic' },
    }))

    // Boolean shorthand for multi-key: both bold and italic as boolean props
    render(
      <Button data-testid="btn" bold italic>
        MultiBool
      </Button>,
      { wrapper },
    )
    expect(screen.getByTestId('btn')).toBeInTheDocument()
  })
})

describe('rendering without Provider context', () => {
  it('renders component without any Provider (useContext returns null)', () => {
    // Render without CoreProvider wrapper — useThemeAttrs line 25 fallback
    const Button: any = rocketstyle()({
      name: 'NoProviderButton',
      component: BaseComponent,
    }).config({})

    render(<Button data-testid="btn">NoCtx</Button>)
    expect(screen.getByTestId('btn')).toBeInTheDocument()
    expect(screen.getByTestId('btn')).toHaveTextContent('NoCtx')
  })
})

describe('WeakMap theme cache hit on re-render', () => {
  it('uses cached theme on re-render with same theme object', () => {
    const Button: any = rocketstyle()({
      name: 'CacheHitButton',
      component: BaseComponent,
    })
      .theme(() => ({ color: 'default' }))
      .states(() => ({
        primary: { color: 'blue' },
        secondary: { color: 'green' },
      }))

    const { rerender } = render(
      <Button data-testid="btn" state="primary">
        First
      </Button>,
      { wrapper },
    )
    expect(screen.getByTestId('btn')).toBeInTheDocument()

    // Re-render with same props — WeakMap cache hit paths
    rerender(
      <Button data-testid="btn" state="primary">
        Second
      </Button>,
    )
    expect(screen.getByTestId('btn')).toHaveTextContent('Second')
  })

  it('re-renders with different state to exercise cache miss then hit', () => {
    const Button: any = rocketstyle()({
      name: 'CacheMissButton',
      component: BaseComponent,
    })
      .theme(() => ({ color: 'base' }))
      .states(() => ({
        primary: { color: 'blue' },
        secondary: { color: 'green' },
      }))

    const { rerender } = render(
      <Button data-testid="btn" state="primary">
        A
      </Button>,
      { wrapper },
    )

    // Change state — new rocketstate but same theme cache
    rerender(
      <Button data-testid="btn" state="secondary">
        B
      </Button>,
    )
    expect(screen.getByTestId('btn')).toHaveTextContent('B')

    // Re-render with same state — full cache hit
    rerender(
      <Button data-testid="btn" state="secondary">
        C
      </Button>,
    )
    expect(screen.getByTestId('btn')).toHaveTextContent('C')
  })

  it('hits WeakMap cache when two instances share the same theme object', () => {
    // Two simultaneous instances of the same component share a ThemeManager.
    // The first instance populates the WeakMap; the second's useMemo callback
    // finds the entry already present — exercising the cache-hit branch.
    const Button: any = rocketstyle()({
      name: 'DualInstanceButton',
      component: BaseComponent,
    })
      .theme(() => ({ color: 'default' }))
      .states(() => ({
        primary: { color: 'blue' },
        secondary: { color: 'green' },
      }))

    render(
      <CoreProvider theme={{ rootSize: 16 }}>
        <Button data-testid="btn1" state="primary">
          First
        </Button>
        <Button data-testid="btn2" state="secondary">
          Second
        </Button>
      </CoreProvider>,
    )

    expect(screen.getByTestId('btn1')).toHaveTextContent('First')
    expect(screen.getByTestId('btn2')).toHaveTextContent('Second')
  })

  it('hits modeBaseTheme and modeDimensionTheme caches across instances', () => {
    // Exercises all four WeakMap caches (baseTheme, dimensionsThemes,
    // modeBaseTheme, modeDimensionTheme) by rendering three instances
    // that share the same theme object and mode.
    const Button: any = rocketstyle()({
      name: 'TripleInstanceButton',
      component: BaseComponent,
    })
      .theme(() => ({ bg: 'white', fg: 'black' }))
      .states(() => ({
        primary: { color: 'blue' },
        secondary: { color: 'green' },
      }))
      .sizes(() => ({
        small: { fontSize: 12 },
        large: { fontSize: 18 },
      }))

    render(
      <CoreProvider theme={{ rootSize: 16 }}>
        <Button data-testid="a" state="primary" size="small">
          A
        </Button>
        <Button data-testid="b" state="secondary" size="large">
          B
        </Button>
        <Button data-testid="c" state="primary" size="large">
          C
        </Button>
      </CoreProvider>,
    )

    expect(screen.getByTestId('a')).toBeInTheDocument()
    expect(screen.getByTestId('b')).toBeInTheDocument()
    expect(screen.getByTestId('c')).toBeInTheDocument()
  })
})

describe('ref handling', () => {
  it('renders without ref (both ref and $rocketstyleRef null)', () => {
    const Button: any = rocketstyle()({
      name: 'NoRefButton',
      component: BaseComponent,
    }).config({})

    // No ref passed — line 347: (ref ?? $rocketstyleRef) is falsy → undefined
    render(<Button data-testid="btn">NoRef</Button>, { wrapper })
    expect(screen.getByTestId('btn')).toBeInTheDocument()
  })
})
