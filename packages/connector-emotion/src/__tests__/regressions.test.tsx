import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  createGlobalStyle,
  css,
  keyframes,
  provider as Provider,
  styled,
} from '../index'

const allCss = () =>
  Array.from(document.querySelectorAll('style'))
    .map((s) => s.textContent)
    .join('')

describe('connector-emotion regressions', () => {
  it('keyframes interpolate as animation names in static css', () => {
    const kf = keyframes`from { opacity: 0 } to { opacity: 1 }`
    const Box = styled('div')<{ d?: number }>`
      ${css`animation: ${kf} 1s;`}
    `
    render(<Box />)
    const text = allCss()
    expect(text).not.toContain('_EMO_')
    expect(text).toMatch(/animation:animation-\w+ 1s;/)
    expect(text).toContain('@keyframes animation-')
  })

  it('keyframes interpolate correctly in dynamic css', () => {
    const kf = keyframes`from { opacity: 0 } to { opacity: 1 }`
    const Box = styled('div')<{ d?: number }>`
      ${css`animation: ${kf} ${(p: any) => p.d}s;`}
    `
    render(<Box d={2} />)
    const text = allCss()
    expect(text).not.toContain('_EMO_')
    expect(text).toMatch(/animation:animation-\w+ 2s;/)
  })

  it('createGlobalStyle resolves theme from ThemeProvider', () => {
    const G = createGlobalStyle`
      .gtheme { color: ${({ theme }: any) => theme.c}; }
    `
    expect(() =>
      render(
        <Provider theme={{ c: 'tomato' }}>
          <G />
        </Provider>,
      ),
    ).not.toThrow()
    expect(allCss()).toContain('.gtheme{color:tomato;}')
  })
})
