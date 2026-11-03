/**
 * Sheet cache correctness + perf regressions (2026-11 audit): eviction
 * never re-inserts live rules, getClassName → insert share the miss hash,
 * and static snippets behind function interpolations get memoized.
 */
import { describe, expect, it } from 'vitest'
import { css } from '../css'
import { resolve } from '../resolve'
import { createSheet } from '../sheet'

describe('sheet eviction never re-inserts live rules', () => {
  it('keeps one copy per rule and the original cascade order', () => {
    document.head.innerHTML = ''
    const s = createSheet({ maxCacheSize: 20 })
    for (let i = 0; i < 40; i++) s.insert(`width: ${i}px;`)
    s.insert('width: 0px;') // evicted from insertCache only
    s.insert('width: 1px;')
    const el = document.querySelector('style[data-vl]') as HTMLStyleElement
    const texts = Array.from(el.sheet!.cssRules).map((r) => r.cssText)
    expect(texts.length).toBe(40)
    expect(texts.filter((t) => t.includes('width: 0px')).length).toBe(1)
    expect(texts[0]).toContain('width: 0px')
    el.remove()
  })
})

describe('getClassName → insert share the miss hash', () => {
  it('returns the same class from both, and dedupes', () => {
    const s = createSheet()
    const c1 = s.getClassName('margin: 7px;')
    const c2 = s.insert('margin: 7px;')
    expect(c2).toBe(c1)
    // A different key in between must not reuse the stale slot.
    const c3 = s.getClassName('margin: 8px;')
    const c4 = s.insert('margin: 9px;')
    expect(c4).not.toBe(c3)
    expect(s.insert('margin: 8px;')).toBe(c3)
  })
})

describe('static CSSResult reached via a function interpolation', () => {
  it('is classified lazily and memoized from the second encounter', () => {
    const active = css`color: red; background: blue;`
    const tpl = css`${(p: any) => p.on && active}`
    expect(active._isDynamic).toBe(undefined)
    expect(resolve(tpl.strings, tpl.values, { on: true })).toBe(
      'color: red; background: blue;',
    )
    expect(active._isDynamic).toBe(null)
    resolve(tpl.strings, tpl.values, { on: true })
    expect(active._isDynamic).toBe(false)
    expect(active._staticResolved).toBe('color: red; background: blue;')
    expect(resolve(tpl.strings, tpl.values, { on: true })).toBe(
      'color: red; background: blue;',
    )
  })

  it('never memoizes a dynamic one', () => {
    const active = css`color: ${(p: any) => p.c};`
    const tpl = css`${() => active}`
    resolve(tpl.strings, tpl.values, { c: 'red' })
    resolve(tpl.strings, tpl.values, { c: 'red' })
    expect(active._isDynamic).toBe(true)
    expect(resolve(tpl.strings, tpl.values, { c: 'teal' })).toBe('color: teal;')
  })
})
