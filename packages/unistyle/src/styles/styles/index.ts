import { borderRadius, edge } from '~/styles/shorthands'
import type { Css } from '~/types'
import { values } from '~/units'
import processDescriptor from './processDescriptor'
import propertyMap, { type PropertyDescriptor } from './propertyMap'
import type { InnerTheme, Theme } from './types'

export type { Theme as StylesTheme }

// Theme keys a descriptor reads — it can only emit CSS if one is present.
// (`keys` is an array or a role → key object; `animation` also reads
// `keyframe`.)
const descriptorKeys = (d: PropertyDescriptor): string[] =>
  'key' in d
    ? [d.key]
    : 'keys' in d
      ? (Object.values(d.keys) as string[])
      : d.id === 'animation'
        ? ['animation', 'keyframe']
        : [d.id]

// theme key → indices (into propertyMap) of the descriptors reading it.
// Built lazily on first style resolution. Its key set is also every key the
// property map recognises, used by the dev-only theme-typo warning so a
// misspelled key like `paddng` doesn't silently render nothing.
let keyIndex: Map<string, number[]> | null = null
const getKeyIndex = (): Map<string, number[]> => {
  if (keyIndex) return keyIndex
  keyIndex = new Map()
  propertyMap.forEach((d, i) => {
    for (const k of descriptorKeys(d)) {
      // biome-ignore lint/style/noNonNullAssertion: assigned above
      const ids = keyIndex!.get(k)
      if (ids) ids.push(i)
      // biome-ignore lint/style/noNonNullAssertion: assigned above
      else keyIndex!.set(k, [i])
    }
  })
  return keyIndex
}

const byNumber = (a: number, b: number) => a - b

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
 * Data-driven style processor. Delegates the `propertyMap` descriptors
 * to `processDescriptor`, which maps theme values to CSS strings. The
 * result is a single `css` tagged-template literal containing all
 * non-null property outputs.
 *
 * In development, warns once per unknown theme key — the typo class of
 * silent failure (e.g. `paddng: 8`) that used to render empty CSS.
 */
const styles: Styles = ({ theme: t, css, rootSize }) => {
  const index = getKeyIndex()

  // Only descriptors reading a key present in the theme can produce output:
  // look those up instead of walking all ~257 descriptors, then sort (and
  // drop duplicates — `padding` + `paddingX` hit the same descriptor) to
  // keep propertyMap order.
  const matched: number[] = []
  for (const k in t) {
    const ids = index.get(k)
    if (ids) for (const id of ids) matched.push(id)
    else if (process.env.NODE_ENV !== 'production' && !warnedKeys.has(k)) {
      warnedKeys.add(k)
      // biome-ignore lint/suspicious/noConsole: dev-only typo diagnostic
      console.warn(
        `[@vitus-labs/unistyle] unknown theme key "${k}" — no propertyMap descriptor exists. Possible typo? It will be silently ignored.`,
      )
    }
  }
  matched.sort(byNumber)

  const calc = (...params: any[]) => values(params, rootSize)
  const shorthand = edge(rootSize)
  const borderRadiusFn = borderRadius(rootSize)

  const fragments: ReturnType<typeof processDescriptor>[] = []
  for (let i = 0; i < matched.length; i++) {
    const id = matched[i] as number
    if (id === matched[i - 1]) continue
    fragments.push(
      processDescriptor(
        propertyMap[id] as PropertyDescriptor,
        t,
        css,
        calc,
        shorthand,
        borderRadiusFn,
      ),
    )
  }

  return css`
    ${fragments}
  `
}

export default styles
