import {
  convertDimensionsToControls,
  createControls,
  disableDimensionControls,
  getDefaultVitusLabsControls,
  makeStorybookControls,
} from '../utils/controls'

describe('createControls', () => {
  it('converts string shorthand to control config', () => {
    const result = createControls({ name: 'text', age: 'number' })
    expect(result).toEqual({
      name: { type: 'text' },
      age: { type: 'number' },
    })
  })

  it('passes through object controls', () => {
    const control = { type: 'select', options: ['a', 'b'] }
    const result = createControls({ status: control })
    expect(result).toEqual({ status: control })
  })

  it('skips non-string non-object values', () => {
    const result = createControls({
      a: 'text',
      b: 123,
      c: true,
      d: { type: 'boolean' },
    })
    expect(result).toEqual({
      a: { type: 'text' },
      d: { type: 'boolean' },
    })
  })

  it('handles empty input', () => {
    expect(createControls({})).toEqual({})
  })

  it('handles null values', () => {
    const result = createControls({ a: null })
    expect(result).toEqual({})
  })
})

describe('convertDimensionsToControls', () => {
  it('converts dimensions to select controls', () => {
    const result = convertDimensionsToControls({
      dimensions: {
        state: { primary: true, secondary: true },
        size: { small: true, large: true },
      },
      multiKeys: {},
    })

    expect(result.state).toEqual({
      type: 'select',
      options: ['primary', 'secondary'],
      group: 'Dimensions [Rocketstyle (Vitus-Labs)]',
    })
    expect(result.size.type).toBe('select')
    expect(result.size.options).toEqual(['small', 'large'])
  })

  it('uses multi-select for multi-key dimensions', () => {
    const result = convertDimensionsToControls({
      dimensions: {
        multiple: { a: true, b: true },
      },
      multiKeys: { multiple: true },
    })
    expect(result.multiple.type).toBe('multi-select')
  })

  it('handles empty dimensions', () => {
    expect(
      convertDimensionsToControls({ dimensions: {}, multiKeys: {} }),
    ).toEqual({})
  })
})

describe('getDefaultVitusLabsControls', () => {
  it('returns element controls for Element component', () => {
    const component = {
      IS_ROCKETSTYLE: true,
      VITUS_LABS__COMPONENT: '@vitus-labs/elements/Element',
    }
    const result = getDefaultVitusLabsControls(component as any)
    expect(result).toHaveProperty('tag')
    expect(result).toHaveProperty('children')
    expect(result).toHaveProperty('direction')
  })

  it('returns list controls for List component', () => {
    const component = {
      IS_ROCKETSTYLE: true,
      VITUS_LABS__COMPONENT: '@vitus-labs/elements/List',
    }
    const result = getDefaultVitusLabsControls(component as any)
    expect(result).toHaveProperty('data')
    expect(result).toHaveProperty('tag') // also has element controls
  })

  it('returns text controls for Text component', () => {
    const component = {
      IS_ROCKETSTYLE: true,
      VITUS_LABS__COMPONENT: '@vitus-labs/elements/Text',
    }
    const result = getDefaultVitusLabsControls(component as any)
    expect(result).toHaveProperty('paragraph')
    expect(result).toHaveProperty('children')
  })

  it('returns overlay controls for Overlay component', () => {
    const component = {
      IS_ROCKETSTYLE: true,
      VITUS_LABS__COMPONENT: '@vitus-labs/elements/Overlay',
    }
    const result = getDefaultVitusLabsControls(component as any)
    expect(result).toHaveProperty('isOpen')
    expect(result).toHaveProperty('type')
  })

  it('includes rocketstyle pseudo controls when IS_ROCKETSTYLE', () => {
    const component = {
      IS_ROCKETSTYLE: true,
      VITUS_LABS__COMPONENT: '@vitus-labs/elements/Element',
    }
    const result = getDefaultVitusLabsControls(component as any)
    expect(result).toHaveProperty('hover')
  })

  it('returns empty for non-vitus-labs component', () => {
    const component = {
      IS_ROCKETSTYLE: false,
      VITUS_LABS__COMPONENT: undefined,
    }
    const result = getDefaultVitusLabsControls(component as any)
    expect(Object.keys(result).length).toBe(0)
  })
})

describe('makeStorybookControls', () => {
  it('converts controls to storybook argTypes format', () => {
    const controls = {
      name: { type: 'text', description: 'The name', group: 'Props' },
    }
    const result = makeStorybookControls(controls, { name: 'default' })

    expect(result.name).toEqual({
      control: { type: 'text' },
      description: 'The name',
      options: undefined,
      table: {
        defaultValue: { summary: 'default' },
        disable: undefined,
        category: 'Props',
        type: { summary: undefined },
      },
    })
  })

  it('handles disabled controls', () => {
    const controls = {
      internal: { disable: true },
    }
    const result = makeStorybookControls(controls, {})
    expect(result.internal).toEqual({ table: { disable: true } })
  })

  it('uses control value when no prop default', () => {
    const controls = {
      name: { type: 'text', value: 'fallback' },
    }
    const result = makeStorybookControls(controls, {})
    expect(result.name.table.defaultValue.summary).toBe('fallback')
  })

  it('skips function prop values', () => {
    const controls = {
      onClick: { type: 'function', value: 'handler' },
    }
    const result = makeStorybookControls(controls, { onClick: () => {} })
    expect(result.onClick.table.defaultValue.summary).toBe('handler')
  })

  it('includes options when provided', () => {
    const controls = {
      size: {
        type: 'select',
        options: ['sm', 'md', 'lg'],
        group: 'Sizing',
      },
    }
    const result = makeStorybookControls(controls, {})
    expect(result.size.options).toEqual(['sm', 'md', 'lg'])
  })

  it('handles empty input', () => {
    expect(makeStorybookControls({}, {})).toEqual({})
  })
})

describe('disableDimensionControls', () => {
  it('disables dimension value keys', () => {
    const dimensions = {
      state: { primary: true, secondary: true },
      size: { small: true, large: true },
    }
    const result = disableDimensionControls(dimensions as any)
    expect(result.primary).toEqual({ table: { disable: true } })
    expect(result.secondary).toEqual({ table: { disable: true } })
    expect(result.small).toEqual({ table: { disable: true } })
    expect(result.large).toEqual({ table: { disable: true } })
  })

  it('also disables the dimension name when provided', () => {
    const dimensions = {
      state: { primary: true },
    }
    const result = disableDimensionControls(dimensions as any, 'state')
    expect(result.state).toEqual({ table: { disable: true } })
    expect(result.primary).toEqual({ table: { disable: true } })
  })

  it('handles empty dimensions', () => {
    expect(disableDimensionControls({} as any)).toEqual({})
  })
})
