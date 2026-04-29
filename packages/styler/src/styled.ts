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
import { sheet } from './sheet'
import { useTheme } from './ThemeProvider'

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
const staticComponentCache = new WeakMap<
  TemplateStringsArray,
  Map<Tag, ComponentType<any>>
>()

// Single-entry hot cache — just 3 reference comparisons, no Map/WeakMap overhead.
// Covers the most common pattern: same styled component created repeatedly.
let _hotStrings: TemplateStringsArray | null = null
let _hotTag: Tag | null = null
let _hotComponent: ComponentType<any> | null = null

const createStyledComponent = (
  tag: Tag,
  strings: TemplateStringsArray,
  values: Interpolation[],
  options?: StyledOptions,
  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: hot-path styled factory — static/dynamic split + hot cache + SSR/client branches inlined for perf
) => {
  // Ultra-fast hot cache: 3 reference comparisons → return immediately
  if (values.length === 0 && !options) {
    // biome-ignore lint/style/noNonNullAssertion: invariant — when _hotStrings/_hotTag match, _hotComponent was assigned in the prior call
    if (strings === _hotStrings && tag === _hotTag) return _hotComponent!

    // WeakMap fallback for alternating patterns
    const tagMap = staticComponentCache.get(strings)
    if (tagMap) {
      const cached = tagMap.get(tag)
      if (cached) {
        _hotStrings = strings
        _hotTag = tag
        _hotComponent = cached
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

    const StaticStyled = ({ ref, ...rawProps }: Record<string, any>) => {
      const finalTag = rawProps.as || tag
      const isDOM = typeof finalTag === 'string'
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

    // Store in component cache + hot cache for future reuse
    if (!options && values.length === 0) {
      let tagMap = staticComponentCache.get(strings)
      if (!tagMap) {
        tagMap = new Map()
        staticComponentCache.set(strings, tagMap)
      }
      tagMap.set(tag, StaticStyled)
      _hotStrings = strings
      _hotTag = tag
      _hotComponent = StaticStyled
    }

    return StaticStyled
  }

  // DYNAMIC PATH: resolve CSS on every render with theme/props.
  // Client: useInsertionEffect injects into shared sheet (1 DOM node, scales to any size).
  // SSR: <style precedence> for FOUC-free delivery (useInsertionEffect is a no-op on server).
  // useRef cache avoids recomputing when CSS text hasn't changed between renders.
  const DynamicStyled = ({ ref, ...rawProps }: Record<string, any>) => {
    const theme = useTheme()
    // Mutate rawProps to inject theme for resolve(), restore afterwards.
    // rawProps is freshly created by the destructure spread above — no caller
    // holds its reference yet, so mutation is safe. Avoids a second n-key spread.
    const hadTheme = 'theme' in rawProps
    const prevTheme = rawProps.theme
    rawProps.theme = theme
    const cssText = normalizeCSS(resolve(strings, values, rawProps))
    if (hadTheme) rawProps.theme = prevTheme
    else delete rawProps.theme

    const cacheRef = useRef<{
      css: string
      className: string
      styleEl: ReturnType<typeof createElement> | null
    }>({ css: '', className: '', styleEl: null })

    let className: string
    let styleEl: ReturnType<typeof createElement> | null = null

    if (cssText === cacheRef.current.css) {
      // Cache hit — reuse className and style element (if SSR)
      className = cacheRef.current.className
      styleEl = cacheRef.current.styleEl
    } else {
      // Cache miss — recompute
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
      cacheRef.current = { css: cssText, className, styleEl }
    }

    // Client: inject CSS synchronously before paint (no-op on server)
    useInsertionEffect(() => {
      if (cssText.length > 0) sheet.insert(cssText, boost)
    }, [cssText])

    const finalTag = rawProps.as || tag
    const isDOM = typeof finalTag === 'string'
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
// Cache template functions per tag to avoid closure allocation on every Proxy get
const proxyCache = new Map<string, Function>()

export const styled: typeof styledFactory &
  Record<
    string,
    (strings: TemplateStringsArray, ...values: Interpolation[]) => any
  > = new Proxy(styledFactory as any, {
  get(_target: unknown, prop: string) {
    if (prop === 'prototype' || prop === '$$typeof') return undefined
    // styled.div`...`, styled.span`...`, etc.
    let fn = proxyCache.get(prop)
    if (!fn) {
      fn = (strings: TemplateStringsArray, ...values: Interpolation[]) =>
        createStyledComponent(prop, strings, values)
      proxyCache.set(prop, fn)
    }
    return fn
  },
})
