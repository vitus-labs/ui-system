import { describe, expect, it } from 'vitest'
import { hash, HASH_INIT, hashFinalize, hashUpdate } from '../hash'

describe('hash', () => {
  it('returns a string', () => {
    expect(typeof hash('test')).toBe('string')
  })

  it('is deterministic — same input always produces same output', () => {
    const input = 'display: flex; color: red;'
    expect(hash(input)).toBe(hash(input))
  })

  it('produces different hashes for different inputs', () => {
    expect(hash('color: red')).not.toBe(hash('color: blue'))
  })

  it('returns base-36 string (compact)', () => {
    const result = hash('some css')
    expect(result).toMatch(/^[0-9a-z]+$/)
  })

  it('handles empty string', () => {
    const result = hash('')
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('handles long CSS strings', () => {
    const longCSS = 'display: flex; '.repeat(100)
    const result = hash(longCSS)
    expect(typeof result).toBe('string')
    expect(result.length).toBeLessThan(10) // base-36 uint32 is at most 7 chars
  })

  it('handles special characters in CSS', () => {
    const css = `@media (min-width: 48em) { .foo { content: "hello"; } }`
    const result = hash(css)
    expect(typeof result).toBe('string')
  })

  describe('streaming hash (hashUpdate / hashFinalize)', () => {
    it('single segment equals hash()', () => {
      const str = 'color: red;'
      expect(hashFinalize(hashUpdate(HASH_INIT, str))).toBe(hash(str))
    })

    it('two segments equal hash(concatenated)', () => {
      const a = 'hello '
      const b = 'world'
      const h = hashUpdate(hashUpdate(HASH_INIT, a), b)
      expect(hashFinalize(h)).toBe(hash(a + b))
    })

    it('three segments equal hash(concatenated)', () => {
      const a = 'color: '
      const b = 'red'
      const c = '; font-size: 14px;'
      const h = hashUpdate(hashUpdate(hashUpdate(HASH_INIT, a), b), c)
      expect(hashFinalize(h)).toBe(hash(a + b + c))
    })

    it('empty segments do not affect hash', () => {
      const str = 'test'
      const h = hashUpdate(hashUpdate(hashUpdate(HASH_INIT, ''), str), '')
      expect(hashFinalize(h)).toBe(hash(str))
    })

    it('many small segments equal hash(full string)', () => {
      const parts = ['display:', ' flex;', ' color:', ' red;', ' padding:', ' 8px;']
      let h = HASH_INIT
      for (const part of parts) {
        h = hashUpdate(h, part)
      }
      expect(hashFinalize(h)).toBe(hash(parts.join('')))
    })
  })
})
