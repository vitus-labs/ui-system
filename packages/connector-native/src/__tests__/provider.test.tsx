import { render, screen } from '@testing-library/react'
import type { FC } from 'react'
import { describe, expect, it } from 'vitest'
import { ThemeProvider, useTheme } from '~/provider'

const ThemeDisplay: FC = () => {
  const theme = useTheme()
  return <div data-testid="theme">{JSON.stringify(theme)}</div>
}

describe('ThemeProvider / useTheme', () => {
  it('provides theme to children', () => {
    const theme = { color: 'red', size: 16 }
    render(
      <ThemeProvider theme={theme}>
        <ThemeDisplay />
      </ThemeProvider>,
    )

    const el = screen.getByTestId('theme')
    expect(JSON.parse(el.textContent!)).toEqual(theme)
  })

  it('defaults to empty object when no provider', () => {
    render(<ThemeDisplay />)

    const el = screen.getByTestId('theme')
    expect(JSON.parse(el.textContent!)).toEqual({})
  })

  it('supports nested providers', () => {
    const outer = { color: 'red' }
    const inner = { color: 'blue' }

    render(
      <ThemeProvider theme={outer}>
        <ThemeProvider theme={inner}>
          <ThemeDisplay />
        </ThemeProvider>
      </ThemeProvider>,
    )

    const el = screen.getByTestId('theme')
    expect(JSON.parse(el.textContent!)).toEqual(inner)
  })
})
