import { render, screen } from '@testing-library/react'
import React, { createRef } from 'react'
import attrs from '~/init'
import isAttrsComponent from '~/isAttrsComponent'

const BaseComponent = (props: any) => (
  <div data-testid="base" {...props}>
    {props.children ?? props.label}
  </div>
)

// --------------------------------------------------------
// attrs() initialization
// --------------------------------------------------------
describe('attrs initialization', () => {
  it('should create an attrs component from a base component', () => {
    const Component = attrs({ name: 'TestComponent', component: BaseComponent })
    expect(Component).toBeDefined()
    expect(Component.IS_ATTRS).toBe(true)
    expect(Component.displayName).toBe('TestComponent')
  })

  it('should throw when component is missing (dev mode)', () => {
    expect(() => attrs({ name: 'Test', component: undefined as any })).toThrow()
  })

  it('should throw when name is missing (dev mode)', () => {
    expect(() =>
      attrs({ name: undefined as any, component: BaseComponent }),
    ).toThrow()
  })

  it('should render the wrapped component', () => {
    const Component = attrs({ name: 'Test', component: BaseComponent })
    render(<Component label="Hello" />)
    expect(screen.getByTestId('base')).toHaveTextContent('Hello')
  })

  it('should add data-attrs in development mode', () => {
    const Component = attrs({ name: 'MyComponent', component: BaseComponent })
    render(<Component />)
    expect(screen.getByTestId('base')).toHaveAttribute(
      'data-attrs',
      'MyComponent',
    )
  })
})

// --------------------------------------------------------
// .attrs() chaining
// --------------------------------------------------------
describe('.attrs() chaining', () => {
  it('should apply default attrs to the component', () => {
    const Component = attrs({
      name: 'Test',
      component: BaseComponent,
    }).attrs(() => ({ label: 'Default Label' }))

    render(<Component />)
    expect(screen.getByTestId('base')).toHaveTextContent('Default Label')
  })

  it('should allow props to override default attrs', () => {
    const Component = attrs({
      name: 'Test',
      component: BaseComponent,
    }).attrs(() => ({ label: 'Default' }))

    render(<Component label="Override" />)
    expect(screen.getByTestId('base')).toHaveTextContent('Override')
  })

  it('should support multiple .attrs() chains', () => {
    const Component = attrs({
      name: 'Test',
      component: BaseComponent,
    })
      .attrs(() => ({ 'data-first': 'yes' }))
      .attrs(() => ({ 'data-second': 'yes' }))

    render(<Component />)
    const el = screen.getByTestId('base')
    expect(el).toHaveAttribute('data-first', 'yes')
    expect(el).toHaveAttribute('data-second', 'yes')
  })

  it('should pass current props to attrs callback', () => {
    const Component = attrs({
      name: 'Test',
      component: BaseComponent,
    }).attrs((props: any) => ({
      'data-variant': props.variant === 'primary' ? 'is-primary' : 'is-default',
    }))

    render(<Component variant="primary" />)
    expect(screen.getByTestId('base')).toHaveAttribute(
      'data-variant',
      'is-primary',
    )
  })

  it('should support object-based attrs', () => {
    const Component = attrs({
      name: 'Test',
      component: BaseComponent,
    }).attrs({ label: 'Static Label' })

    render(<Component />)
    expect(screen.getByTestId('base')).toHaveTextContent('Static Label')
  })

  it('should support priority attrs', () => {
    const Component = attrs({
      name: 'Test',
      component: BaseComponent,
    })
      .attrs(() => ({ label: 'Normal' }))
      .attrs(() => ({ label: 'Priority' }), { priority: true })

    // Priority attrs have lower precedence than normal attrs
    render(<Component />)
    expect(screen.getByTestId('base')).toHaveTextContent('Normal')
  })

  it('should support filter option to remove attrs from final props', () => {
    const Component = attrs({
      name: 'Test',
      component: BaseComponent,
    }).attrs(() => ({ label: 'Visible' }), {
      filter: ['data-internal'],
    })

    render(<Component data-internal="secret" label="test" />)
    const el = screen.getByTestId('base')
    expect(el).not.toHaveAttribute('data-internal')
  })
})

// --------------------------------------------------------
// .config() chaining
// --------------------------------------------------------
describe('.config() chaining', () => {
  it('should return a new component instance', () => {
    const Original = attrs({ name: 'Test', component: BaseComponent })
    const Configured = Original.config({})
    expect(Configured).not.toBe(Original)
    expect(Configured.IS_ATTRS).toBe(true)
  })
})

// --------------------------------------------------------
// .statics() chaining
// --------------------------------------------------------
describe('.statics() chaining', () => {
  it('should assign statics to component meta', () => {
    const Component = attrs({
      name: 'Test',
      component: BaseComponent,
    }).statics({ theme: 'dark', sizes: ['sm', 'md', 'lg'] })

    expect(Component.meta).toEqual({
      theme: 'dark',
      sizes: ['sm', 'md', 'lg'],
    })
  })

  it('should merge statics across chains', () => {
    const Component = attrs({
      name: 'Test',
      component: BaseComponent,
    })
      .statics({ theme: 'dark' })
      .statics({ variant: 'primary' })

    expect(Component.meta).toEqual({
      theme: 'dark',
      variant: 'primary',
    })
  })
})

// --------------------------------------------------------
// .getDefaultAttrs()
// --------------------------------------------------------
describe('.getDefaultAttrs()', () => {
  it('should return computed default attrs for given props', () => {
    const Component = attrs({
      name: 'Test',
      component: BaseComponent,
    }).attrs((props: any) => ({
      computed: props.variant === 'primary' ? 'blue' : 'gray',
    }))

    const defaults = Component.getDefaultAttrs({ variant: 'primary' })
    expect(defaults).toEqual({ computed: 'blue' })
  })

  it('should return empty object when no attrs defined', () => {
    const Component = attrs({ name: 'Test', component: BaseComponent })
    const defaults = Component.getDefaultAttrs({})
    expect(defaults).toEqual({})
  })
})

// --------------------------------------------------------
// isAttrsComponent
// --------------------------------------------------------
describe('isAttrsComponent', () => {
  it('should return true for attrs components', () => {
    const Component = attrs({ name: 'Test', component: BaseComponent })
    expect(isAttrsComponent(Component)).toBe(true)
  })

  it('should return false for plain React components', () => {
    expect(isAttrsComponent(BaseComponent)).toBe(false)
  })

  it('should return false for null', () => {
    expect(isAttrsComponent(null)).toBe(false)
  })

  it('should return false for undefined', () => {
    expect(isAttrsComponent(undefined)).toBe(false)
  })

  it('should return false for non-objects', () => {
    expect(isAttrsComponent('string')).toBe(false)
    expect(isAttrsComponent(123)).toBe(false)
  })

  it('should return true for objects with IS_ATTRS property', () => {
    expect(isAttrsComponent({ IS_ATTRS: true })).toBe(true)
  })
})

// --------------------------------------------------------
// Ref forwarding
// --------------------------------------------------------
describe('ref forwarding', () => {
  it('should forward ref to the base component', () => {
    const RefComponent = React.forwardRef<HTMLDivElement, any>((props, ref) => (
      <div ref={ref} data-testid="ref-target" {...props} />
    ))

    const Component = attrs({ name: 'Test', component: RefComponent })
    const ref = createRef<HTMLDivElement>()

    render(<Component ref={ref} />)
    expect(ref.current).toBe(screen.getByTestId('ref-target'))
  })
})

// --------------------------------------------------------
// Immutability
// --------------------------------------------------------
describe('immutability', () => {
  it('should return new instances on each chain call', () => {
    const Base = attrs({ name: 'Test', component: BaseComponent })
    const WithAttrs = Base.attrs(() => ({ label: 'a' }))
    const WithStatics = Base.statics({ x: 1 })

    expect(Base).not.toBe(WithAttrs)
    expect(Base).not.toBe(WithStatics)
    expect(WithAttrs).not.toBe(WithStatics)
  })

  it('should not affect parent when child is modified', () => {
    const Parent = attrs({
      name: 'Parent',
      component: BaseComponent,
    }).attrs(() => ({ label: 'Parent' }))

    const Child = Parent.attrs(() => ({ label: 'Child' }))

    const { unmount } = render(<Parent />)
    expect(screen.getByTestId('base')).toHaveTextContent('Parent')
    unmount()

    render(<Child />)
    expect(screen.getByTestId('base')).toHaveTextContent('Child')
  })
})
