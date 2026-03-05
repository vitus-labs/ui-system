'use client'

/**
 * styled() component factory. Creates React components that inject CSS
 * class names from tagged template literals.
 *
 * Supports:
 * - styled('div')`...` and styled(Component)`...`
 * - styled.div`...` (via Proxy)
 * - `as` prop for polymorphic rendering
 * - forwardRef for ref forwarding
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
  forwardRef,
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
  Map<Tag, ReturnType<typeof forwardRef>>
>()

// Single-entry hot cache — just 3 reference comparisons, no Map/WeakMap overhead.
// Covers the most common pattern: same styled component created repeatedly.
let _hotStrings: TemplateStringsArray | null = null
let _hotTag: Tag | null = null
let _hotComponent: ReturnType<typeof forwardRef> | null = null

const createStyledComponent = (
  tag: Tag,
  strings: TemplateStringsArray,
  values: Interpolation[],
  options?: StyledOptions,
) => {
  // Ultra-fast hot cache: 3 reference comparisons → return immediately
  if (values.length === 0 && !options) {
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
    const raw =
      values.length === 0 ? strings[0]! : resolve(strings, values, {})
    const cssText = normalizeCSS(raw)
    const hasCss = cssText.length > 0 && cssText.trim().length > 0

    let staticClassName: string
    let cachedStyleEl: ReturnType<typeof createElement> | null = null

    if (!hasCss) {
      staticClassName = ''
    } else if (IS_SERVER) {
      // SSR: need both className + rules for <style precedence> element
      const prepared = sheet.prepare(cssText, boost)
      staticClassName = prepared.className
      sheet.insert(cssText, boost)
      cachedStyleEl = createElement(
        'style',
        { href: staticClassName, precedence: 'medium' },
        prepared.rules,
      )
    } else {
      // Client: insert() returns className and handles caching — skip prepare() entirely
      staticClassName = sheet.insert(cssText, boost)
    }

    const StaticStyled = forwardRef<unknown, Record<string, any>>(
      (rawProps, ref) => {
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
      },
    )

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
  const DynamicStyled = forwardRef<unknown, Record<string, any>>(
    (rawProps, ref) => {
      const theme = useTheme()
      const allProps = { ...rawProps, theme }
      const cssText = normalizeCSS(resolve(strings, values, allProps))

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
        if (cssText.trim()) {
          if (IS_SERVER) {
            // SSR: compute rules for <style precedence>, inject into ssrBuffer
            const prepared = sheet.prepare(cssText, boost)
            className = prepared.className
            sheet.insert(cssText, boost)
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
        if (cssText.trim()) sheet.insert(cssText, boost)
      }, [cssText])

      const finalTag = rawProps.as || tag
      const isDOM = typeof finalTag === 'string'
      const finalProps = buildProps(
        rawProps,
        className,
        ref,
        isDOM,
        customFilter,
      )

      const mainEl = createElement(finalTag, finalProps)

      if (!styleEl) return mainEl
      return createElement(Fragment, null, styleEl, mainEl)
    },
  )

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
