import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import propertyMap from '../styles/styles/propertyMap'

/**
 * Catches the "typed-but-not-mapped" drift class (`borderCollapse` was the
 * canary in PR #270 — declared in `ITheme` with no `propertyMap` descriptor,
 * so it type-checked yet emitted no CSS). Every key declared in `ITheme`
 * must either be a `key:` / `keys.*:` / `id:` reference in the property
 * map, OR be explicitly listed in `INTERNAL_KEYS` below as a key consumed
 * by a `special` handler (the only currently-exempt case is `keyframe`,
 * read by `processSpecial`'s `animation` branch).
 */
const INTERNAL_KEYS = new Set<string>([
  // consumed by `special: animation` in processDescriptor — not a top-level
  // CSS declaration on its own.
  'keyframe',
])

const collectMapKeys = (): Set<string> => {
  const out = new Set<string>()
  for (const d of propertyMap) {
    // Each descriptor either declares a single `key`, a `keys` record
    // (edge / border_radius / convert_fallback), or `id` for specials.
    if ('key' in d) out.add(d.key)
    if ('id' in d) out.add(d.id)
    if ('keys' in d) {
      const keys = d.keys as unknown
      if (Array.isArray(keys)) for (const k of keys) out.add(k)
      else if (keys && typeof keys === 'object')
        for (const k of Object.values(keys as Record<string, string>)) {
          if (typeof k === 'string') out.add(k)
        }
    }
  }
  return out
}

const extractIThemeKeys = (): string[] => {
  // ITheme is parsed from source so the test catches drift on any future
  // schema additions without needing the test to be rewritten.
  const types = readFileSync(
    join(__dirname, '..', 'styles', 'styles', 'types.ts'),
    'utf8',
  )
  const start = types.indexOf('export type ITheme = {')
  if (start < 0) throw new Error('ITheme declaration not found in types.ts')

  // Find the matching closing brace.
  let depth = 0
  let i = types.indexOf('{', start)
  const open = i
  for (; i < types.length; i++) {
    const ch = types[i]
    if (ch === '{') depth++
    else if (ch === '}') {
      depth--
      if (depth === 0) break
    }
  }
  const body = types.slice(open + 1, i)

  // ITheme keys are top-level lines `<ident>: <type>` (the type body can
  // span multiple lines via template literals, conditionals, etc.). The
  // identifiers we want appear at indent depth 1 (two spaces).
  const lines = body.split('\n')
  const keys: string[] = []
  for (const raw of lines) {
    const m = /^ {2}([a-zA-Z][a-zA-Z0-9]*)\??:/.exec(raw)
    if (m?.[1]) keys.push(m[1])
  }
  return keys
}

describe('ITheme ↔ propertyMap parity', () => {
  it('every ITheme key is either in propertyMap or explicitly internal', () => {
    const themeKeys = extractIThemeKeys()
    const mapKeys = collectMapKeys()

    const orphaned = themeKeys.filter(
      (k) => !mapKeys.has(k) && !INTERNAL_KEYS.has(k),
    )

    // If this fails, you typed a new prop in ITheme without adding a
    // propertyMap descriptor (or you added one whose `key:` doesn't match
    // the type's spelling). Either add a descriptor in propertyMap.ts or,
    // for a special-handler-only key, list it in INTERNAL_KEYS above.
    expect(orphaned).toEqual([])
  })

  it('sanity: ITheme has been parsed (no false-empty bypass)', () => {
    const themeKeys = extractIThemeKeys()
    expect(themeKeys.length).toBeGreaterThan(100)
  })
})
