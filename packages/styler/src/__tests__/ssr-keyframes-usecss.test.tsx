// @vitest-environment node
/**
 * SSR: referenced @keyframes ship inside the component / global
 * <style precedence>, and useCSS doesn't grow the shared server buffer
 * (2026-11 audit). Node environment so IS_SERVER is true everywhere.
 */
import { createElement as h } from 'react'
import { renderToString } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { css } from '../css'
import { createGlobalStyle } from '../globalStyle'
import { keyframes } from '../keyframes'
import { sheet } from '../sheet'
import { styled } from '../styled'
import { useCSS } from '../useCSS'

const doc = (el: any) =>
  renderToString(h('html', null, h('head'), h('body', null, el)))

describe('SSR: keyframes ship with the component that uses them', () => {
  it('static component', () => {
    const fade = keyframes`from{opacity:0}to{opacity:1}`
    const A = styled('div')`animation: ${fade} 1s;`
    const html = doc(h(A))
    expect(html).toContain(`@keyframes ${fade}`)
  })

  it('dynamic component and global style', () => {
    const spin = keyframes`from{transform:rotate(0)}to{transform:rotate(1turn)}`
    const B = styled('div')`animation: ${spin} ${(p: any) => p.d}s;`
    expect(doc(h(B, { d: 2 }))).toContain(`@keyframes ${spin}`)
    const G = createGlobalStyle`body { animation: ${spin} 1s; }`
    expect(doc(h(G))).toContain(`@keyframes ${spin}`)
  })

  it('survives sheet.reset() between requests', () => {
    const pulse = keyframes`from{opacity:.5}to{opacity:1}`
    sheet.reset()
    const C = styled('span')`animation: ${pulse} 1s;`
    expect(doc(h(C))).toContain(`@keyframes ${pulse}`)
  })
})

describe('SSR: useCSS does not leak into the shared buffer', () => {
  it('returns a className and leaves ssrBuffer untouched', () => {
    const before = sheet.getStyles().length
    const t = css`color: ${(p: any) => p.c};`
    const C = () => h('div', { className: useCSS(t, { c: 'teal' }) })
    for (let i = 0; i < 5; i++) {
      expect(doc(h(C))).toMatch(/class="vl-[0-9a-z]+"/)
    }
    expect(sheet.getStyles().length).toBe(before)
  })
})
