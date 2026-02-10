import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createGlobalStyle } from '../globalStyle'
import { ThemeProvider } from '../ThemeProvider'

describe('createGlobalStyle', () => {
  it('returns a component function', () => {
    const GlobalStyle = createGlobalStyle`
      body { margin: 0; }
    `
    expect(typeof GlobalStyle).toBe('function')
  })

  it('renders nothing (returns null)', () => {
    const GlobalStyle = createGlobalStyle`
      body { margin: 0; padding: 0; }
    `
    const { container } = render(<GlobalStyle />)
    expect(container.innerHTML).toBe('')
  })

  it('has a displayName', () => {
    const GlobalStyle = createGlobalStyle`
      body { margin: 0; }
    `
    expect(GlobalStyle.displayName).toBe('GlobalStyle')
  })

  it('handles dynamic interpolations with theme', () => {
    const GlobalStyle = createGlobalStyle`
      body { font-family: ${({ theme }: any) => theme.font}; }
    `
    const { container } = render(
      <ThemeProvider theme={{ font: 'Arial' }}>
        <GlobalStyle />
      </ThemeProvider>,
    )
    expect(container.innerHTML).toBe('')
  })

  it('handles static interpolations', () => {
    const color = 'red'
    const GlobalStyle = createGlobalStyle`
      body { color: ${color}; }
    `
    const { container } = render(<GlobalStyle />)
    expect(container.innerHTML).toBe('')
  })
})
