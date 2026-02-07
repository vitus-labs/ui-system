import {
  createJSXCode,
  createJSXCodeArray,
  generateMainJSXCode,
} from '../utils/code'

describe('createJSXCode extended', () => {
  it('handles array props', () => {
    const result = createJSXCode('Button', { items: ['a', 'b'] })
    expect(result).toContain('Button')
    expect(result).toContain('items={')
    expect(result).toContain('"a"')
    expect(result).toContain('"b"')
  })

  it('handles object props', () => {
    const result = createJSXCode('Button', { style: { color: 'red' } })
    expect(result).toContain('style={')
    expect(result).toContain('color: "red"')
  })

  it('handles nested object props', () => {
    const result = createJSXCode('Button', {
      config: { nested: { deep: 'value' } },
    })
    expect(result).toContain('config={')
    expect(result).toContain('deep: "value"')
  })

  it('handles number values in objects', () => {
    const result = createJSXCode('Button', { style: { size: 16 } })
    expect(result).toContain('size: 16')
  })

  it('handles boolean true props', () => {
    const result = createJSXCode('Button', { primary: true })
    expect(result).toContain('primary')
    expect(result).not.toContain('primary=')
  })

  it('handles boolean false props', () => {
    const result = createJSXCode('Button', { disabled: false })
    expect(result).toContain('disabled=false')
  })

  it('handles null/undefined string props', () => {
    const result = createJSXCode('Button', { value: null })
    // null is filtered out by parseProps
    expect(result).toContain('Button')
  })

  it('handles nested arrays in objects', () => {
    const result = createJSXCode('Button', {
      style: { sizes: [1, 2] },
    })
    expect(result).toContain('sizes:')
  })

  it('handles array with nested objects', () => {
    const result = createJSXCode('Button', {
      data: [{ id: 1 }, { id: 2 }],
    })
    expect(result).toContain('data={')
    expect(result).toContain('id: 1')
  })

  it('handles array with nested arrays', () => {
    const result = createJSXCode('Button', {
      matrix: [
        [1, 2],
        [3, 4],
      ],
    })
    expect(result).toContain('matrix={')
  })

  it('handles control object with type/options/value', () => {
    const result = createJSXCode('Button', {
      size: { type: 'select', options: ['sm', 'lg'], value: 'sm' },
    })
    // parseProps extracts defaultValue from control config
    expect(result).toContain('size=')
  })

  it('handles array with boolean values', () => {
    const result = createJSXCode('Button', { flags: [true, false] })
    expect(result).toContain('flags={')
    expect(result).toContain('true')
  })
})

describe('createJSXCodeArray', () => {
  it('generates JSX for each dimension value', () => {
    const result = createJSXCodeArray(
      'Button',
      { label: 'Hi' },
      'state',
      { primary: true, secondary: true },
      false,
      false,
    )
    expect(result).toContain('state="primary"')
    expect(result).toContain('state="secondary"')
    expect(result).toContain('label="Hi"')
  })

  it('uses array syntax for multi-key dimensions', () => {
    const result = createJSXCodeArray(
      'Button',
      {},
      'tags',
      { a: true, b: true },
      false,
      true,
    )
    expect(result).toContain('tags={')
  })

  it('adds boolean alternative comment when useBooleans is true', () => {
    const result = createJSXCodeArray(
      'Button',
      {},
      'state',
      { primary: true, secondary: true },
      true,
      false,
    )
    expect(result).toContain('alternatively use boolean')
    expect(result).toContain('primary')
  })

  it('returns comment when dimensions is falsy', () => {
    const result = createJSXCodeArray(
      'Button',
      {},
      'state',
      null as any,
      false,
      false,
    )
    expect(result).toContain('nothing here')
  })

  it('removes dimension name from passed props', () => {
    const result = createJSXCodeArray(
      'Button',
      { state: 'default', label: 'Hi' },
      'state',
      { primary: true },
      false,
      false,
    )
    expect(result).toContain('label="Hi"')
    // The original state prop should be replaced by the dimension value
    expect(result).toContain('state="primary"')
  })
})

describe('generateMainJSXCode extended', () => {
  it('includes boolean dimension comment when booleanDimensions provided', () => {
    const result = generateMainJSXCode({
      name: 'Button',
      props: { label: 'Hi' },
      dimensions: { state: 'primary' },
      booleanDimensions: { primary: true },
    })
    expect(result).toContain('alternatively use boolean')
    expect(result).toContain('primary')
  })

  it('does not include boolean comment when no booleanDimensions', () => {
    const result = generateMainJSXCode({
      name: 'Button',
      props: { label: 'Hi' },
      dimensions: { state: 'primary' },
      booleanDimensions: null,
    })
    expect(result).not.toContain('alternatively')
  })
})
