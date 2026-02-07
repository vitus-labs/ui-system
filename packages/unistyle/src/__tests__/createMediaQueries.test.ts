import { css } from 'styled-components'
import createMediaQueries from '../responsive/createMediaQueries'

describe('createMediaQueries', () => {
  it('creates media query functions for each breakpoint', () => {
    const result = createMediaQueries({
      breakpoints: { xs: 0, md: 768, lg: 1024 },
      rootSize: 16,
      css,
    })
    expect(result.xs).toBeDefined()
    expect(result.md).toBeDefined()
    expect(result.lg).toBeDefined()
  })

  it('smallest breakpoint (0) renders without media wrapper', () => {
    const result = createMediaQueries({
      breakpoints: { xs: 0 },
      rootSize: 16,
      css,
    })
    const output = result.xs`color: red;`
    const flat = Array.isArray(output) ? output.join('') : String(output)
    expect(flat).toContain('color: red')
    expect(flat).not.toContain('@media')
  })

  it('non-zero breakpoint wraps in @media query', () => {
    const result = createMediaQueries({
      breakpoints: { md: 768 },
      rootSize: 16,
      css,
    })
    const output = result.md`color: blue;`
    const flat = Array.isArray(output) ? output.join('') : String(output)
    expect(flat).toContain('@media')
    expect(flat).toContain('min-width')
    // 768 / 16 = 48em
    expect(flat).toContain('48em')
  })

  it('calculates em values correctly', () => {
    const result = createMediaQueries({
      breakpoints: { lg: 1024 },
      rootSize: 16,
      css,
    })
    const output = result.lg`display: block;`
    const flat = Array.isArray(output) ? output.join('') : String(output)
    // 1024 / 16 = 64em
    expect(flat).toContain('64em')
  })

  it('respects custom rootSize', () => {
    const result = createMediaQueries({
      breakpoints: { md: 768 },
      rootSize: 10,
      css,
    })
    const output = result.md`color: red;`
    const flat = Array.isArray(output) ? output.join('') : String(output)
    // 768 / 10 = 76.8em
    expect(flat).toContain('76.8em')
  })
})
