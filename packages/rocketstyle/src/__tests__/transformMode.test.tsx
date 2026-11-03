/**
 * Mode callbacks (`mode(light, dark)`) returned by transform-dimension
 * callbacks must be resolved for the active mode (2026-11 audit).
 */
import { render } from '@testing-library/react'
import { Element } from '@vitus-labs/elements'
import { makeItResponsive, styles } from '@vitus-labs/unistyle'
import { Provider } from '~/index'
import rocketstyle from '~/init'

const Leaf = (p: any) => <div {...p} />

const allCss = () =>
  Array.from(document.styleSheets)
    .flatMap((s: any) => Array.from(s.cssRules).map((r: any) => r.cssText))
    .join('\n')

describe('transform dimension mode callbacks', () => {
  const make = (onStyle: (rs: any) => void) =>
    rocketstyle()({ name: 'T', component: Leaf })
      .theme((_t: any, m: any) => ({ color: m('#111', '#eee'), bg: '#fff' }))
      .modifiers((_t: any) => ({
        outlined: (_theme: any, _app: any, mode: any) => ({
          bg: 'transparent',
          borderColor: mode('#000', '#fff'),
        }),
      }))
      .styles(
        (css: any) => css`
          ${({ $rocketstyle }: any) => {
            onStyle($rocketstyle)
            return ''
          }};
        `,
      )

  it.each([
    ['light', '#111', '#000'],
    ['dark', '#eee', '#fff'],
  ] as const)(
    '%s: mode callbacks returned by a transform are resolved',
    (mode, color, border) => {
      let seen: any
      const Comp = make((rs) => {
        seen = rs
      })
      render(
        <Provider theme={{ rootSize: 16 }} mode={mode}>
          <Comp modifier="outlined" />
        </Provider>,
      )
      expect(seen.color).toBe(color)
      expect(seen.bg).toBe('transparent')
      expect(seen.borderColor).toBe(border)
    },
  )

  it('emits the resolved colour into CSS (no serialized function)', () => {
    const Comp = rocketstyle()({ name: 'T2', component: Element })
      .theme({ backgroundColor: '#fff' })
      .modifiers((_t: any) => ({
        outlined: (_th: any, _app: any, mode: any) => ({
          borderColor: mode('#123456', '#abcdef'),
          borderStyle: 'solid',
          borderWidth: 1,
        }),
      }))
      .styles(
        (css: any) => css`
          ${({ $rocketstyle }: any) =>
            makeItResponsive({ theme: $rocketstyle, styles, css })};
        `,
      )
    render(
      <Provider theme={{ rootSize: 16 }} mode="light">
        <Comp modifier="outlined" />
      </Provider>,
    )
    const c = allCss()
    // jsdom normalizes hex colours to rgb(): #123456 → rgb(18, 52, 86)
    expect(c).toMatch(/border-color: rgb\(18, 52, 86\)/)
    expect(c).not.toMatch(/rgb\(171, 205, 239\)/)
    expect(c).not.toMatch(/=>/)
  })
})
