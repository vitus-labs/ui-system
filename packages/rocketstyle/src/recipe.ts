/**
 * `recipe()` — CVA-shaped front door over rocketstyle.
 *
 * Most consumers reach for "variants + compoundVariants + defaults" first;
 * the rocketstyle chain (.theme/.styles/.attrs/.compose + per-dimension
 * chain methods) is more powerful but feels foreign to anyone arriving
 * from `class-variance-authority`, `tailwind-variants`, `vanilla-extract`,
 * or Stitches recipes. `recipe()` desugars the familiar shape into the
 * existing rocketstyle engine so power users can still drop down to the
 * chain when they need theme modes, multi-dimensions, or transforms.
 *
 * **Soft peer:** recipe imports `makeItResponsive` from
 * `@vitus-labs/unistyle` to serialize variant themes into CSS. rocketstyle
 * does NOT declare unistyle as a peerDependency — the import is
 * externalized at bundle time so consumers using the chain API directly
 * never pay the cost. Consumers using `recipe()` must install
 * `@vitus-labs/unistyle` alongside `@vitus-labs/rocketstyle`.
 *
 * Example:
 *   const Button = recipe({
 *     name: 'Button',
 *     component: Element,
 *     base: { padding: 8, borderRadius: 6 },
 *     variants: {
 *       size:   { sm: { fontSize: 12 }, md: { fontSize: 14 }, lg: { fontSize: 16 } },
 *       intent: { primary: { backgroundColor: 'blue' }, danger: { backgroundColor: 'red' } },
 *     },
 *     compoundVariants: [
 *       { variants: { intent: 'primary', size: 'lg' }, styles: { textTransform: 'uppercase' } },
 *     ],
 *     defaultVariants: { size: 'md', intent: 'primary' },
 *   })
 *   // <Button size="lg" intent="primary" />   // gets all three
 */
import { makeItResponsive, styles } from '@vitus-labs/unistyle'
import rocketstyle from '~/init'

type ThemeObject = Record<string, any>
type VariantsMap = Record<string, Record<string, ThemeObject>>

type ActiveVariants<V extends VariantsMap> = {
  [K in keyof V]?: keyof V[K] & string
}

export type CompoundVariant<V extends VariantsMap> = {
  variants: ActiveVariants<V>
  styles: ThemeObject
}

export type RecipeConfig<V extends VariantsMap> = {
  /** Display name (passed through to the rocketstyle factory). */
  name: string
  /** Underlying component to wrap (e.g. `Element` from `@vitus-labs/elements`). */
  component: any
  /** Styles applied in all cases. */
  base?: ThemeObject
  /** Variant axes → per-value style maps. Each axis becomes a prop on the rendered component. */
  variants?: V
  /** Extra styles applied when ALL listed variants match. */
  compoundVariants?: CompoundVariant<V>[]
  /** Default value per variant axis when the consumer doesn't pass one. */
  defaultVariants?: ActiveVariants<V>
}

// Tiny camelCase → kebab-case + number→rem converter for compoundVariant
// styles. Mirrors the simplest subset of unistyle's behaviour without
// reaching for the full propertyMap walk (compound styles are usually a
// handful of declarations; the full pipeline is overkill).
const CAMEL_RE = /[A-Z]/g
const objectToCss = (obj: ThemeObject): string => {
  let out = ''
  for (const k in obj) {
    const v = obj[k]
    if (v == null || v === false) continue
    const prop = k.replace(CAMEL_RE, (c) => `-${c.toLowerCase()}`)
    const val = typeof v === 'number' && v !== 0 ? `${v / 16}rem` : String(v)
    out += `${prop}: ${val};`
  }
  return out
}

// Pick + merge every compoundVariant whose listed axes all match the
// resolved rocketstate, returning a single style object (or null when no
// compound matched). Extracted so the styles-callback closure stays small.
const matchCompoundStyles = <V extends VariantsMap>(
  compounds: CompoundVariant<V>[],
  state: Record<string, unknown>,
): ThemeObject | null => {
  let merged: ThemeObject | null = null
  for (const cv of compounds) {
    let matches = true
    for (const k in cv.variants) {
      if (state[k] !== cv.variants[k]) {
        matches = false
        break
      }
    }
    if (matches) {
      merged = merged ? { ...merged, ...cv.styles } : { ...cv.styles }
    }
  }
  return merged
}

/**
 * Build a styled component from a CVA-shaped config. Returns the same
 * chainable component rocketstyle returns — callers can keep chaining
 * (`.attrs()`, `.compose()`, `.config()`, …) for advanced cases.
 */
export const recipe = <V extends VariantsMap>(config: RecipeConfig<V>): any => {
  const {
    component,
    name,
    base = {},
    variants = {} as V,
    compoundVariants = [],
    defaultVariants = {} as ActiveVariants<V>,
  } = config

  // Each variant axis becomes a dimension on the rocketstyle component.
  // `{ size: 'size', intent: 'intent' }` declares two single-select
  // dimensions; their per-value themes are wired via the dynamic
  // per-dimension chain methods below.
  const variantKeys = Object.keys(variants)
  const hasVariants = variantKeys.length > 0

  // rocketstyle's validateInit rejects an empty dimensions object — when
  // the recipe has no variants we let rocketstyle fall back to its
  // default dimensions (states/sizes/variants/multiple/modifiers), which
  // are inert when the consumer never passes them.
  let comp: any = hasVariants
    ? rocketstyle({
        dimensions: Object.fromEntries(variantKeys.map((k) => [k, k])) as any,
        useBooleans: true,
      })({ component, name })
    : rocketstyle()({ component, name })

  // Base theme — only set when non-empty (rocketstyle's .theme() bails on
  // empty objects but skipping is cleaner).
  if (Object.keys(base).length > 0) {
    comp = comp.theme(base)
  }

  // Per-axis variant themes. rocketstyle attaches a chain method per
  // dimension name at component-creation time, so `.size({sm:{...}, …})`
  // exists when `dimensions: { size: 'size' }` was declared.
  for (const vKey of Object.keys(variants)) {
    const valuesMap = variants[vKey]
    if (valuesMap && Object.keys(valuesMap).length > 0) {
      comp = comp[vKey](valuesMap)
    }
  }

  // Default variants flow through .attrs() so the consumer's explicit prop
  // still wins (rocketstyle merges priorityAttrs → attrs → props).
  const defaultKeys = Object.keys(defaultVariants) as Array<keyof V & string>
  if (defaultKeys.length > 0) {
    comp = comp.attrs((p: Record<string, unknown>) => {
      const out: Record<string, unknown> = {}
      for (const k of defaultKeys) {
        if (p[k] === undefined) out[k] = defaultVariants[k]
      }
      return out
    })
  }

  // CompoundVariants apply only when every listed axis matches. rocketstyle
  // doesn't have first-class compound support, so we wire a final styles
  // callback that reads $rocketstate at render and emits the matching CSS.
  // Skipped entirely when no compounds were declared so the styles chain
  // stays untouched (and consumers can add their own .styles() afterwards).
  // Always wire a single .styles() callback that renders the resolved
  // rocketstyle theme through unistyle (mirrors the pattern used at the
  // engine level in e2e-styler tests) and, when applicable, appends raw
  // CSS for any matched compoundVariants. Without this, rocketstyle's
  // .theme()/.{axis}() values are held as data but never serialized.
  comp = comp.styles(
    (css: (s: TemplateStringsArray, ...v: unknown[]) => unknown) => css`
      ${({
        $rocketstyle,
        $rocketstate,
      }: {
        $rocketstyle?: Record<string, unknown>
        $rocketstate?: Record<string, unknown>
      }) => {
        const base = $rocketstyle
          ? makeItResponsive({ theme: $rocketstyle, styles, css: css as any })
          : ''
        const compound =
          compoundVariants.length > 0 && $rocketstate
            ? (() => {
                const merged = matchCompoundStyles(
                  compoundVariants,
                  $rocketstate,
                )
                return merged ? objectToCss(merged) : ''
              })()
            : ''
        return css`
          ${base};
          ${compound};
        `
      }}
    `,
  )

  return comp
}

export default recipe
