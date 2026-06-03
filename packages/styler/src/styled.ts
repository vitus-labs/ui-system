'use client'

/**
 * styled() component factory. Creates React components that inject CSS
 * class names from tagged template literals.
 *
 * Supports:
 * - styled('div')`...` and styled(Component)`...`
 * - styled.div`...` (via Proxy)
 * - `as` prop for polymorphic rendering
 * - React 19 `ref` as regular prop (no forwardRef wrapper)
 * - $-prefixed transient props (not forwarded to DOM)
 * - Custom shouldForwardProp for per-component prop filtering
 * - Static path optimization (templates with no dynamic interpolations)
 * - Hybrid injection: useInsertionEffect on client (1 shared sheet),
 *   React 19 `<style precedence>` on SSR (FOUC-free, zero config)
 *
 * CSS nesting (`&` selectors) works natively — the resolver passes CSS
 * through without transformation, so `&:hover`, `&::before`, etc. work
 * as-is in browsers supporting CSS Nesting (all modern browsers).
 */
import {
  type ComponentType,
  createElement,
  Fragment,
  useInsertionEffect,
  useRef,
} from 'react'
import { buildProps } from './forward'
import { type Interpolation, normalizeCSS, resolve } from './resolve'
import { isDynamic } from './shared'
import { onSheetClear, sheet } from './sheet'
import { EMPTY_THEME, useTheme } from './ThemeProvider'

// SSR vs client detection — computed once at module load time.
// In Node.js (SSR): true. In browser/jsdom: false.
const IS_SERVER = typeof document === 'undefined'

type Tag = string | ComponentType<any>

export interface StyledOptions {
  /** Custom prop filter. Return true to forward the prop to the DOM element. */
  shouldForwardProp?: (prop: string) => boolean
  /**
   * Double the class selector (`.vl-abc.vl-abc`) to raise specificity
   * from (0,1,0) to (0,2,0). Ensures this component's styles override
   * inner library components regardless of CSS source order.
   */
  boost?: boolean
}

const getDisplayName = (tag: Tag): string =>
  typeof tag === 'string'
    ? tag
    : (tag as ComponentType).displayName ||
      (tag as ComponentType).name ||
      'Component'

// Component cache: same template literal + tag + no options → same component.
// WeakMap on `strings` (TemplateStringsArray is object-identity per source location).
//
// Value shape is union: `[tag, component]` tuple for the single-tag case
// (the ~95% common case — `styled.div\`...\`` is paired with exactly one tag),
// promoted to `Map<Tag, Component>` only when a SECOND tag arrives for the
// same strings. Skips the per-template Map allocation in csr-many-style
// workloads that mint distinct templates per tick.
type StaticEntry =
  | readonly [Tag, ComponentType<any>]
  | Map<Tag, ComponentType<any>>
let staticComponentCache = new WeakMap<TemplateStringsArray, StaticEntry>()

// Single-entry hot cache — just 3 reference comparisons, no Map/WeakMap overhead.
// Covers the most common pattern: same styled component created repeatedly.
// Wrapped in an object so `sheet.clearAll()` can reset every field together
// (HMR scenario: stale references to old components must be purged).
const hotCache: {
  strings: TemplateStringsArray | null
  tag: Tag | null
  component: ComponentType<any> | null
} = { strings: null, tag: null, component: null }

// Subscribe to `sheet.clearAll()` so HMR reloads don't leak stale components.
onSheetClear(() => {
  staticComponentCache = new WeakMap()
  hotCache.strings = null
  hotCache.tag = null
  hotCache.component = null
})

const createStyledComponent = (
  tag: Tag,
  strings: TemplateStringsArray,
  values: Interpolation[],
  options?: StyledOptions,
  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: hot-path styled factory — static/dynamic split + hot cache + SSR/client branches inlined for perf
) => {
  // Ultra-fast hot cache: 3 reference comparisons → return immediately
  if (values.length === 0 && !options) {
    if (strings === hotCache.strings && tag === hotCache.tag)
      // biome-ignore lint/style/noNonNullAssertion: invariant — when hotCache.strings/tag match, hotCache.component was assigned in the prior call
      return hotCache.component!

    // WeakMap fallback for alternating patterns. Single-tag entries are
    // stored as `[tag, component]` tuples (skips Map allocation); multi-tag
    // entries are stored as Map<Tag, Component>.
    const entry = staticComponentCache.get(strings)
    if (entry !== undefined) {
      let cached: ComponentType<any> | undefined
      if (entry instanceof Map) {
        cached = entry.get(tag)
      } else if (entry[0] === tag) {
        cached = entry[1]
      }
      if (cached) {
        hotCache.strings = strings
        hotCache.tag = tag
        hotCache.component = cached
        return cached
      }
    }
  }

  // Fast check: no values means no dynamic interpolations — avoids .some() scan
  const hasDynamicValues = values.length > 0 && values.some(isDynamic)
  const customFilter = options ? options.shouldForwardProp : undefined
  const boost = options ? (options.boost ?? false) : false

  // STATIC FAST PATH: no function interpolations → compute class once at creation time
  if (!hasDynamicValues) {
    // Inline resolve for the common no-values case (avoids function call overhead)
    // biome-ignore lint/style/noNonNullAssertion: tagged template guarantee — strings.length >= 1 (length === values.length + 1, and values.length === 0 here)
    const raw = values.length === 0 ? strings[0]! : resolve(strings, values, {})
    const cssText = normalizeCSS(raw)
    const hasCss = cssText.length > 0

    let staticClassName: string
    let cachedStyleEl: ReturnType<typeof createElement> | null = null

    if (!hasCss) {
      staticClassName = ''
    } else if (IS_SERVER) {
      // SSR: emit a single <style precedence> element. We deliberately do NOT
      // call `sheet.insert()` here — that would push duplicate rules into the
      // ssrBuffer and, after the client hydrates from <style data-precedence>
      // tags, the same rule would also get re-inserted via insertRule() on
      // first render (cache miss → DOM duplication). React 19 collects and
      // dedupes <style precedence> emissions automatically.
      const prepared = sheet.prepare(cssText, boost)
      staticClassName = prepared.className
      cachedStyleEl = createElement(
        'style',
        { href: staticClassName, precedence: 'medium' },
        prepared.rules,
      )
    } else {
      // Client: insert() returns className and handles caching — skip prepare() entirely
      staticClassName = sheet.insert(cssText, boost)
    }

    // Tag is known at creation time — hoist the typeof check out of render.
    const tagIsDOM = typeof tag === 'string'

    // Pre-built ReactElement returned when the consumer passes no props
    // (the most common case: `<MyStyled />`). Saves the destructure +
    // buildProps + createElement chain per render. ReactElement values
    // are immutable so sharing across renders is safe — React treats it
    // as a fresh element by identity for reconciliation.
    const baselineMainEl = createElement(tag, {
      className: staticClassName || undefined,
    })
    const baselineFragmentEl = cachedStyleEl
      ? createElement(Fragment, null, cachedStyleEl, baselineMainEl)
      : baselineMainEl

    const StaticStyled = ({ ref, ...rawProps }: Record<string, any>) => {
      // Hot path: no props beyond ref → return the pre-cached element.
      // `for…in` over an empty object has zero iterations; the `break`
      // ensures we exit on the first key seen.
      let hasExtraProps = false
      for (const _k in rawProps) {
        hasExtraProps = true
        break
      }
      if (!hasExtraProps && ref == null) return baselineFragmentEl

      const finalTag = rawProps.as || tag
      const isDOM = finalTag === tag ? tagIsDOM : typeof finalTag === 'string'
      const finalProps = buildProps(
        rawProps,
        staticClassName,
        ref,
        isDOM,
        customFilter,
      )

      const mainEl = createElement(finalTag, finalProps)

      if (!cachedStyleEl) return mainEl
      return createElement(Fragment, null, cachedStyleEl, mainEl)
    }

    StaticStyled.displayName = `styled(${getDisplayName(tag)})`

    // Store in component cache + hot cache for future reuse. Single-tag
    // stays as a tuple; second tag for the same strings promotes to a Map.
    if (!options && values.length === 0) {
      const existing = staticComponentCache.get(strings)
      if (existing === undefined) {
        staticComponentCache.set(strings, [tag, StaticStyled] as const)
      } else if (existing instanceof Map) {
        existing.set(tag, StaticStyled)
      } else {
        const map = new Map<Tag, ComponentType<any>>()
        map.set(existing[0], existing[1])
        map.set(tag, StaticStyled)
        staticComponentCache.set(strings, map)
      }
      hotCache.strings = strings
      hotCache.tag = tag
      hotCache.component = StaticStyled
    }

    return StaticStyled
  }

  // Hoist tagIsDOM out of the render — mirrors the static path. The check is
  // stable per-component, so paying typeof per render was waste.
  const tagIsDOM = typeof tag === 'string'

  // DYNAMIC PATH: resolve CSS on every render with theme/props.
  // Client: useInsertionEffect injects into shared sheet (1 DOM node, scales to any size).
  // SSR: <style precedence> for FOUC-free delivery (useInsertionEffect is a no-op on server).
  // useRef cache avoids recomputing when CSS text hasn't changed between renders.
  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: hot-path render — LRU-2 hit/miss + SSR vs client branches inlined for perf
  const DynamicStyled = ({ ref, ...rawProps }: Record<string, any>) => {
    const theme = useTheme()
    // Inject theme by mutating rawProps (which is freshly destructured by
    // this function and discarded after; no caller can observe the mutation).
    // EMPTY_THEME is the referentially-stable sentinel returned by useTheme
    // when no <ThemeProvider> is mounted — skip the write entirely in that
    // case (bench's csr-mount / csr-many / no-theme SSR scenarios).
    // If the caller passed an explicit `theme` prop, leave it alone — their
    // value wins on both `resolve()` and `buildProps`.
    if (theme !== EMPTY_THEME && rawProps.theme === undefined)
      rawProps.theme = theme
    const cssText = normalizeCSS(resolve(strings, values, rawProps))

    // Two-entry LRU cache. The previous single-slot ref missed every render
    // when a prop alternates between two values (toggle/hover/animation
    // frame, etc.), forcing repeated `getClassName` / `prepare` work even
    // though both class names are already cached upstream. Two slots cover
    // the alternation case without meaningfully growing per-instance state.
    type DynEntry = {
      css: string
      className: string
      styleEl: ReturnType<typeof createElement> | null
    }
    // Lazy init — `useRef(initialValue)` evaluates `initialValue` every render
    // even though React only uses it on first mount. Skip the per-render
    // literal allocation.
    const cacheRef = useRef<{ a: DynEntry | null; b: DynEntry | null } | null>(
      null,
    )
    if (cacheRef.current === null) cacheRef.current = { a: null, b: null }
    const cur = cacheRef.current
    let entry: DynEntry | null = null
    if (cur.a && cur.a.css === cssText) {
      entry = cur.a
    } else if (cur.b && cur.b.css === cssText) {
      // Promote LRU hit to head so the next alternation hits slot `a` too.
      entry = cur.b
      cur.b = cur.a
      cur.a = entry
    }

    let className: string
    let styleEl: ReturnType<typeof createElement> | null

    if (entry) {
      className = entry.className
      styleEl = entry.styleEl
    } else {
      // Cache miss — recompute
      styleEl = null
      if (cssText.length > 0) {
        if (IS_SERVER) {
          // SSR: emit a <style precedence> element only. See the matching
          // comment in the static path above for why we don't push to
          // ssrBuffer here — TL;DR: it would duplicate on hydration.
          const prepared = sheet.prepare(cssText, boost)
          className = prepared.className
          styleEl = createElement(
            'style',
            { href: prepared.className, precedence: 'medium' },
            prepared.rules,
          )
        } else {
          // Client: just compute className (injection via useInsertionEffect below)
          className = sheet.getClassName(cssText)
        }
      } else {
        className = ''
      }
      // Insert as new head; the prior head ages out to the tail slot.
      cur.b = cur.a
      cur.a = { css: cssText, className, styleEl }
    }

    // Client: inject CSS synchronously before paint (no-op on server)
    useInsertionEffect(() => {
      if (cssText.length > 0) sheet.insert(cssText, boost)
    }, [cssText])

    const finalTag = rawProps.as || tag
    const isDOM = finalTag === tag ? tagIsDOM : typeof finalTag === 'string'
    const finalProps = buildProps(rawProps, className, ref, isDOM, customFilter)

    const mainEl = createElement(finalTag, finalProps)

    if (!styleEl) return mainEl
    return createElement(Fragment, null, styleEl, mainEl)
  }

  DynamicStyled.displayName = `styled(${getDisplayName(tag)})`
  return DynamicStyled
}

/** Factory function: styled(tag) returns a tagged template function. */
const styledFactory = (tag: Tag, options?: StyledOptions) => {
  const templateFn = (
    strings: TemplateStringsArray,
    ...values: Interpolation[]
  ) => createStyledComponent(tag, strings, values, options)

  return templateFn
}

/**
 * Main styled export. Supports both calling conventions:
 * - `styled('div')` or `styled(Component)` → returns tagged template function
 * - `styled('div', { shouldForwardProp })` → with custom prop filtering
 * - `styled.div` → shorthand via Proxy (no options)
 */
// Cache template functions per tag to avoid closure allocation on every Proxy
// get. null-proto plain object: V8 inlines `proxyCache[prop]` as monomorphic
// dict-mode access on a known-shape object; `Map.get` goes through a polymorphic
// IC shared with every Map in the runtime.
const proxyCache: Record<string, Function> = Object.create(null)

export const styled: typeof styledFactory &
  Record<
    string,
    (strings: TemplateStringsArray, ...values: Interpolation[]) => any
  > = new Proxy(styledFactory as any, {
  get(_target: unknown, prop: string) {
    if (prop === 'prototype' || prop === '$$typeof') return undefined
    // styled.div`...`, styled.span`...`, etc.
    let fn = proxyCache[prop]
    if (!fn) {
      fn = (strings: TemplateStringsArray, ...values: Interpolation[]) =>
        createStyledComponent(prop, strings, values)
      proxyCache[prop] = fn
    }
    return fn
  },
})
