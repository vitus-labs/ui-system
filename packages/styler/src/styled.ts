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
  type ReactElement,
  useInsertionEffect,
  useRef,
} from 'react'
// React 19's `createElement` always copies props via for-in. `jsx`/`jsxs`
// from the JSX runtime skip the copy when no `key` is set on config —
// `buildProps` never writes `key`, so every styled render benefits.
// Saves ~30-80 ns per call relative to createElement.
import { Fragment, jsx, jsxs } from 'react/jsx-runtime'
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
    let cachedStyleEl: ReactElement | null = null

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
      cachedStyleEl = jsx('style', {
        href: staticClassName,
        precedence: 'medium',
        children: prepared.rules,
      })
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
    const baselineMainEl = jsx(tag as any, {
      className: staticClassName || undefined,
    })
    const baselineFragmentEl = cachedStyleEl
      ? jsxs(Fragment, { children: [cachedStyleEl, baselineMainEl] })
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

      const mainEl = jsx(finalTag as any, finalProps)

      if (!cachedStyleEl) return mainEl
      return jsxs(Fragment, { children: [cachedStyleEl, mainEl] })
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

  // SSR: cache the `<style precedence>` ReactElement keyed by the object
  // `sheet.prepare()` returns. prepare() returns the SAME `{className, rules}`
  // reference for a repeated cssText (its own cache), so the WeakMap hits
  // whenever the resolved CSS repeats — every render in `ssr-themed` (constant
  // theme → one cssText), all-but-2 in `ssr-dynamic`. React elements are
  // immutable and `<style precedence>` dedupes by href, so sharing the
  // reference across renders is safe — same trick as the static path's
  // `cachedStyleEl`. Saves one jsx('style') + its props-object allocation
  // per render on hit.
  const ssrStyleElCache: WeakMap<object, ReactElement> | null = IS_SERVER
    ? new WeakMap()
    : null

  // DYNAMIC PATH — two function bodies, chosen by IS_SERVER at module load.
  // The server variant drops `useRef` LRU + `useInsertionEffect` (no DOM to
  // inject into; React's server renderer no-ops the effect anyway), saving
  // ~120-200 ns per render on closure + deps-array + ref allocation.
  // The client variant keeps the LRU cache for alternating-prop renders
  // (toggle/hover/animation) and `useInsertionEffect` for synchronous CSS
  // injection before paint.
  //
  // React hooks rules are per-function-body: both variants call their hooks
  // unconditionally; the choice between bodies happens at module load.

  const DynamicStyled: ComponentType<any> = IS_SERVER
    ? // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: hot-path SSR render — styleEl cache + prepare + buildProps inlined for perf
      ({ ref, ...rawProps }: Record<string, any>) => {
        const theme = useTheme()
        if (theme !== EMPTY_THEME && rawProps.theme === undefined)
          rawProps.theme = theme
        const cssText = normalizeCSS(resolve(strings, values, rawProps))

        let className = ''
        let styleEl: ReactElement | null = null
        if (cssText.length > 0) {
          // SSR: emit a <style precedence> element. We deliberately do NOT
          // call sheet.insert() — that would push to ssrBuffer and, after
          // hydration, the same rule would re-insert via insertRule on
          // first client render (duplication). React 19 collects and
          // dedupes <style precedence> emissions automatically.
          const prepared = sheet.prepare(cssText, boost)
          className = prepared.className
          // biome-ignore lint/style/noNonNullAssertion: ssrStyleElCache is non-null whenever this SSR body runs (IS_SERVER)
          const cache = ssrStyleElCache!
          const cachedEl = cache.get(prepared)
          if (cachedEl !== undefined) {
            styleEl = cachedEl
          } else {
            styleEl = jsx('style', {
              href: prepared.className,
              precedence: 'medium',
              children: prepared.rules,
            })
            cache.set(prepared, styleEl)
          }
        }

        const finalTag = rawProps.as || tag
        const isDOM = finalTag === tag ? tagIsDOM : typeof finalTag === 'string'
        const finalProps = buildProps(
          rawProps,
          className,
          ref,
          isDOM,
          customFilter,
        )

        const mainEl = jsx(finalTag as any, finalProps)

        if (!styleEl) return mainEl
        return jsxs(Fragment, { children: [styleEl, mainEl] })
      }
    : // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: hot-path client render — LRU + useInsertionEffect inlined for perf
      ({ ref, ...rawProps }: Record<string, any>) => {
        const theme = useTheme()
        if (theme !== EMPTY_THEME && rawProps.theme === undefined)
          rawProps.theme = theme
        const cssText = normalizeCSS(resolve(strings, values, rawProps))

        // Two-entry LRU cache. The previous single-slot ref missed every
        // render when a prop alternates between two values (toggle/hover/
        // animation frame, etc.), forcing repeated getClassName work even
        // though both class names are already cached upstream.
        type DynEntry = {
          css: string
          className: string
        }
        // Lazy init — useRef(initialValue) evaluates initialValue every
        // render even though React only uses it on first mount.
        const cacheRef = useRef<{
          a: DynEntry | null
          b: DynEntry | null
        } | null>(null)
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
        if (entry) {
          className = entry.className
        } else {
          className = cssText.length > 0 ? sheet.getClassName(cssText) : ''
          // Insert as new head; the prior head ages out to the tail slot.
          cur.b = cur.a
          cur.a = { css: cssText, className }
        }

        // Inject CSS synchronously before paint.
        useInsertionEffect(() => {
          if (cssText.length > 0) sheet.insert(cssText, boost)
        }, [cssText])

        const finalTag = rawProps.as || tag
        const isDOM = finalTag === tag ? tagIsDOM : typeof finalTag === 'string'
        const finalProps = buildProps(
          rawProps,
          className,
          ref,
          isDOM,
          customFilter,
        )

        return jsx(finalTag as any, finalProps)
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
