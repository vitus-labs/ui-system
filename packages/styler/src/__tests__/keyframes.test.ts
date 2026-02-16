import { describe, expect, it } from 'vitest'
import { keyframes } from '../keyframes'

describe('keyframes', () => {
  it('returns an object with a name property', () => {
    const fadeIn = keyframes`
      from { opacity: 0; }
      to { opacity: 1; }
    `
    expect(fadeIn.name).toBeDefined()
    expect(typeof fadeIn.name).toBe('string')
    expect(fadeIn.name).toMatch(/^vl-kf-/)
  })

  it('toString returns the animation name', () => {
    const fadeIn = keyframes`
      from { opacity: 0; }
      to { opacity: 1; }
    `
    expect(String(fadeIn)).toBe(fadeIn.name)
    expect(`${fadeIn}`).toBe(fadeIn.name)
  })

  it('is deterministic — same input produces same name', () => {
    const a = keyframes`from { opacity: 0; } to { opacity: 1; }`
    const b = keyframes`from { opacity: 0; } to { opacity: 1; }`
    expect(a.name).toBe(b.name)
  })

  it('different input produces different names', () => {
    const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`
    const slideIn = keyframes`from { transform: translateX(-100%); } to { transform: translateX(0); }`
    expect(fadeIn.name).not.toBe(slideIn.name)
  })

  it('supports interpolation values', () => {
    const from = 0
    const to = 1
    const anim = keyframes`
      from { opacity: ${from}; }
      to { opacity: ${to}; }
    `
    expect(anim.name).toMatch(/^vl-kf-/)
  })

  it('can be used in template literals for animation property', () => {
    const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`
    const animationValue = `${fadeIn} 0.3s ease-in`
    expect(animationValue).toContain(fadeIn.name)
    expect(animationValue).toContain('0.3s ease-in')
  })
})
