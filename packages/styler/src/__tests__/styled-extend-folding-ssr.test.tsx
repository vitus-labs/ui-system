// @vitest-environment node
/**
 * SSR side of styled(StyledComp) folding: one style for the folded
 * component, and the base's <style> always precedes the extension's.
 */
import { createElement as h } from 'react'
import { renderToString } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { styled } from '../styled'

const doc = (el: any) =>
  renderToString(h('html', null, h('head'), h('body', null, el)))

describe('SSR: folded styled(StyledComp)', () => {
  it('emits the extension rule after the base rule', () => {
    const Base = styled('div')`color: red;`
    const Ext = styled(Base)`color: blue;`
    const html = doc(h(Ext))
    const extRule = html.indexOf('color: blue')
    expect(extRule).toBeGreaterThan(-1)
    expect(extRule).toBeGreaterThan(html.indexOf('color: red'))
  })

  it('base <style> precedes the extension even if Base renders later', () => {
    const Base = styled('div')`color: red;`
    const Ext = styled(Base)`color: blue;`
    const html = doc(h('main', null, h(Ext), h(Base)))
    const baseHref = (Base as any)._sel.slice(1)
    const extTag = html.indexOf('color: blue')
    const baseTag = html.indexOf(`.${baseHref}{`)
    expect(baseTag).toBeGreaterThan(-1)
    expect(baseTag).toBeLessThan(extTag)
  })

  it('dynamic over dynamic: one style for the folded component', () => {
    const Base = styled('div')`color: ${(p: any) => p.$a ?? 'red'};`
    const Ext = styled(Base)`color: ${() => 'green'};`
    const html = doc(h(Ext))
    expect(html.indexOf('color: green')).toBeGreaterThan(
      html.indexOf('color: red'),
    )
    expect(html.match(/<style/g)?.length).toBe(1)
  })
})
