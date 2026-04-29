/**
 * Tests for cache hydration from React 19 `<style data-precedence>` tags.
 *
 * The bug this guards against: when SSR emits CSS via `<style precedence>`
 * (the default path), the client-side `mount()` previously only scanned
 * `<style[data-vl]>` for hydration. The cache started empty, so the first
 * `useInsertionEffect` cache-missed and re-injected every rule into a fresh
 * `data-vl` sheet — leaving every rule duplicated in the DOM.
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { hash } from '../hash'
import { createSheet } from '../sheet'

const cleanHead = () => {
  document
    .querySelectorAll('style[data-vl], style[data-precedence]')
    .forEach((el) => {
      el.remove()
    })
}

const addPrecedenceTag = (
  href: string,
  cssText: string,
  precedence = 'medium',
) => {
  const el = document.createElement('style')
  el.setAttribute('data-precedence', precedence)
  el.setAttribute('data-href', href)
  el.textContent = cssText
  document.head.appendChild(el)
  return el
}

describe('StyleSheet — hydration from <style data-precedence> tags', () => {
  beforeEach(cleanHead)
  afterEach(cleanHead)

  it('populates cache from a `vl-` prefixed precedence tag', () => {
    addPrecedenceTag('vl-abc123', '.vl-abc123{color:red}')
    const s = createSheet()
    expect(s.has('vl-abc123')).toBe(true)
  })

  it('populates cache from a `g-` prefixed precedence tag (createGlobalStyle)', () => {
    addPrecedenceTag('g-xyz789', 'body{margin:0}', 'low')
    const s = createSheet()
    expect(s.has('g-xyz789')).toBe(true)
  })

  it('ignores precedence tags with unrelated prefixes', () => {
    addPrecedenceTag('other-foo', '.other-foo{color:red}')
    const s = createSheet()
    expect(s.has('other-foo')).toBe(false)
  })

  it('ignores precedence tags missing a data-href', () => {
    const el = document.createElement('style')
    el.setAttribute('data-precedence', 'medium')
    el.textContent = '.vl-noid{color:red}'
    document.head.appendChild(el)
    const s = createSheet()
    expect(s.cacheSize).toBe(0)
  })

  it('hydrates multiple precedence tags in one mount', () => {
    addPrecedenceTag('vl-a', '.vl-a{color:red}')
    addPrecedenceTag('vl-b', '.vl-b{color:blue}')
    addPrecedenceTag('g-c', 'html{font-size:16px}')
    const s = createSheet()
    expect(s.has('vl-a')).toBe(true)
    expect(s.has('vl-b')).toBe(true)
    expect(s.has('g-c')).toBe(true)
  })
})

describe('StyleSheet — insert() after precedence hydration', () => {
  beforeEach(cleanHead)
  afterEach(cleanHead)

  it('insert() of a hydrated rule does NOT inject a duplicate into the data-vl sheet', () => {
    const cssText = 'color:red;'
    const className = `vl-${hash(cssText)}`

    addPrecedenceTag(className, `.${className}{${cssText}}`)
    const s = createSheet()
    expect(s.has(className)).toBe(true)

    const returned = s.insert(cssText)
    expect(returned).toBe(className)

    // Look up the data-vl sheet — must not contain the rule
    const dataVl = document.querySelector(
      'style[data-vl]',
    ) as HTMLStyleElement | null
    const dataVlRules = dataVl?.sheet
      ? Array.from(dataVl.sheet.cssRules).map((r) => r.cssText)
      : []
    expect(dataVlRules.some((r) => r.includes(`.${className}`))).toBe(false)
  })

  it('insertGlobal() of a hydrated rule does NOT inject a duplicate', () => {
    const cssText = 'body{margin:0}'
    const key = `g-${hash(cssText)}`

    addPrecedenceTag(key, cssText, 'low')
    const s = createSheet()
    expect(s.has(key)).toBe(true)

    s.insertGlobal(cssText)

    const dataVl = document.querySelector(
      'style[data-vl]',
    ) as HTMLStyleElement | null
    const dataVlRules = dataVl?.sheet
      ? Array.from(dataVl.sheet.cssRules).map((r) => r.cssText)
      : []
    // The body rule should not have been re-inserted into our data-vl sheet
    expect(
      dataVlRules.some((r) => r.includes('margin') && r.includes('0')),
    ).toBe(false)
  })

  it('insert() of an UN-hydrated rule still injects normally', () => {
    addPrecedenceTag('vl-known', '.vl-known{color:red}')
    const s = createSheet()

    // A different CSS text — not in the cache from precedence hydration
    const cls = s.insert('color:blue;')
    expect(cls).not.toBe('vl-known')

    const dataVl = document.querySelector(
      'style[data-vl]',
    ) as HTMLStyleElement | null
    const dataVlRules = dataVl?.sheet
      ? Array.from(dataVl.sheet.cssRules).map((r) => r.cssText)
      : []
    expect(dataVlRules.some((r) => r.includes(`.${cls}`))).toBe(true)
  })
})
