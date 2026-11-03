import { config } from '@vitus-labs/core'
import { borderRadius, edge } from '../styles/shorthands'
import styles from '../styles/styles'
import processDescriptor from '../styles/styles/processDescriptor'
import propertyMap, {
  type PropertyDescriptor,
} from '../styles/styles/propertyMap'
import { values } from '../units'

const { css } = config as any

// ─────────────────────────────────────────────────────────────────────
// Perf: styles() key index must produce identical output to a full walk
// ─────────────────────────────────────────────────────────────────────
describe('styles — key-indexed lookup matches the full descriptor walk', () => {
  const keysOf = (d: PropertyDescriptor): string[] => {
    switch (d.kind) {
      case 'simple':
      case 'convert':
        return [d.key as string]
      case 'convert_fallback':
        return d.keys as string[]
      case 'edge':
      case 'border_radius':
        return Object.values(d.keys) as string[]
      case 'special':
        return d.id === 'animation' ? ['animation', 'keyframe'] : [d.id]
    }
  }
  const allKeys = [...new Set(propertyMap.flatMap(keysOf))]

  const reference = (t: any, rootSize: number) => {
    const calc = (...p: any[]) => values(p, rootSize)
    const sh = edge(rootSize)
    const br = borderRadius(rootSize)
    // same template whitespace as styles()
    return css`\n    ${propertyMap.map((d) => processDescriptor(d, t, css, calc, sh, br))}\n  `
  }

  const valueFor = (k: string, i: number): unknown => {
    if (k === 'fullScreen' || k === 'hideEmpty' || k === 'clearFix') return true
    if (k === 'extendCss') return 'outline: 1px solid red;'
    return [8, '1rem', 'auto', 0, 12.5, 'inherit'][i % 6]
  }

  // deterministic PRNG
  let seed = 42
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    return seed / 0x7fffffff
  }

  it('every key at once', () => {
    const t = Object.fromEntries(allKeys.map((k, i) => [k, valueFor(k, i)]))
    expect(String(styles({ theme: t as any, css, rootSize: 16 }))).toBe(
      String(reference(t, 16)),
    )
  })

  it('200 random subsets in random key order', () => {
    for (let n = 0; n < 200; n++) {
      const entries = allKeys
        .filter(() => rand() < 0.15)
        .map((k, i) => [k, valueFor(k, i + n)] as const)
        .sort(() => rand() - 0.5)
      const t = Object.fromEntries(entries)
      expect(String(styles({ theme: t as any, css, rootSize: 10 }))).toBe(
        String(reference(t, 10)),
      )
    }
  })
})
