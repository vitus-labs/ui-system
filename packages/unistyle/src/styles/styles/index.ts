import { borderRadius, edge } from '~/styles/shorthands'
import type { Css } from '~/types'
import { values } from '~/units'
import processDescriptor from './processDescriptor'
import propertyMap from './propertyMap'
import type { InnerTheme, Theme } from './types'

export type { Theme as StylesTheme }

// Module-scope set of every key recognised by the property map (built
// lazily on first style resolution). Used by the dev-only theme-typo
// warning so a misspelled key like `paddng` doesn't silently render
// nothing — the consumer sees a console warning instead.
let knownKeysCache: Set<string> | null = null
// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: linear sweep with type-narrowing branches per descriptor variant — runs once, lazily
const buildKnownKeys = (): Set<string> => {
  const out = new Set<string>()
  for (const d of propertyMap) {
    if ('key' in d) out.add(d.key)
    if ('id' in d) out.add(d.id)
    if ('keys' in d) {
      const keys = d.keys as unknown
      if (keys && typeof keys === 'object')
        for (const k of Object.values(keys as Record<string, string>)) {
          if (typeof k === 'string') out.add(k)
        }
    }
  }
  // `keyframe` is consumed by the `animation` special handler.
  out.add('keyframe')
  return out
}
// Per-(process) warned-keys cache — emit each unknown key at most once
// to avoid spam in dev tools.
const warnedKeys = new Set<string>()

export type Styles = ({
  theme,
  css,
  rootSize,
}: {
  theme: InnerTheme
  css: Css
  rootSize?: number
}) => ReturnType<typeof css>

/**
 * Data-driven style processor. Iterates the `propertyMap` descriptors
 * and delegates each to `processDescriptor`, which maps theme values
 * to CSS strings. The result is a single `css` tagged-template literal
 * containing all non-null property outputs.
 *
 * In development, warns once per unknown theme key — the typo class of
 * silent failure (e.g. `paddng: 8`) that used to render empty CSS.
 */
const styles: Styles = ({ theme: t, css, rootSize }) => {
  if (process.env.NODE_ENV !== 'production' && t) {
    if (!knownKeysCache) knownKeysCache = buildKnownKeys()
    for (const k in t) {
      if (!knownKeysCache.has(k) && !warnedKeys.has(k)) {
        warnedKeys.add(k)
        // biome-ignore lint/suspicious/noConsole: dev-only typo diagnostic
        console.warn(
          `[@vitus-labs/unistyle] unknown theme key "${k}" — no propertyMap descriptor exists. Possible typo? It will be silently ignored.`,
        )
      }
    }
  }

  const calc = (...params: any[]) => values(params, rootSize)
  const shorthand = edge(rootSize)
  const borderRadiusFn = borderRadius(rootSize)

  const fragments = propertyMap.map((d) =>
    processDescriptor(d, t, css, calc, shorthand, borderRadiusFn),
  )

  return css`
    ${fragments}
  `
}

export default styles
