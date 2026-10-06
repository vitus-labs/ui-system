/**
 * Mobile-first cascade optimizer.
 *
 * Given an ordered array of CSS strings (one per breakpoint, smallest first),
 * returns a parallel array where each non-base breakpoint contains only the
 * declarations that DIFFER from the cumulative cascade so far. This relies on
 * mobile-first `@media (min-width: …)` semantics: properties set at smaller
 * breakpoints inherit at larger ones, so re-emitting an unchanged property is
 * pure byte waste.
 *
 * Example:
 *   ["color: red; padding: 0;", "color: red; padding: 1rem;"]
 *   → ["color: red; padding: 0;", "padding: 1rem;"]
 *
 * Top-level declarations are diffed by `prop:value`. Selector blocks
 * (`&:hover { … }`, `@supports { … }`) are treated as opaque and deduped by
 * exact text. Anything inside parens or quoted strings is skipped over so
 * `linear-gradient(red 0%, blue 100%)` and `content: ";"` parse correctly.
 *
 * Shorthand/longhand interaction: emitting `padding` invalidates the cascade
 * entries of `padding-*`, and emitting `padding-top` invalidates `padding`,
 * so `padding:1rem` -> `padding-top:0` -> `padding:1rem` re-emits the third.
 *
 * Nested blocks are tracked per selector by the last emitted text, so
 * A -> B -> A on the same selector re-emits A at the third breakpoint.
 * Blocks are compared by exact textual match (whitespace-different
 * equivalents are both emitted).
 */

interface DeclEntry {
  kind: 'decl'
  prop: string
  value: string
  raw: string // canonical "prop: value;" form
}

interface BlockEntry {
  kind: 'block'
  raw: string // entire "selector { body }" or stray block
}

type Entry = DeclEntry | BlockEntry

/** Parse a CSS string into top-level declarations and opaque blocks. */
// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: single-pass CSS parser — depth/paren/quote tracking inlined for perf
const parse = (css: string): Entry[] => {
  const entries: Entry[] = []
  const len = css.length

  let depth = 0
  let parenDepth = 0
  let quote = 0 // charCode of active quote (0 if none)
  let segmentStart = 0

  const pushSegment = (rawSegment: string) => {
    const trimmed = rawSegment.trim()
    if (!trimmed) return
    // pushSegment is only reached for segments that ended with a top-level
    // ";" — full "selector { ... }" blocks are captured separately by the
    // brace walker, so this path always sees declarations (or malformed
    // declaration-shaped fragments).
    const text = trimmed.endsWith(';') ? trimmed.slice(0, -1) : trimmed
    const colonIdx = text.indexOf(':')
    if (colonIdx <= 0) {
      // No ":" or starts with ":" → not a parseable declaration; keep raw
      entries.push({ kind: 'block', raw: `${text};` })
      return
    }
    const prop = text.slice(0, colonIdx).trim()
    const value = text.slice(colonIdx + 1).trim()
    if (!prop || !value) {
      entries.push({ kind: 'block', raw: `${text};` })
      return
    }
    entries.push({
      kind: 'decl',
      prop,
      value,
      raw: `${prop}: ${value};`,
    })
  }

  for (let i = 0; i < len; i++) {
    const code = css.charCodeAt(i)

    // Inside a quoted string — skip until matching quote (ignoring escapes)
    if (quote !== 0) {
      if (code === 92 /* \ */) {
        i++ // skip the next character
      } else if (code === quote) {
        quote = 0
      }
      continue
    }

    // Quote start
    if (code === 34 /* " */ || code === 39 /* ' */) {
      quote = code
      continue
    }

    // Parens — content (e.g. linear-gradient args) shouldn't be interpreted
    if (code === 40 /* ( */) {
      parenDepth++
      continue
    }
    if (code === 41 /* ) */) {
      if (parenDepth > 0) parenDepth--
      continue
    }
    if (parenDepth > 0) continue

    if (code === 123 /* { */) {
      depth++
      continue
    }
    if (code === 125 /* } */) {
      depth--
      if (depth === 0) {
        // End of a top-level block — capture from segmentStart..i (inclusive)
        const raw = css.slice(segmentStart, i + 1).trim()
        if (raw) entries.push({ kind: 'block', raw })
        segmentStart = i + 1
      }
      continue
    }

    if (depth === 0 && code === 59 /* ; */) {
      pushSegment(css.slice(segmentStart, i))
      segmentStart = i + 1
    }
  }

  // Trailing segment (no terminating semicolon)
  if (segmentStart < len) {
    const trailing = css.slice(segmentStart).trim()
    if (trailing) {
      if (depth > 0) {
        // Unbalanced braces — keep the rest as opaque so output isn't lossy
        entries.push({ kind: 'block', raw: trailing })
      } else {
        pushSegment(trailing)
      }
    }
  }

  return entries
}

/** Selector / at-rule prelude of a block ("&:hover", "@supports (…)"). */
const blockKey = (raw: string): string => {
  const i = raw.indexOf('{')
  return i === -1 ? raw : raw.slice(0, i).trim()
}

// Shorthands whose longhands are NOT `${shorthand}-*` (the prefix case —
// `padding` ↔ `padding-top`, `border` ↔ `border-top-width` — is handled by
// `isRelated` directly). Sibling longhands (`top` vs `bottom`) stay
// independent so the delta output doesn't grow.
const LONGHANDS: Record<string, RegExp> = {
  'border-radius': /^border-.+-radius$/,
  'border-width': /^border-.+-width$/,
  'border-color': /^border-.+-color$/,
  'border-style': /^border-.+-style$/,
  'border-block': /^border-(top|bottom)(-|$)/,
  'border-inline': /^border-(left|right)(-|$)/,
  inset: /^(top|right|bottom|left)$/,
  'inset-block': /^(top|bottom)$/,
  'inset-inline': /^(left|right)$/,
  'margin-block': /^margin-(top|bottom)$/,
  'margin-inline': /^margin-(left|right)$/,
  'padding-block': /^padding-(top|bottom)$/,
  'padding-inline': /^padding-(left|right)$/,
  'place-items': /^(align|justify)-items$/,
  'place-content': /^(align|justify)-content$/,
  'place-self': /^(align|justify)-self$/,
  gap: /^(grid-)?(row|column)-gap$/,
  'grid-gap': /^(grid-)?(row|column)-gap$/,
  'grid-area': /^grid-(row|column)-(start|end)$/,
  font: /^line-height$/,
  columns: /^column-(count|width)$/,
  'flex-flow': /^flex-(direction|wrap)$/,
}

const isRelated = (a: string, b: string): boolean =>
  b.startsWith(`${a}-`) ||
  a.startsWith(`${b}-`) ||
  (LONGHANDS[a]?.test(b) ?? false) ||
  (LONGHANDS[b]?.test(a) ?? false)

/**
 * Called when `prop` is emitted: drop cascade entries whose effective value
 * is no longer known. A shorthand (`padding`, `inset`) resets its longhands
 * (`padding-top`, `top`), and a longhand makes the shorthand's recorded value
 * stale. Over-invalidating is safe (it only re-emits); under-invalidating
 * drops declarations that are still needed.
 */
const invalidateRelated = (cascade: Map<string, string>, prop: string) => {
  if (prop.charCodeAt(0) === 45 && prop.charCodeAt(1) === 45) return // --custom
  for (const key of cascade.keys()) {
    if (key !== prop && isRelated(prop, key)) cascade.delete(key)
  }
}

/**
 * Apply the mobile-first cascade diff. The first entry passes through
 * unchanged; subsequent entries are pruned to the delta vs. the running
 * cascade (declarations by prop, blocks by selector + last emitted text).
 */
// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: hot-path cascade walker — declaration/block branches + cascade map updates inlined for perf
export const optimizeBreakpointDeltas = (cssStrings: string[]): string[] => {
  if (cssStrings.length <= 1) return cssStrings

  const cascadeDecl = new Map<string, string>()
  const cascadeBlocks = new Map<string, string>()
  const out: string[] = new Array(cssStrings.length)

  for (let i = 0; i < cssStrings.length; i++) {
    // biome-ignore lint/style/noNonNullAssertion: bounds checked by loop condition
    const css = cssStrings[i]!
    if (!css) {
      out[i] = ''
      continue
    }

    const entries = parse(css)
    const kept: string[] = []

    for (const e of entries) {
      if (e.kind === 'decl') {
        if (cascadeDecl.get(e.prop) !== e.value) {
          kept.push(e.raw)
          invalidateRelated(cascadeDecl, e.prop)
          cascadeDecl.set(e.prop, e.value)
        }
      } else {
        const key = blockKey(e.raw)
        if (cascadeBlocks.get(key) !== e.raw) {
          kept.push(e.raw)
          cascadeBlocks.set(key, e.raw)
        }
      }
    }

    out[i] = kept.join(' ')
  }

  return out
}

export default optimizeBreakpointDeltas
