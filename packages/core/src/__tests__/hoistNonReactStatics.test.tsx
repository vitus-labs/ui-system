import { forwardRef, memo } from 'react'
import hoistNonReactStatics from '../hoistNonReactStatics'

describe('hoistNonReactStatics', () => {
  it('copies custom static properties from source to target', () => {
    const Source = () => null
    Source.customStatic = 'hello'
    Source.anotherStatic = 42

    const Target = () => null

    hoistNonReactStatics(Target, Source)

    expect((Target as any).customStatic).toBe('hello')
    expect((Target as any).anotherStatic).toBe(42)
  })

  it('does not copy React statics (displayName, propTypes, etc.)', () => {
    const Source = () => null
    Source.displayName = 'SourceComponent'
    Source.propTypes = { foo: () => null }
    Source.defaultProps = { bar: 1 }
    Source.contextType = {}
    Source.customProp = 'should copy'

    const Target = () => null
    Target.displayName = 'TargetComponent'

    hoistNonReactStatics(Target, Source)

    expect(Target.displayName).toBe('TargetComponent')
    expect((Target as any).propTypes).toBeUndefined()
    expect((Target as any).defaultProps).toBeUndefined()
    expect((Target as any).contextType).toBeUndefined()
    expect((Target as any).customProp).toBe('should copy')
  })

  it('does not copy known JS statics (name, length, prototype)', () => {
    const Source = () => null
    Source.customProp = 'value'

    const Target = () => null
    const originalName = Target.name

    hoistNonReactStatics(Target, Source)

    expect(Target.name).toBe(originalName)
    expect((Target as any).customProp).toBe('value')
  })

  it('respects the excludeList', () => {
    const Source = () => null
    Source.foo = 'included'
    Source.bar = 'excluded'
    Source.baz = 'included'

    const Target = () => null

    hoistNonReactStatics(Target, Source, { bar: true })

    expect((Target as any).foo).toBe('included')
    expect((Target as any).bar).toBeUndefined()
    expect((Target as any).baz).toBe('included')
  })

  it('returns the target component', () => {
    const Source = () => null
    const Target = () => null

    const result = hoistNonReactStatics(Target, Source)
    expect(result).toBe(Target)
  })

  it('handles string source (HTML tag) gracefully', () => {
    const Target = () => null

    const result = hoistNonReactStatics(Target, 'div' as any)
    expect(result).toBe(Target)
  })

  it('copies symbol-keyed properties', () => {
    const sym = Symbol('custom')
    const Source = () => null
    ;(Source as any)[sym] = 'symbol value'

    const Target = () => null

    hoistNonReactStatics(Target, Source)

    expect((Target as any)[sym]).toBe('symbol value')
  })

  it('handles forwardRef components — skips render and $$typeof', () => {
    const Inner = (_props: any, _ref: any) => null
    const Source = forwardRef(Inner)
    ;(Source as any).customStatic = 'should copy'

    const Target = () => null

    hoistNonReactStatics(Target, Source)

    expect((Target as any).customStatic).toBe('should copy')
    expect((Target as any).render).toBeUndefined()
    expect((Target as any).$$typeof).toBeUndefined()
  })

  it('handles memo components — skips compare and type', () => {
    const Inner = () => null
    const Source = memo(Inner)
    ;(Source as any).customStatic = 'should copy'

    const Target = () => null

    hoistNonReactStatics(Target, Source)

    expect((Target as any).customStatic).toBe('should copy')
    expect((Target as any).compare).toBeUndefined()
    expect((Target as any).type).toBeUndefined()
  })

  it('copies getters and setters via property descriptors', () => {
    const Source = () => null
    let value = 0
    Object.defineProperty(Source, 'counter', {
      get: () => value,
      set: (v) => {
        value = v
      },
      enumerable: true,
      configurable: true,
    })

    const Target = () => null

    hoistNonReactStatics(Target, Source)

    expect((Target as any).counter).toBe(0)
    ;(Target as any).counter = 5
    expect((Target as any).counter).toBe(5)
    // shares the same backing variable
    expect((Source as any).counter).toBe(5)
  })

  it('does not throw on non-configurable target properties', () => {
    const Source = () => null
    Source.locked = 'source value'

    const Target = () => null
    Object.defineProperty(Target, 'locked', {
      value: 'target value',
      writable: false,
      configurable: false,
    })

    expect(() => hoistNonReactStatics(Target, Source)).not.toThrow()
    expect((Target as any).locked).toBe('target value')
  })

  it('hoists statics from prototype chain', () => {
    function Base() {
      // constructor stub
    }
    Base.prototype = Object.create(null)
    ;(Base as any).inheritedStatic = 'from base'

    function Source() {
      // constructor stub
    }
    Source.prototype = Object.create(null)
    Object.setPrototypeOf(Source, Base)
    ;(Source as any).ownStatic = 'from source'

    const Target = () => null

    hoistNonReactStatics(Target, Source as any)

    expect((Target as any).ownStatic).toBe('from source')
    expect((Target as any).inheritedStatic).toBe('from base')
  })

  it('works with components that have no custom statics', () => {
    const Source = () => null
    const Target = () => null

    expect(() => hoistNonReactStatics(Target, Source)).not.toThrow()
  })

  it('does not overwrite existing target statics with source React statics', () => {
    const Source = forwardRef((_props: any, _ref: any) => null)
    ;(Source as any).displayName = 'SourceName'

    const Target = () => null
    Target.displayName = 'TargetName'

    hoistNonReactStatics(Target, Source)

    expect(Target.displayName).toBe('TargetName')
  })

  it('hoists from memo source to memo target — uses MEMO_STATICS for both', () => {
    const SourceInner = () => null
    const Source = memo(SourceInner)
    ;(Source as any).customProp = 'from memo source'

    const TargetInner = () => null
    const Target = memo(TargetInner)

    hoistNonReactStatics(Target, Source)

    expect((Target as any).customProp).toBe('from memo source')
    // memo statics like compare, type should not be copied (memo sets compare to null by default)
    expect((Target as any).compare).toBeNull()
  })

  it('hoists from forwardRef source to forwardRef target', () => {
    const Source = forwardRef((_props: any, _ref: any) => null)
    ;(Source as any).customProp = 'from fwdRef source'

    const Target = forwardRef((_props: any, _ref: any) => null)

    hoistNonReactStatics(Target, Source)

    expect((Target as any).customProp).toBe('from fwdRef source')
  })

  it('does not copy target FORWARD_REF_STATICS when target is forwardRef', () => {
    const Source = () => null
    ;(Source as any).render = 'should not overwrite'

    const Target = forwardRef((_props: any, _ref: any) => null)

    hoistNonReactStatics(Target, Source)

    // render is in FORWARD_REF_STATICS for target, so it should be skipped
    expect((Target as any).render).not.toBe('should not overwrite')
  })

  it('stops prototype recursion at Object.prototype', () => {
    const Source = () => null
    ;(Source as any).custom = 'value'
    // Source's prototype is Function.prototype which has proto Object.prototype
    // The recursion should walk up and stop at Object.prototype

    const Target = () => null
    expect(() => hoistNonReactStatics(Target, Source)).not.toThrow()
    expect((Target as any).custom).toBe('value')
  })
})
