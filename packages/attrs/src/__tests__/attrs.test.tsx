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

  it('should update displayName when name is changed', () => {
    const Original = attrs({ name: 'Original', component: BaseComponent })
    const Renamed = Original.config({ name: 'Renamed' })
    expect(Renamed.displayName).toBe('Renamed')
    expect(Original.displayName).toBe('Original')
  })

  it('should swap the rendered component', () => {
    const AltComponent = (props: any) => (
      <span data-testid="alt" {...props}>
        {props.label}
      </span>
    )

    const Original = attrs({ name: 'Test', component: BaseComponent })
    const Swapped = Original.config({ component: AltComponent })

    render(<Swapped label="swapped" />)
    expect(screen.queryByTestId('base')).toBeNull()
    expect(screen.getByTestId('alt')).toHaveTextContent('swapped')
  })

  it('should preserve attrs chain after config swap', () => {
    const AltComponent = (props: any) => (
      <span data-testid="alt" {...props}>
        {props.label}
      </span>
    )

    const Component = attrs({ name: 'Test', component: BaseComponent })
      .attrs(() => ({ label: 'from-attrs' }))
      .config({ component: AltComponent })

    render(<Component />)
    expect(screen.getByTestId('alt')).toHaveTextContent('from-attrs')
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
// .compose() chaining
// --------------------------------------------------------
describe('.compose() chaining', () => {
  it('should wrap component with a HOC', () => {
    const withWrapper = (WrappedComponent: any) => (props: any) => (
      <div data-testid="hoc-wrapper">
        <WrappedComponent {...props} />
      </div>
    )

    const Component = attrs({
      name: 'Test',
      component: BaseComponent,
    }).compose({ withWrapper })

    render(<Component label="composed" />)
    expect(screen.getByTestId('hoc-wrapper')).toBeDefined()
    expect(screen.getByTestId('base')).toHaveTextContent('composed')
  })

  it('should apply multiple HOCs in correct order', () => {
    const order: string[] = []

    const withOuter = (Wrapped: any) => (props: any) => {
      order.push('outer')
      return <Wrapped {...props} />
    }

    const withInner = (Wrapped: any) => (props: any) => {
      order.push('inner')
      return <Wrapped {...props} />
    }

    const Component = attrs({
      name: 'Test',
      component: BaseComponent,
    }).compose({ withOuter, withInner })

    render(<Component />)
    // calculateHocsFuncs reverses the order: last-defined runs first
    expect(order).toEqual(['inner', 'outer'])
  })

  it('should remove a HOC by setting it to false', () => {
    const withWrapper = (WrappedComponent: any) => (props: any) => (
      <div data-testid="hoc-wrapper">
        <WrappedComponent {...props} />
      </div>
    )

    const WithHoc = attrs({
      name: 'Test',
      component: BaseComponent,
    }).compose({ withWrapper })

    const WithoutHoc = WithHoc.compose({ withWrapper: false })

    render(<WithoutHoc label="no-hoc" />)
    expect(screen.queryByTestId('hoc-wrapper')).toBeNull()
    expect(screen.getByTestId('base')).toHaveTextContent('no-hoc')
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

  it('should merge multiple attrs chains', () => {
    const Component = attrs({
      name: 'Test',
      component: BaseComponent,
    })
      .attrs(() => ({ color: 'blue' }))
      .attrs(() => ({ size: 'lg' }))

    const defaults = Component.getDefaultAttrs({})
    expect(defaults).toEqual({ color: 'blue', size: 'lg' })
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

// --------------------------------------------------------
// Deep chaining
// --------------------------------------------------------
describe('deep chaining', () => {
  it('should accumulate attrs across 3+ levels', () => {
    const Component = attrs({ name: 'Test', component: BaseComponent })
      .attrs(() => ({ 'data-a': '1' }))
      .attrs(() => ({ 'data-b': '2' }))
      .attrs(() => ({ 'data-c': '3' }))

    render(<Component />)
    const el = screen.getByTestId('base')
    expect(el).toHaveAttribute('data-a', '1')
    expect(el).toHaveAttribute('data-b', '2')
    expect(el).toHaveAttribute('data-c', '3')
  })

  it('should combine attrs, statics, and config in a single chain', () => {
    const Component = attrs({ name: 'Base', component: BaseComponent })
      .attrs(() => ({ label: 'hello' }))
      .statics({ variant: 'primary' })
      .config({ name: 'FinalName' })
      .attrs(() => ({ 'data-extra': 'yes' }))

    expect(Component.displayName).toBe('FinalName')
    expect(Component.meta).toEqual({ variant: 'primary' })

    render(<Component />)
    const el = screen.getByTestId('base')
    expect(el).toHaveTextContent('hello')
    expect(el).toHaveAttribute('data-extra', 'yes')
  })

  it('should allow later attrs to override earlier ones', () => {
    const Component = attrs({ name: 'Test', component: BaseComponent })
      .attrs(() => ({ label: 'first' }))
      .attrs(() => ({ label: 'second' }))
      .attrs(() => ({ label: 'third' }))

    render(<Component />)
    expect(screen.getByTestId('base')).toHaveTextContent('third')
  })
})
