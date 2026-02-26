import { buildProps, filterProps } from '../forward'

describe('filterProps', () => {
  describe('keeps standard HTML props', () => {
    it('keeps id', () => {
      const result = filterProps({ id: 'test' })
      expect(result.id).toBe('test')
    })

    it('keeps className', () => {
      const result = filterProps({ className: 'foo' })
      expect(result.className).toBe('foo')
    })

    it('keeps style', () => {
      const style = { color: 'red' }
      const result = filterProps({ style })
      expect(result.style).toBe(style)
    })

    it('keeps href', () => {
      const result = filterProps({ href: '/path' })
      expect(result.href).toBe('/path')
    })

    it('keeps disabled', () => {
      const result = filterProps({ disabled: true })
      expect(result.disabled).toBe(true)
    })

    it('keeps multiple standard props at once', () => {
      const result = filterProps({
        id: 'main',
        tabIndex: 0,
        role: 'button',
        title: 'Click me',
      })
      expect(result).toEqual({
        id: 'main',
        tabIndex: 0,
        role: 'button',
        title: 'Click me',
      })
    })
  })

  describe('keeps data-* attributes', () => {
    it('keeps data-testid', () => {
      const result = filterProps({ 'data-testid': 'hello' })
      expect(result['data-testid']).toBe('hello')
    })

    it('keeps data-custom', () => {
      const result = filterProps({ 'data-custom': 'value' })
      expect(result['data-custom']).toBe('value')
    })
  })

  describe('keeps aria-* attributes', () => {
    it('keeps aria-label', () => {
      const result = filterProps({ 'aria-label': 'Close' })
      expect(result['aria-label']).toBe('Close')
    })

    it('keeps aria-hidden', () => {
      const result = filterProps({ 'aria-hidden': true })
      expect(result['aria-hidden']).toBe(true)
    })

    it('keeps aria-describedby', () => {
      const result = filterProps({ 'aria-describedby': 'desc' })
      expect(result['aria-describedby']).toBe('desc')
    })
  })

  describe('keeps event handlers', () => {
    it('keeps onClick', () => {
      const fn = () => undefined
      const result = filterProps({ onClick: fn })
      expect(result.onClick).toBe(fn)
    })

    it('keeps onMouseEnter', () => {
      const fn = () => undefined
      const result = filterProps({ onMouseEnter: fn })
      expect(result.onMouseEnter).toBe(fn)
    })

    it('keeps onKeyDown', () => {
      const fn = () => undefined
      const result = filterProps({ onKeyDown: fn })
      expect(result.onKeyDown).toBe(fn)
    })
  })

  describe('strips $-prefixed transient props', () => {
    it('strips $rocketstyle', () => {
      const result = filterProps({ $rocketstyle: { color: 'red' } })
      expect(result).toEqual({})
    })

    it('strips $element', () => {
      const result = filterProps({ $element: 'button' })
      expect(result).toEqual({})
    })

    it('strips $active', () => {
      const result = filterProps({ $active: true })
      expect(result).toEqual({})
    })

    it('strips multiple $-prefixed props while keeping valid ones', () => {
      const result = filterProps({
        $rocketstyle: {},
        $element: 'div',
        id: 'test',
        'data-x': 'y',
      })
      expect(result).toEqual({ id: 'test', 'data-x': 'y' })
    })
  })

  describe('strips as prop', () => {
    it('strips the as prop', () => {
      const result = filterProps({ as: 'button' })
      expect(result).toEqual({})
    })

    it('strips as while keeping other props', () => {
      const result = filterProps({ as: 'section', id: 'main' })
      expect(result).toEqual({ id: 'main' })
    })
  })

  describe('strips unknown props', () => {
    it('strips customProp', () => {
      const result = filterProps({ customProp: 'value' })
      expect(result).toEqual({})
    })

    it('strips myThing', () => {
      const result = filterProps({ myThing: 42 })
      expect(result).toEqual({})
    })

    it('strips camelCase unknown props', () => {
      const result = filterProps({ isActive: true, backgroundColor: 'red' })
      expect(result).toEqual({})
    })

    it('returns empty object for all-unknown props', () => {
      const result = filterProps({
        foo: 1,
        bar: 2,
        baz: 3,
        customThing: 'x',
      })
      expect(result).toEqual({})
    })
  })
})

describe('buildProps', () => {
  describe('ref handling', () => {
    it('sets ref on result', () => {
      const ref = { current: null }
      const result = buildProps({}, 'vl-abc', ref, false)
      expect(result.ref).toBe(ref)
    })

    it('sets null ref', () => {
      const result = buildProps({}, 'vl-abc', null, false)
      expect(result.ref).toBeNull()
    })
  })

  describe('className merging', () => {
    it('merges generatedCls with user className', () => {
      const result = buildProps({ className: 'custom' }, 'vl-abc', null, false)
      expect(result.className).toBe('vl-abc custom')
    })

    it('uses only generatedCls when no user className', () => {
      const result = buildProps({}, 'vl-abc', null, false)
      expect(result.className).toBe('vl-abc')
    })

    it('uses only user className when generatedCls is empty', () => {
      const result = buildProps({ className: 'custom' }, '', null, false)
      expect(result.className).toBe('custom')
    })

    it('sets no className when both are empty/missing', () => {
      const result = buildProps({}, '', null, false)
      expect(result.className).toBeUndefined()
    })
  })

  describe('isDOM=false (component target)', () => {
    it('forwards all props except as and className', () => {
      const result = buildProps(
        {
          as: 'button',
          className: 'user',
          customProp: 'hello',
          $rocketstyle: {},
          'data-x': 'y',
          onClick: () => undefined,
        },
        'vl-abc',
        null,
        false,
      )

      expect(result.customProp).toBe('hello')
      expect(result.$rocketstyle).toEqual({})
      expect(result['data-x']).toBe('y')
      expect(result.onClick).toBeDefined()
      // as and className are not forwarded from rawProps (className is merged separately)
      expect(result.as).toBeUndefined()
      expect(result.className).toBe('vl-abc user')
    })
  })

  describe('isDOM=true (default filtering)', () => {
    it('filters unknown DOM props', () => {
      const result = buildProps(
        { customProp: 'hello', unknownThing: 42 },
        'vl-abc',
        null,
        true,
      )
      expect(result.customProp).toBeUndefined()
      expect(result.unknownThing).toBeUndefined()
      expect(result.className).toBe('vl-abc')
    })

    it('strips $-prefixed props', () => {
      const result = buildProps(
        { $rocketstyle: {}, $active: true, id: 'test' },
        'vl-abc',
        null,
        true,
      )
      expect(result.$rocketstyle).toBeUndefined()
      expect(result.$active).toBeUndefined()
      expect(result.id).toBe('test')
    })

    it('keeps data-* and aria-* attributes', () => {
      const result = buildProps(
        { 'data-testid': 'btn', 'aria-label': 'Close' },
        'vl-abc',
        null,
        true,
      )
      expect(result['data-testid']).toBe('btn')
      expect(result['aria-label']).toBe('Close')
    })

    it('keeps standard HTML attributes', () => {
      const result = buildProps(
        { id: 'main', disabled: true, tabIndex: 0 },
        'vl-abc',
        null,
        true,
      )
      expect(result.id).toBe('main')
      expect(result.disabled).toBe(true)
      expect(result.tabIndex).toBe(0)
    })

    it('strips as prop', () => {
      const result = buildProps({ as: 'section' }, 'vl-abc', null, true)
      expect(result.as).toBeUndefined()
    })
  })

  describe('isDOM=true with customFilter', () => {
    it('uses customFilter to decide which props to forward', () => {
      const customFilter = (prop: string) => prop.startsWith('my')
      const result = buildProps(
        { myProp: 'yes', otherProp: 'no', id: 'skip' },
        'vl-abc',
        null,
        true,
        customFilter,
      )
      expect(result.myProp).toBe('yes')
      expect(result.otherProp).toBeUndefined()
      expect(result.id).toBeUndefined()
    })

    it('customFilter still skips as and className from rawProps', () => {
      const customFilter = () => true
      const result = buildProps(
        { as: 'button', className: 'user', id: 'test' },
        'vl-abc',
        null,
        true,
        customFilter,
      )
      // as is always skipped
      expect(result.as).toBeUndefined()
      // className is merged, not forwarded from rawProps
      expect(result.className).toBe('vl-abc user')
      expect(result.id).toBe('test')
    })
  })
})
