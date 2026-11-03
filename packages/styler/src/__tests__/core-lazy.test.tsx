/**
 * Components and css created through `@vitus-labs/core`'s config BEFORE
 * `init()` (the default with ESM import hoisting) must behave like ones
 * created after it: usable as `${Comp}` selectors, extendable, and keeping
 * static templates static.
 */
import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as styler from '../index'
import { sheet } from '../sheet'

const allRules = () =>
  Array.from(document.querySelectorAll('style'))
    .flatMap((s) => Array.from(s.sheet?.cssRules ?? []))
    .map((r) => r.cssText)
    .join('|')

describe('core lazy (pre-init) styled / css', () => {
  let core: typeof import('@vitus-labs/core')

  beforeEach(async () => {
    vi.resetModules()
    // Fresh, un-initialised config singleton.
    core = await import('@vitus-labs/core')
    sheet.clearAll()
  })

  const initStyler = () =>
    core.init({ ...styler, provider: styler.ThemeProvider } as any)

  it('pre-init styled can be used as a component selector', () => {
    const { styled } = core.config
    const Btn = styled('button')`color: red;`
    initStyler()
    const Card = styler.styled('div')`${Btn}:hover & { color: blue; }`
    render(<Card />)
    expect(allRules()).not.toContain('[object Object]')
    expect(allRules()).toContain(`${(Btn as any)._sel}:hover`)
  })

  it('pre-init css thunk keeps a static template static', () => {
    const shared = core.config.css`padding: 4px;`
    initStyler()
    const Box = styler.styled('div')`${shared}`
    expect((Box as any)._sel).not.toBe('')
    const { container } = render(<Box id="b" />)
    expect(getComputedStyle(container.querySelector('#b')!).padding).toBe('4px')
  })

  it('pre-init component renders and can be extended after init', () => {
    const Base = core.config.styled('div')`color: red;`
    initStyler()
    const Ext = styler.styled(Base)`color: blue;`
    const { container } = render(
      <>
        <Base id="a" />
        <Ext id="b" />
      </>,
    )
    expect(getComputedStyle(container.querySelector('#a')!).color).toBe(
      'rgb(255, 0, 0)',
    )
    expect(getComputedStyle(container.querySelector('#b')!).color).toBe(
      'rgb(0, 0, 255)',
    )
  })
})
