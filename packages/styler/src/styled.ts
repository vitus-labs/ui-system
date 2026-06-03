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
// jsx/jsxs skip createElement's unconditional props copy when no `key` is set.
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

// Component cache (single-tag entries stored as tuple, multi-tag promoted to Map).
type StaticEntry =
  | readonly [Tag, ComponentType<any>]
  | Map<Tag, ComponentType<any>>
let staticComponentCache = new WeakMap<TemplateStringsArray, StaticEntry>()

// Single-entry hot cache in front of staticComponentCache (HMR-resettable).
const hotCache: {
  strings: TemplateStringsArray | null
  tag: Tag | null
  component: ComponentType<any> | null
} = { strings: null, tag: null, component: null }

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
  if (values.length === 0 && !options) {
    if (strings === hotCache.strings && tag === hotCache.tag)
      // biome-ignore lint/style/noNonNullAssertion: invariant — hotCache.component is assigned when strings/tag match
      return hotCache.component!

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

  const hasDynamicValues = values.length > 0 && values.some(isDynamic)
  const customFilter = options ? options.shouldForwardProp : undefined
  const boost = options ? (options.boost ?? false) : false

  // STATIC PATH: no function interpolations → compute className once at module load.
  if (!hasDynamicValues) {
    // biome-ignore lint/style/noNonNullAssertion: tagged template guarantee — strings.length >= 1
    const raw = values.length === 0 ? strings[0]! : resolve(strings, values, {})
    const cssText = normalizeCSS(raw)
    const hasCss = cssText.length > 0

    let staticClassName: string
    let cachedStyleEl: ReactElement | null = null

    if (!hasCss) {
      staticClassName = ''
    } else if (IS_SERVER) {
      // SSR: emit <style precedence> only. Calling sheet.insert() would push to
      // ssrBuffer AND re-insert via insertRule on first client render after
      // hydrating from <style data-precedence> — duplicate rules. React 19
      // dedupes precedence emissions automatically.
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

    const tagIsDOM = typeof tag === 'string'

    // Pre-built ReactElement returned on prop-less renders (the common case).
    const baselineMainEl = jsx(tag as any, {
      className: staticClassName || undefined,
    })
    const baselineFragmentEl = cachedStyleEl
      ? jsxs(Fragment, { children: [cachedStyleEl, baselineMainEl] })
      : baselineMainEl

    const StaticStyled = ({ ref, ...rawProps }: Record<string, any>) => {
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

  const tagIsDOM = typeof tag === 'string'

  // DYNAMIC PATH — two variants chosen by IS_SERVER at module load. The server
  // variant drops useRef LRU + useInsertionEffect (dead weight on SSR).
  const DynamicStyled: ComponentType<any> = IS_SERVER
    ? ({ ref, ...rawProps }: Record<string, any>) => {
        const theme = useTheme()
        if (theme !== EMPTY_THEME && rawProps.theme === undefined)
          rawProps.theme = theme
        const cssText = normalizeCSS(resolve(strings, values, rawProps))

        let className = ''
        let styleEl: ReactElement | null = null
        if (cssText.length > 0) {
          // SSR: emit <style precedence> only; sheet.insert() would dupe on hydration.
          const prepared = sheet.prepare(cssText, boost)
          className = prepared.className
          styleEl = jsx('style', {
            href: prepared.className,
            precedence: 'medium',
            children: prepared.rules,
          })
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

        // 2-slot LRU keyed on cssText — alternating prop values (toggle/hover) hit.
        type DynEntry = { css: string; className: string }
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
// null-proto: V8 inlines `proxyCache[prop]` faster than Map.get's polymorphic IC.
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
