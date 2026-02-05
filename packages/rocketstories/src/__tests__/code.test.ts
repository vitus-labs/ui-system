import { createJSXCode, generateMainJSXCode } from '../utils/code'

describe('createJSXCode', () => {
  it('creates self-closing JSX with props', () => {
    const result = createJSXCode('Button', { size: 'large' })
    expect(result).toBe('<Button size="large" />')
  })

  it('handles boolean true props', () => {
    const result = createJSXCode('Button', { primary: true })
    expect(result).toBe('<Button primary />')
  })

  it('handles boolean false props', () => {
    const result = createJSXCode('Button', { disabled: false })
    expect(result).toBe('<Button disabled=false />')
  })

  it('handles number props', () => {
    const result = createJSXCode('Button', { count: 5 })
    expect(result).toBe('<Button count="5" />')
  })

  it('handles multiple props', () => {
    const result = createJSXCode('Button', { size: 'lg', primary: true })
    expect(result).toContain('size="lg"')
    expect(result).toContain('primary')
  })

  it('parses component name from path', () => {
    const result = createJSXCode('Namespace/Button', { a: 1 })
    expect(result).toContain('<Button')
  })

  it('filters null values', () => {
    const result = createJSXCode('Button', { a: 'val', b: null } as any)
    expect(result).toContain('a="val"')
    expect(result).not.toContain('b=')
  })
})

describe('generateMainJSXCode', () => {
  it('generates basic JSX code', () => {
    const result = generateMainJSXCode({
      name: 'Button',
      props: { label: 'Click' },
      dimensions: { size: 'large' },
      booleanDimensions: null,
    })
    expect(result).toContain('<Button')
    expect(result).toContain('size="large"')
    expect(result).toContain('label="Click"')
  })

  it('includes boolean dimension alternative', () => {
    const result = generateMainJSXCode({
      name: 'Button',
      props: {},
      dimensions: { size: 'large' },
      booleanDimensions: { large: true },
    })
    expect(result).toContain('Or alternatively use boolean props')
    expect(result).toContain('large')
  })
})
